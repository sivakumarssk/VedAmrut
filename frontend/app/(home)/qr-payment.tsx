import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
   Modal,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import ScreenHeader from "@/components/common/ScreenHeader";

import {
  API_BASE_URL,
} from "@/constants/api";

import {
  getToken,
} from "@/utils/storage";

// =====================================================
// TYPES
// =====================================================

type PaymentMethod =
  | "wallet"
  | "upi"
  | "card"
  | "cod";

type BackendPaymentMethod =
  | "WALLET"
  | "UPI"
  | "SPLIT";

type PaymentResponse = {
  success: boolean;
  message?: string;

  data?: {
    transaction?: {
      id?: number;
      amount?: string | number;
      transaction_type?: string;
      description?: string;
      created_at?: string;
      balance_after?: string | number | null;
    };

    wallet?: {
      id?: number;
      user_id?: number;
      balance?: string | number;
    };

    previous_balance?: string | number;

    remaining_balance?: string | number;

    balance?: string | number;

    total_paid?: string | number;

    wallet_paid?: string | number;

    upi_paid?: string | number;

    payment?: {
      id?: number;
      amount?: string | number;
      status?: string;
      payment_method?: string;
      product_amount?: string | number;
      wallet_amount?: string | number;
      upi_amount?: string | number;
      payment_status?: string;
      gateway_payment_id?: string | null;
    };

    order?: {
      id?: number;
      status?: string;
      payment_method?: string;
    };

    qr?: {
      id?: number;
      qr_code?: string;
      is_claimed?: boolean;
      reward_amount?: string | number;
    };

    product?: {
      id?: number;
      name?: string;
      price?: string | number;
    };
  };
};

// =====================================================
// HELPERS
// =====================================================

const getParam = (
  value?: string | string[]
): string => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

const toNumber = (
  value:
    | string
    | number
    | null
    | undefined
): number => {
  const numberValue = Number(value);

  if (
    Number.isNaN(numberValue) ||
    !Number.isFinite(numberValue)
  ) {
    return 0;
  }

  return numberValue;
};

const formatMoney = (
  value:
    | string
    | number
    | null
    | undefined
): string => {
  return `₹${toNumber(value).toFixed(2)}`;
};

// =====================================================
// IMAGE URL
// =====================================================

const getProductImageUrl = (
  image?: string | null
): string | null => {
  if (!image) {
    return null;
  }

  const trimmedImage =
    String(image).trim();

  if (!trimmedImage) {
    return null;
  }

  if (
    trimmedImage.startsWith("http://") ||
    trimmedImage.startsWith("https://")
  ) {
    return trimmedImage;
  }

  return `${API_BASE_URL}/uploads/${encodeURIComponent(
    trimmedImage
  )}`;
};

// =====================================================
// SCREEN
// =====================================================

export default function QRPaymentScreen() {
  const params =
    useLocalSearchParams<{
      productId?: string | string[];
      qrCode?: string | string[];
      productName?: string | string[];
      productDescription?: string | string[];
      productPrice?: string | string[];
      productImage?: string | string[];
      categoryName?: string | string[];
      unitNumber?: string | string[];
      reward?: string | string[];
      rewardClaimed?: string | string[];
    }>();

  // ===================================================
  // PARAMS
  // ===================================================

  const productId =
    getParam(params.productId);

  const qrCode =
    getParam(params.qrCode);

  const productName =
    getParam(params.productName) ||
    "VedAmrut Product";

  const productDescription =
    getParam(
      params.productDescription
    ) ||
    "Natural VedAmrut wellness product.";

  const productPrice =
    toNumber(
      getParam(params.productPrice)
    );

  const productImage =
    getParam(params.productImage);

  const categoryName =
    getParam(params.categoryName) ||
    "Wellness";

  const unitNumber =
    getParam(params.unitNumber) ||
    "-";

  const reward =
    toNumber(
      getParam(params.reward)
    );

  const rewardClaimed =
    getParam(
      params.rewardClaimed
    ) === "true";

  // ===================================================
  // STATE
  // ===================================================

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState<PaymentMethod>("wallet");

  const [
    paymentLoading,
    setPaymentLoading,
  ] = useState(false);

  const [
    rewardLoading,
    setRewardLoading,
  ] = useState(false);

  const [
    walletBalance,
    setWalletBalance,
  ] = useState<number | null>(null);

  const [
    walletLoading,
    setWalletLoading,
  ] = useState(true);

  const [
    walletAmount,
    setWalletAmount,
  ] = useState(0);

  const [
    imageError,
    setImageError,
  ] = useState(false);

  const [
    rewardAdded,
    setRewardAdded,
  ] = useState(
    rewardClaimed
  );
const [alertVisible, setAlertVisible] = useState(false);
const [alertTitle, setAlertTitle] = useState("");
const [alertMessage, setAlertMessage] = useState("");
const [alertAction, setAlertAction] = useState<
  (() => void | Promise<void>) | null
>(null);
const showCustomAlert = (
  title: string,
  message: string,
  action?: () => void | Promise<void>
) => {
  setAlertTitle(title);
  setAlertMessage(message);
  setAlertAction(() => action || null);
  setAlertVisible(true);
};
  // ===================================================
  // SPLIT PAYMENT CALCULATIONS
  // ===================================================

  const maxWalletAmount =
    Math.min(
      walletBalance ?? 0,
      productPrice
    );

  const safeWalletAmount =
    Math.min(
      Math.max(
        walletAmount,
        0
      ),
      maxWalletAmount
    );

  const remainingAmount =
    Math.max(
      productPrice -
        safeWalletAmount,
      0
    );

  // ===================================================
  // IMAGE
  // ===================================================

  const productImageUrl =
    useMemo(
      () =>
        getProductImageUrl(
          productImage
        ),
      [productImage]
    );

  // ===================================================
  // LOAD WALLET
  // ===================================================

  useEffect(() => {
    loadWallet();
  }, []);

  // ===================================================
  // KEEP WALLET AMOUNT VALID
  // ===================================================

  useEffect(() => {
    if (walletBalance === null) {
      return;
    }

    setWalletAmount(
      (current) =>
        Math.min(
          Math.max(
            current,
            0
          ),
          Math.min(
            walletBalance,
            productPrice
          )
        )
    );
  }, [
    walletBalance,
    productPrice,
  ]);

  // ===================================================
  // LOAD WALLET FUNCTION
  // ===================================================

  const loadWallet =
    async () => {
      try {
        setWalletLoading(true);

        const token =
          await getToken();

        if (!token) {
          setWalletBalance(0);
          return;
        }

        console.log(
          "================================"
        );

        console.log(
          "LOADING WALLET"
        );

        console.log(
          "================================"
        );

        const response =
          await fetch(
            `${API_BASE_URL}/api/wallet`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        const result =
          await response.json();

        console.log(
          "WALLET STATUS:",
          response.status
        );

        console.log(
          "WALLET RESPONSE:",
          JSON.stringify(
            result,
            null,
            2
          )
        );

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to load wallet."
          );
        }

        const balance =
          toNumber(
            result?.data?.balance ??
              result?.data?.wallet
                ?.balance ??
              result?.balance ??
              result?.wallet
                ?.balance ??
              0
          );

        setWalletBalance(
          balance
        );
      } catch (error) {
        console.error(
          "WALLET LOAD ERROR:",
          error
        );

        setWalletBalance(0);
      } finally {
        setWalletLoading(false);
      }
    };

  // ===================================================
  // ADD REWARD TO WALLET
  // ===================================================

  const handleAddRewardToWallet =
    async () => {
      if (
        rewardLoading ||
        rewardAdded ||
        reward <= 0
      ) {
        return;
      }

      const token =
        await getToken();

      if (!token) {
       showCustomAlert(
  "Login Required",
  "Please login to add your reward to wallet."
);

        return;
      }

      try {
        setRewardLoading(true);

        console.log(
          "================================"
        );

        console.log(
          "ADDING QR REWARD TO WALLET"
        );

        console.log(
          "QR CODE:",
          qrCode
        );

        console.log(
          "REWARD:",
          reward
        );

        console.log(
          "================================"
        );

        const response =
          await fetch(
            `${API_BASE_URL}/api/product-qr/claim`,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                qrCode,
              }),
            }
          );

        const result =
          await response.json();

        console.log(
          "REWARD RESPONSE:",
          JSON.stringify(
            result,
            null,
            2
          )
        );

        if (
          !response.ok ||
          !result?.success
        ) {
          throw new Error(
            result?.message ||
              "Unable to claim reward."
          );
        }

        setRewardAdded(true);

        showCustomAlert(
  "Reward Added 🎉",
  `${formatMoney(
    reward
  )} has been added to your VedAmrut wallet.`,
  loadWallet
);
      } catch (error: any) {
        console.error(
          "REWARD ERROR:",
          error
        );

       showCustomAlert(
  "Reward Failed",
  error?.message ||
    "Unable to add reward to wallet."
);
      } finally {
        setRewardLoading(false);
      }
    };

  // ===================================================
  // WALLET / SPLIT / MOCK UPI PAYMENT
  // ===================================================

  const payUsingWallet =
    async (
      token: string
    ) => {
      let finalPaymentMethod:
        BackendPaymentMethod;

      if (
        safeWalletAmount >=
        productPrice
      ) {
        finalPaymentMethod =
          "WALLET";
      } else if (
        safeWalletAmount > 0
      ) {
        finalPaymentMethod =
          "SPLIT";
      } else {
        finalPaymentMethod =
          "UPI";
      }

      console.log(
        "================================"
      );

      console.log(
        "QR PAYMENT"
      );

      console.log(
        "PRODUCT:",
        productName
      );

      console.log(
        "PRODUCT AMOUNT:",
        productPrice
      );

      console.log(
        "WALLET AMOUNT:",
        safeWalletAmount
      );

      console.log(
        "UPI AMOUNT:",
        remainingAmount
      );

      console.log(
        "PAYMENT METHOD:",
        finalPaymentMethod
      );

      console.log(
        "================================"
      );

      const paymentUrl =
        `${API_BASE_URL}/api/wallet/pay-qr-split`;

      const response =
        await fetch(
          paymentUrl,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              productId:
                Number(productId),

              qrCode,

              walletAmount:
                safeWalletAmount,

              paymentMethod:
                finalPaymentMethod,

              description:
                `QR ${finalPaymentMethod.toLowerCase()} payment - ${productName}`,
            }),
          }
        );

      const result =
        (await response.json()) as PaymentResponse;

      console.log(
        "PAYMENT RESPONSE:",
        JSON.stringify(
          result,
          null,
          2
        )
      );

      if (
        !response.ok ||
        !result?.success
      ) {
        throw new Error(
          result?.message ||
            "Payment failed."
        );
      }

      return result;
    };

  // ===================================================
  // MOCK UPI PAYMENT
  // ===================================================

  const payUsingMockUPI =
    async (
      token: string,
      walletPart: number
    ) => {
      const upiPart =
        Math.max(
          productPrice -
            walletPart,
          0
        );

      console.log(
        "================================"
      );

      console.log(
        "PRACTICE UPI PAYMENT"
      );

      console.log(
        "PRODUCT AMOUNT:",
        productPrice
      );

      console.log(
        "WALLET AMOUNT:",
        walletPart
      );

      console.log(
        "MOCK UPI AMOUNT:",
        upiPart
      );

      console.log(
        "================================"
      );

      const paymentUrl =
        `${API_BASE_URL}/api/wallet/pay-qr-split`;

      const response =
        await fetch(
          paymentUrl,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              productId:
                Number(productId),

              qrCode,

              walletAmount:
                walletPart,

              paymentMethod:
                walletPart > 0
                  ? "SPLIT"
                  : "UPI",

              description:
                walletPart > 0
                  ? `QR split payment - ${productName}`
                  : `QR mock UPI payment - ${productName}`,
            }),
          }
        );

      const result =
        (await response.json()) as PaymentResponse;

      console.log(
        "MOCK UPI RESPONSE:",
        JSON.stringify(
          result,
          null,
          2
        )
      );

      if (
        !response.ok ||
        !result?.success
      ) {
        throw new Error(
          result?.message ||
            "Mock UPI payment failed."
        );
      }

      return result;
    };

  // ===================================================
  // CARD / COD
  // ===================================================

  const handleExternalPayment =
    async (
      method: PaymentMethod,
      amount: number
    ) => {
      console.log(
        "EXTERNAL PAYMENT:",
        method
      );

      console.log(
        "EXTERNAL AMOUNT:",
        amount
      );

      if (method === "card") {
        showCustomAlert(
  "Card Payment",
  `Card payment of ${formatMoney(
    amount
  )} will be available after payment gateway integration.`
);

        return null;
      }

      if (method === "cod") {
       showCustomAlert(
  "Cash on Delivery",
  "COD order creation needs to be connected to the order backend."
);

        return null;
      }

      return null;
    };

  // ===================================================
  // PAYMENT
  // ===================================================

  const handlePayment =
    async () => {
      if (paymentLoading) {
        return;
      }

      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (!productId) {
        showCustomAlert(
  "Payment Error",
  "Product information is missing."
);

        return;
      }

      if (!qrCode) {
       showCustomAlert(
  "Payment Error",
  "QR code is missing."
);

        return;
      }

      if (productPrice <= 0) {
        showCustomAlert(
  "Payment Error",
  "Invalid product price."
);

        return;
      }

      // -----------------------------------------------
      // LOGIN
      // -----------------------------------------------

      const token =
        await getToken();

      if (!token) {
        showCustomAlert(
  "Login Required",
  "Please login to make the payment."
);

        return;
      }

      // -----------------------------------------------
      // WALLET PAYMENT
      // -----------------------------------------------

      if (
        paymentMethod ===
        "wallet"
      ) {
        if (
          walletBalance ===
          null
        ) {
          showCustomAlert(
  "Wallet",
  "Unable to check wallet balance."
);

          return;
        }

        if (
          safeWalletAmount < 0
        ) {
          showCustomAlert(
  "Invalid Amount",
  "Wallet amount cannot be negative."
);

          return;
        }

        if (
          safeWalletAmount >
          walletBalance
        ) {
          showCustomAlert(
  "Invalid Amount",
  "Wallet amount cannot exceed your wallet balance."
);

          return;
        }

        if (
          safeWalletAmount >
          productPrice
        ) {
         showCustomAlert(
  "Invalid Amount",
  "Wallet amount cannot exceed the product price."
);

          return;
        }

        if (
          safeWalletAmount === 0
        ) {
         showCustomAlert(
  "Wallet Amount",
  "Please enter an amount to use from your wallet."
);

          return;
        }
      }

      // -----------------------------------------------
      // UPI ONLY
      // -----------------------------------------------

      if (
        paymentMethod ===
        "upi"
      ) {
        try {
          setPaymentLoading(true);

          console.log(
            "================================"
          );

          console.log(
            "MOCK UPI ONLY PAYMENT"
          );

          console.log(
            "PRODUCT AMOUNT:",
            productPrice
          );

          console.log(
            "UPI AMOUNT:",
            productPrice
          );

          console.log(
            "================================"
          );

          const result =
            await payUsingMockUPI(
              token,
              0
            );

          if (
            !result?.success
          ) {
            throw new Error(
              result?.message ||
                "UPI payment failed."
            );
          }

          const paymentData =
            result?.data;

          const remainingBalance =
            toNumber(
              paymentData
                ?.remaining_balance ??
                paymentData
                  ?.wallet
                  ?.balance ??
                paymentData
                  ?.balance ??
                walletBalance ??
                0
            );

          router.replace({
            pathname:
              "/(home)/qr-payment-success",

            params: {
              productId:
                String(productId),

              qrCode:
                String(qrCode),

              productName:
                String(productName),

              productPrice:
                String(productPrice),

              reward:
                String(reward),

              rewardClaimed:
                String(
                  rewardAdded
                ),

              remainingBalance:
                String(
                  remainingBalance
                ),

              paymentMethod:
                "upi",

              walletUsed:
                "0",

              upiPaid:
                String(
                  productPrice
                ),

              categoryName:
                String(
                  categoryName
                ),

              productImage:
                String(
                  productImage ||
                    ""
                ),

              unitNumber:
                String(
                  unitNumber
                ),
            },
          });

          return;
        } catch (error: any) {
          console.error(
            "UPI PAYMENT ERROR:",
            error
          );

          showCustomAlert(
  "Payment Failed",
  error?.message ||
    "Unable to complete UPI payment."
);

          return;
        } finally {
          setPaymentLoading(false);
        }
      }

      // -----------------------------------------------
      // CARD / COD
      // -----------------------------------------------

      if (
        paymentMethod ===
          "card" ||
        paymentMethod ===
          "cod"
      ) {
        try {
          setPaymentLoading(true);

          const result =
            await handleExternalPayment(
              paymentMethod,
              productPrice
            );

          if (!result) {
            return;
          }
        } finally {
          setPaymentLoading(false);
        }

        return;
      }

      // -----------------------------------------------
      // WALLET / SPLIT
      // -----------------------------------------------

      try {
        setPaymentLoading(
          true
        );

        console.log(
          "================================"
        );

        console.log(
          "QR PAYMENT STARTED"
        );

        console.log(
          "PAYMENT METHOD:",
          paymentMethod
        );

        console.log(
          "PRODUCT:",
          productName
        );

        console.log(
          "PRODUCT PRICE:",
          productPrice
        );

        console.log(
          "WALLET AMOUNT:",
          safeWalletAmount
        );

        console.log(
          "REMAINING UPI:",
          remainingAmount
        );

        console.log(
          "REWARD:",
          reward
        );

        console.log(
          "================================"
        );

        const result =
          await payUsingWallet(
            token
          );

        if (
          !result?.success
        ) {
          throw new Error(
            result?.message ||
              "Payment failed."
          );
        }

        // ---------------------------------------------
        // PAYMENT DATA
        // ---------------------------------------------

        const paymentData =
          result?.data;

        const actualWalletPaid =
          toNumber(
            paymentData
              ?.wallet_paid ??
              paymentData
                ?.payment
                ?.wallet_amount ??
              safeWalletAmount
          );

        const actualUpiPaid =
          toNumber(
            paymentData
              ?.upi_paid ??
              paymentData
                ?.payment
                ?.upi_amount ??
              Math.max(
                productPrice -
                  actualWalletPaid,
                0
              )
          );

        const actualRemainingBalance =
          toNumber(
            paymentData
              ?.remaining_balance ??
              paymentData
                ?.wallet
                ?.balance ??
              paymentData
                ?.balance ??
              paymentData
                ?.transaction
                ?.balance_after ??
              walletBalance ??
              0
          );

        const backendPaymentMethod =
          paymentData
            ?.payment
            ?.payment_method;

        console.log(
          "================================"
        );

        console.log(
          "QR PAYMENT SUCCESS"
        );

        console.log(
          "PAYMENT METHOD:",
          backendPaymentMethod ||
            paymentMethod
        );

        console.log(
          "PRODUCT AMOUNT:",
          productPrice
        );

        console.log(
          "WALLET USED:",
          actualWalletPaid
        );

        console.log(
          "UPI PAID:",
          actualUpiPaid
        );

        console.log(
          "REWARD CLAIMED:",
          rewardAdded
        );

        console.log(
          "REMAINING WALLET BALANCE:",
          actualRemainingBalance
        );

        console.log(
          "================================"
        );

        // ---------------------------------------------
        // SUCCESS SCREEN
        // ---------------------------------------------

        router.replace({
          pathname:
            "/(home)/qr-payment-success",

          params: {
            productId:
              String(productId),

            qrCode:
              String(qrCode),

            productName:
              String(productName),

            productPrice:
              String(productPrice),

            reward:
              String(reward),

            rewardClaimed:
              String(
                rewardAdded
              ),

            remainingBalance:
              String(
                actualRemainingBalance
              ),

            paymentMethod:
              actualWalletPaid >=
              productPrice
                ? "wallet"
                : "split",

            walletUsed:
              String(
                actualWalletPaid
              ),

            upiPaid:
              String(
                actualUpiPaid
              ),

            categoryName:
              String(
                categoryName
              ),

            productImage:
              String(
                productImage ||
                  ""
              ),

            unitNumber:
              String(
                unitNumber
              ),
          },
        });
      } catch (error: any) {
        console.error(
          "================================"
        );

        console.error(
          "QR PAYMENT ERROR"
        );

        console.error(
          error
        );

        console.error(
          "================================"
        );

        showCustomAlert(
  "Payment Failed",
  error?.message ||
    "Unable to complete the payment. Please try again."
);
      } finally {
        setPaymentLoading(
          false
        );
      }
    };

  // ===================================================
  // PAYMENT METHOD DATA
  // ===================================================

  const paymentMethods = [
    {
      id: "wallet" as PaymentMethod,
      title: "Wallet",
      subtitle:
        walletLoading
          ? "Checking balance..."
          : walletBalance !==
            null
          ? `Balance ${formatMoney(
              walletBalance
            )}`
          : "VedAmrut Wallet",
      icon:
        "wallet-outline" as const,
    },

    {
      id: "upi" as PaymentMethod,
      title: "UPI",
      subtitle:
        "Practice UPI • Mock Payment",
      icon:
        "phone-portrait-outline" as const,
    },

    {
      id: "card" as PaymentMethod,
      title:
        "Credit / Debit Card",
      subtitle:
        "Gateway integration pending",
      icon:
        "card-outline" as const,
    },

    {
      id: "cod" as PaymentMethod,
      title:
        "Cash on Delivery",
      subtitle:
        "Order backend integration pending",
      icon:
        "cash-outline" as const,
    },
  ];

  // ===================================================
  // SCREEN
  // ===================================================

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ScreenHeader
        title="QR Payment"
        titleStyle={
          styles.headerTitle
        }
        iconColor="#FFFFFF"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* =================================================
            PAYMENT HEADER
        ================================================= */}

        <View
          style={
            styles.paymentHeader
          }
        >
          <View
            style={
              styles.paymentIconCircle
            }
          >
            <Ionicons
              name="qr-code-outline"
              size={34}
              color="#9B4DFF"
            />
          </View>

          <Text
            style={
              styles.paymentTitle
            }
          >
            Complete Your Payment
          </Text>

          <Text
            style={
              styles.paymentSubtitle
            }
          >
            Choose how you want to
            pay
          </Text>
        </View>

        {/* =================================================
            PRODUCT CARD
        ================================================= */}

        <View
          style={
            styles.productCard
          }
        >
          <View
            style={
              styles.productImageBox
            }
          >
            {productImageUrl &&
            !imageError ? (
              <Image
                source={{
                  uri: productImageUrl,
                }}
                style={
                  styles.productImage
                }
                resizeMode="contain"
                onError={() => {
                  setImageError(
                    true
                  );
                }}
              />
            ) : (
              <Ionicons
                name="cube-outline"
                size={45}
                color="#9B4DFF"
              />
            )}
          </View>

          <View
            style={
              styles.productInfo
            }
          >
            <Text
              style={
                styles.productCategory
              }
            >
              {categoryName}
            </Text>

            <Text
              style={
                styles.productName
              }
              numberOfLines={2}
            >
              {productName}
            </Text>

            <Text
              style={
                styles.productUnit
              }
            >
              Unit #{unitNumber}
            </Text>
          </View>
        </View>

        {/* =================================================
            AMOUNT CARD
        ================================================= */}

        <View
          style={
            styles.amountCard
          }
        >
          <Text
            style={
              styles.amountLabel
            }
          >
            TOTAL PAYABLE
          </Text>

          <Text
            style={
              styles.amount
            }
          >
            {formatMoney(
              productPrice
            )}
          </Text>

          <View
            style={
              styles.amountDivider
            }
          />

          <View
            style={
              styles.amountRow
            }
          >
            <Text
              style={
                styles.amountRowLabel
              }
            >
              Product Price
            </Text>

            <Text
              style={
                styles.amountRowValue
              }
            >
              {formatMoney(
                productPrice
              )}
            </Text>
          </View>

          <View
            style={
              styles.amountRow
            }
          >
            <Text
              style={
                styles.amountRowLabel
              }
            >
              QR Reward
            </Text>

            <Text
              style={
                rewardAdded
                  ? styles.rewardAdded
                  : styles.rewardNotUsed
              }
            >
              {reward > 0
                ? rewardAdded
                  ? `+${formatMoney(
                      reward
                    )} to wallet`
                  : `${formatMoney(
                      reward
                    )} available`
                : "₹0.00"}
            </Text>
          </View>

          <View
            style={
              styles.amountDivider
            }
          />

          <View
            style={
              styles.totalRow
            }
          >
            <Text
              style={
                styles.totalLabel
              }
            >
              {paymentMethod ===
              "wallet"
                ? remainingAmount >
                  0
                  ? "Remaining to Pay"
                  : "Paid from Wallet"
                : "Amount to Pay"}
            </Text>

            <Text
              style={
                styles.totalAmount
              }
            >
              {formatMoney(
                paymentMethod ===
                  "wallet"
                  ? remainingAmount
                  : productPrice
              )}
            </Text>
          </View>

          {/* PRACTICE PAYMENT NOTICE */}

          {paymentMethod ===
            "upi" && (
            <View
              style={
                styles.practiceNotice
              }
            >
              <Ionicons
                name="information-circle-outline"
                size={17}
                color="#9B4DFF"
              />

              <Text
                style={
                  styles.practiceNoticeText
                }
              >
                Practice mode: UPI payment
                is simulated. No real money
                will be charged.
              </Text>
            </View>
          )}
        </View>

        {/* =================================================
            REWARD CARD
        ================================================= */}

        {reward > 0 &&
          !rewardAdded && (
            <View
              style={
                styles.rewardCard
              }
            >
              <View
                style={
                  styles.rewardIcon
                }
              >
                <Ionicons
                  name="gift"
                  size={25}
                  color="#9B4DFF"
                />
              </View>

              <View
                style={
                  styles.rewardContent
                }
              >
                <Text
                  style={
                    styles.rewardTitle
                  }
                >
                  You earned a QR Reward!
                </Text>

                <Text
                  style={
                    styles.rewardText
                  }
                >
                  Add{" "}
                  {formatMoney(
                    reward
                  )}{" "}
                  to your wallet.
                </Text>

                <TouchableOpacity
                  style={
                    styles.rewardButton
                  }
                  onPress={
                    handleAddRewardToWallet
                  }
                  disabled={
                    rewardLoading
                  }
                >
                  {rewardLoading ? (
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />
                  ) : (
                    <>
                      <Ionicons
                        name="wallet-outline"
                        size={16}
                        color="#FFFFFF"
                      />

                      <Text
                        style={
                          styles.rewardButtonText
                        }
                      >
                        ADD TO WALLET
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

        {/* =================================================
            REWARD ADDED
        ================================================= */}

        {rewardAdded &&
          reward > 0 && (
            <View
              style={
                styles.rewardSuccessCard
              }
            >
              <Ionicons
                name="checkmark-circle"
                size={25}
                color="#27AE60"
              />

              <View
                style={
                  styles.rewardSuccessInfo
                }
              >
                <Text
                  style={
                    styles.rewardSuccessTitle
                  }
                >
                  Reward Added to Wallet
                </Text>

                <Text
                  style={
                    styles.rewardSuccessText
                  }
                >
                  {formatMoney(
                    reward
                  )}{" "}
                  has been credited to
                  your wallet.
                </Text>
              </View>
            </View>
          )}

        {/* =================================================
            PAYMENT METHODS
        ================================================= */}

        <View
          style={
            styles.sectionHeader
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Choose Payment Method
          </Text>

          <Text
            style={
              styles.sectionSubtitle
            }
          >
            Select one option
          </Text>
        </View>

        <View
          style={
            styles.paymentMethodsCard
          }
        >
          {paymentMethods.map(
            (method, index) => {
              const selected =
                paymentMethod ===
                method.id;

              const isLast =
                index ===
                paymentMethods.length -
                  1;

              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethod,
                    selected &&
                      styles.paymentMethodSelected,
                    !isLast &&
                      styles.paymentMethodBorder,
                  ]}
                  onPress={() =>
                    setPaymentMethod(
                      method.id
                    )
                  }
                  activeOpacity={
                    0.8
                  }
                >
                  <View
                    style={[
                      styles.methodIcon,
                      selected &&
                        styles.methodIconSelected,
                    ]}
                  >
                    <Ionicons
                      name={
                        method.icon
                      }
                      size={24}
                      color={
                        selected
                          ? "#FFFFFF"
                          : "#9B4DFF"
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.methodInfo
                    }
                  >
                    <Text
                      style={
                        styles.methodTitle
                      }
                    >
                      {method.title}
                    </Text>

                    <Text
                      style={
                        styles.methodSubtitle
                      }
                    >
                      {
                        method.subtitle
                      }
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radioOuter,
                      selected &&
                        styles.radioOuterSelected,
                    ]}
                  >
                    {selected && (
                      <View
                        style={
                          styles.radioInner
                        }
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            }
          )}
        </View>

        {/* =================================================
            WALLET
        ================================================= */}

        {paymentMethod ===
          "wallet" && (
          <>
            {/* WALLET BALANCE */}

            <View
              style={
                styles.walletCard
              }
            >
              <View
                style={
                  styles.walletIcon
                }
              >
                <Ionicons
                  name="wallet-outline"
                  size={25}
                  color="#9B4DFF"
                />
              </View>

              <View
                style={
                  styles.walletInfo
                }
              >
                <Text
                  style={
                    styles.walletLabel
                  }
                >
                  WALLET BALANCE
                </Text>

                {walletLoading ? (
                  <View
                    style={
                      styles.walletLoading
                    }
                  >
                    <ActivityIndicator
                      size="small"
                      color="#9B4DFF"
                    />

                    <Text
                      style={
                        styles.walletLoadingText
                      }
                    >
                      Checking balance...
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={
                      styles.walletBalance
                    }
                  >
                    {walletBalance !==
                    null
                      ? formatMoney(
                          walletBalance
                        )
                      : "₹0.00"}
                  </Text>
                )}
              </View>

              {!walletLoading &&
                walletBalance !==
                  null && (
                  <View
                    style={
                      styles.availableBadge
                    }
                  >
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color="#27AE60"
                    />

                    <Text
                      style={
                        styles.availableText
                      }
                    >
                      Available
                    </Text>
                  </View>
                )}
            </View>

            {/* WALLET PAYMENT INPUT */}

            {!walletLoading &&
              walletBalance !==
                null && (
                <View
                  style={
                    styles.walletPaymentCard
                  }
                >
                  <Text
                    style={
                      styles.walletPaymentTitle
                    }
                  >
                    Use Wallet Balance
                  </Text>

                  <Text
                    style={
                      styles.walletPaymentSubtitle
                    }
                  >
                    Enter how much you want
                    to pay from your wallet.
                  </Text>

                  <View
                    style={
                      styles.walletInputRow
                    }
                  >
                    <Text
                      style={
                        styles.rupeeSymbol
                      }
                    >
                      ₹
                    </Text>

                    <TextInput
                      value={
                        walletAmount ===
                        0
                          ? ""
                          : String(
                              walletAmount
                            )
                      }
                      onChangeText={(
                        text
                      ) => {
                        if (!text) {
                          setWalletAmount(
                            0
                          );

                          return;
                        }

                        const cleanedText =
                          text.replace(
                            /[^0-9.]/g,
                            ""
                          );

                        const numericValue =
                          Number(
                            cleanedText
                          );

                        if (
                          Number.isNaN(
                            numericValue
                          )
                        ) {
                          return;
                        }

                        setWalletAmount(
                          Math.min(
                            numericValue,
                            maxWalletAmount
                          )
                        );
                      }}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor="#AAAAAA"
                      style={
                        styles.walletInput
                      }
                    />

                    <TouchableOpacity
                      style={
                        styles.useMaxButton
                      }
                      onPress={() =>
                        setWalletAmount(
                          maxWalletAmount
                        )
                      }
                      activeOpacity={
                        0.8
                      }
                    >
                      <Text
                        style={
                          styles.useMaxText
                        }
                      >
                        USE MAX
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* PAYMENT BREAKDOWN */}

                  <View
                    style={
                      styles.paymentBreakdown
                    }
                  >
                    <View
                      style={
                        styles.breakdownRow
                      }
                    >
                      <Text
                        style={
                          styles.breakdownLabel
                        }
                      >
                        Product Amount
                      </Text>

                      <Text
                        style={
                          styles.breakdownValue
                        }
                      >
                        {formatMoney(
                          productPrice
                        )}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.breakdownRow
                      }
                    >
                      <Text
                        style={
                          styles.breakdownLabel
                        }
                      >
                        Wallet Used
                      </Text>

                      <Text
                        style={
                          styles.walletUsedValue
                        }
                      >
                        -
                        {formatMoney(
                          safeWalletAmount
                        )}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.breakdownDivider
                      }
                    />

                    <View
                      style={
                        styles.breakdownRow
                      }
                    >
                      <Text
                        style={
                          styles.remainingLabel
                        }
                      >
                        Remaining to Pay
                      </Text>

                      <Text
                        style={
                          styles.remainingValue
                        }
                      >
                        {formatMoney(
                          remainingAmount
                        )}
                      </Text>
                    </View>

                    {remainingAmount >
                      0 && (
                      <View
                        style={
                          styles.upiHint
                        }
                      >
                        <Ionicons
                          name="phone-portrait-outline"
                          size={16}
                          color="#9B4DFF"
                        />

                        <Text
                          style={
                            styles.upiHintText
                          }
                        >
                          Remaining amount will
                          be paid using Practice
                          UPI.
                        </Text>
                      </View>
                    )}

                    {remainingAmount ===
                      0 &&
                      safeWalletAmount >
                        0 && (
                        <View
                          style={
                            styles.walletFullHint
                          }
                        >
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={16}
                            color="#27AE60"
                          />

                          <Text
                            style={
                              styles.walletFullHintText
                            }
                          >
                            Full product amount will
                            be paid from your wallet.
                          </Text>
                        </View>
                      )}
                  </View>
                </View>
              )}
          </>
        )}

        {/* =================================================
            UPI PRACTICE INFORMATION
        ================================================= */}

        {paymentMethod ===
          "upi" && (
          <View
            style={
              styles.practiceCard
            }
          >
            <View
              style={
                styles.practiceIcon
              }
            >
              <Ionicons
                name="phone-portrait-outline"
                size={23}
                color="#9B4DFF"
              />
            </View>

            <View
              style={
                styles.practiceInfo
              }
            >
              <Text
                style={
                  styles.practiceTitle
                }
              >
                Practice UPI Payment
              </Text>

              <Text
                style={
                  styles.practiceText
                }
              >
                This is a mock payment for
                testing. No real UPI transaction
                will be made.
              </Text>
            </View>
          </View>
        )}

        {/* =================================================
            SECURITY
        ================================================= */}

        <View
          style={
            styles.securityCard
          }
        >
          <View
            style={
              styles.securityIcon
            }
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={23}
              color="#27AE60"
            />
          </View>

          <View
            style={
              styles.securityInfo
            }
          >
            <Text
              style={
                styles.securityTitle
              }
            >
              Secure Payment
            </Text>

            <Text
              style={
                styles.securityText
              }
            >
              Your payment information
              is securely processed.
            </Text>
          </View>
        </View>

        {/* =================================================
            PAY BUTTON
        ================================================= */}

        <TouchableOpacity
          style={[
            styles.payButton,
            paymentLoading &&
              styles.payButtonDisabled,
            paymentMethod ===
              "wallet" &&
              walletAmount === 0 &&
              styles.payButtonDisabled,
          ]}
          onPress={
            handlePayment
          }
          disabled={
            paymentLoading ||
            walletLoading ||
            (paymentMethod ===
              "wallet" &&
              walletAmount === 0)
          }
          activeOpacity={0.85}
        >
          {paymentLoading ? (
            <>
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.payButtonText
                }
              >
                PROCESSING...
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name={
                  paymentMethod ===
                  "wallet"
                    ? remainingAmount >
                      0
                      ? "phone-portrait-outline"
                      : "wallet-outline"
                    : paymentMethod ===
                      "upi"
                    ? "phone-portrait-outline"
                    : paymentMethod ===
                      "card"
                    ? "card-outline"
                    : "cash-outline"
                }
                size={20}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.payButtonText
                }
              >
                {paymentMethod ===
                "cod"
                  ? "PLACE COD ORDER"
                  : paymentMethod ===
                    "wallet"
                  ? remainingAmount >
                    0
                    ? `PAY ${formatMoney(
                        remainingAmount
                      )} WITH UPI`
                    : `PAY ${formatMoney(
                        safeWalletAmount
                      )} WITH WALLET`
                  : paymentMethod ===
                    "upi"
                  ? `PAY ${formatMoney(
                      productPrice
                    )} WITH UPI`
                  : `PAY ${formatMoney(
                      productPrice
                    )}`}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* =================================================
            BACK
        ================================================= */}

        <TouchableOpacity
          style={
            styles.cancelButton
          }
          onPress={() =>
            router.back()
          }
          disabled={
            paymentLoading
          }
          activeOpacity={0.85}
        >
          <Text
            style={
              styles.cancelButtonText
            }
          >
            BACK TO PRODUCT
          </Text>
        </TouchableOpacity>

        {/* =================================================
            QR INFO
        ================================================= */}

        <View
          style={
            styles.qrCard
          }
        >
          <Ionicons
            name="qr-code-outline"
            size={21}
            color="#777777"
          />

          <View
            style={
              styles.qrInfo
            }
          >
            <Text
              style={
                styles.qrLabel
              }
            >
              QR CODE
            </Text>

            <Text
              style={
                styles.qrValue
              }
              numberOfLines={2}
            >
              {qrCode}
            </Text>
          </View>
        </View>

        {/* =================================================
            FOOTER
        ================================================= */}

        <Text
          style={
            styles.footerText
          }
        >
          Thank you for choosing
          VedAmrut
        </Text>
      </ScrollView>
      <Modal
  visible={alertVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setAlertVisible(false)}
>
  <View style={styles.alertOverlay}>
    <View style={styles.alertBox}>
      <Text style={styles.alertTitle}>
        {alertTitle}
      </Text>

      <Text style={styles.alertMessage}>
        {alertMessage}
      </Text>

      <TouchableOpacity
        style={styles.alertButton}
        activeOpacity={0.8}
        onPress={async () => {
          setAlertVisible(false);

          if (alertAction) {
            await alertAction();
          }
        }}
      >
        <Text style={styles.alertButtonText}>
          OK
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  headerTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "InterBold",
    textAlign: "center",
    marginRight: 40,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
  },

  // =================================================
  // HEADER
  // =================================================

  paymentHeader: {
    alignItems: "center",
    marginBottom: 18,
  },

  paymentIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EFE3FF",
    justifyContent: "center",
    alignItems: "center",
  },

  paymentTitle: {
    marginTop: 13,
    color: "#222222",
    fontSize: 22,
    fontFamily: "InterBold",
  },

  paymentSubtitle: {
    marginTop: 5,
    color: "#888888",
    fontSize: 13,
    fontFamily: "InterRegular",
    textAlign: "center",
  },

  // =================================================
  // PRODUCT
  // =================================================

  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  productImageBox: {
    width: 82,
    height: 82,
    borderRadius: 16,
    backgroundColor: "#F5F1FA",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  productInfo: {
    flex: 1,
    marginLeft: 14,
  },

  productCategory: {
    color: "#9B4DFF",
    fontSize: 10,
    fontFamily: "InterBold",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },

  productName: {
    marginTop: 4,
    color: "#222222",
    fontSize: 18,
    fontFamily: "InterBold",
  },

  productUnit: {
    marginTop: 5,
    color: "#888888",
    fontSize: 12,
    fontFamily: "InterRegular",
  },

  // =================================================
  // AMOUNT
  // =================================================

  amountCard: {
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 19,
    elevation: 2,
  },

  amountLabel: {
    color: "#999999",
    fontSize: 10,
    fontFamily: "InterBold",
    letterSpacing: 1,
    textAlign: "center",
  },

  amount: {
    marginTop: 6,
    color: "#9B4DFF",
    fontSize: 34,
    fontFamily: "InterBold",
    textAlign: "center",
  },

  amountDivider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 15,
  },

  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },

  amountRowLabel: {
    color: "#777777",
    fontSize: 13,
    fontFamily: "InterRegular",
  },

  amountRowValue: {
    color: "#333333",
    fontSize: 14,
    fontFamily: "InterBold",
  },

  rewardNotUsed: {
    color: "#9B4DFF",
    fontSize: 13,
    fontFamily: "InterBold",
  },

  rewardAdded: {
    color: "#27AE60",
    fontSize: 13,
    fontFamily: "InterBold",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    color: "#222222",
    fontSize: 16,
    fontFamily: "InterBold",
  },

  totalAmount: {
    color: "#9B4DFF",
    fontSize: 20,
    fontFamily: "InterBold",
  },

  practiceNotice: {
    marginTop: 14,
    backgroundColor: "#F7F0FF",
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  practiceNoticeText: {
    flex: 1,
    marginLeft: 7,
    color: "#7650A5",
    fontSize: 10,
    fontFamily: "InterRegular",
    lineHeight: 15,
  },

  // =================================================
  // REWARD
  // =================================================

  rewardCard: {
    marginTop: 14,
    backgroundColor: "#EFE3FF",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  rewardContent: {
    flex: 1,
    marginLeft: 12,
  },

  rewardTitle: {
    color: "#222222",
    fontSize: 14,
    fontFamily: "InterBold",
  },

  rewardText: {
    marginTop: 3,
    color: "#777777",
    fontSize: 11,
    fontFamily: "InterRegular",
    lineHeight: 17,
  },

  rewardButton: {
    marginTop: 10,
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 15,
    backgroundColor: "#9B4DFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },

  rewardButtonText: {
    marginLeft: 6,
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: "InterBold",
  },

  rewardSuccessCard: {
    marginTop: 14,
    backgroundColor: "#E8F8EE",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  rewardSuccessInfo: {
    flex: 1,
    marginLeft: 10,
  },

  rewardSuccessTitle: {
    color: "#208C4A",
    fontSize: 14,
    fontFamily: "InterBold",
  },

  rewardSuccessText: {
    marginTop: 3,
    color: "#6D8B77",
    fontSize: 11,
    fontFamily: "InterRegular",
  },

  // =================================================
  // SECTION
  // =================================================

  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
  },

  sectionTitle: {
    color: "#222222",
    fontSize: 17,
    fontFamily: "InterBold",
  },

  sectionSubtitle: {
    marginTop: 3,
    color: "#999999",
    fontSize: 11,
    fontFamily: "InterRegular",
  },

  // =================================================
  // PAYMENT METHODS
  // =================================================

  paymentMethodsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    elevation: 2,
  },

  paymentMethod: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
  },

  paymentMethodSelected: {
    backgroundColor: "#FAF7FF",
  },

  paymentMethodBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EFE3FF",
    justifyContent: "center",
    alignItems: "center",
  },

  methodIconSelected: {
    backgroundColor: "#9B4DFF",
  },

  methodInfo: {
    flex: 1,
    marginLeft: 12,
  },

  methodTitle: {
    color: "#222222",
    fontSize: 14,
    fontFamily: "InterSemiBold",
  },

  methodSubtitle: {
    marginTop: 3,
    color: "#999999",
    fontSize: 10,
    fontFamily: "InterRegular",
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },

  radioOuterSelected: {
    borderColor: "#9B4DFF",
  },

  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#9B4DFF",
  },

  // =================================================
  // WALLET
  // =================================================

  walletCard: {
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  walletIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EFE3FF",
    justifyContent: "center",
    alignItems: "center",
  },

  walletInfo: {
    flex: 1,
    marginLeft: 12,
  },

  walletLabel: {
    color: "#999999",
    fontSize: 9,
    fontFamily: "InterBold",
    letterSpacing: 0.8,
  },

  walletBalance: {
    marginTop: 3,
    color: "#222222",
    fontSize: 22,
    fontFamily: "InterBold",
  },

  walletLoading: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  walletLoadingText: {
    marginLeft: 7,
    color: "#888888",
    fontSize: 11,
    fontFamily: "InterRegular",
  },

  availableBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F8EE",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 14,
  },

  availableText: {
    marginLeft: 3,
    color: "#27AE60",
    fontSize: 10,
    fontFamily: "InterBold",
  },

  // =================================================
  // WALLET PAYMENT
  // =================================================

  walletPaymentCard: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    elevation: 2,
  },

  walletPaymentTitle: {
    color: "#222222",
    fontSize: 15,
    fontFamily: "InterBold",
  },

  walletPaymentSubtitle: {
    marginTop: 4,
    color: "#888888",
    fontSize: 11,
    fontFamily: "InterRegular",
    lineHeight: 16,
  },

  walletInputRow: {
    marginTop: 14,
    height: 52,
    borderWidth: 1,
    borderColor: "#DCC8F5",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  rupeeSymbol: {
    color: "#9B4DFF",
    fontSize: 20,
    fontFamily: "InterBold",
  },

  walletInput: {
    flex: 1,
    marginLeft: 6,
    color: "#222222",
    fontSize: 18,
    fontFamily: "InterSemiBold",
    paddingVertical: 0,
  },

  useMaxButton: {
    backgroundColor: "#EFE3FF",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  useMaxText: {
    color: "#9B4DFF",
    fontSize: 9,
    fontFamily: "InterBold",
  },

  paymentBreakdown: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },

  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },

  breakdownLabel: {
    color: "#777777",
    fontSize: 12,
    fontFamily: "InterRegular",
  },

  breakdownValue: {
    color: "#333333",
    fontSize: 13,
    fontFamily: "InterSemiBold",
  },

  walletUsedValue: {
    color: "#9B4DFF",
    fontSize: 13,
    fontFamily: "InterBold",
  },

  breakdownDivider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 8,
  },

  remainingLabel: {
    color: "#222222",
    fontSize: 14,
    fontFamily: "InterBold",
  },

  remainingValue: {
    color: "#9B4DFF",
    fontSize: 17,
    fontFamily: "InterBold",
  },

  upiHint: {
    marginTop: 10,
    backgroundColor: "#F7F0FF",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  upiHintText: {
    flex: 1,
    marginLeft: 7,
    color: "#7650A5",
    fontSize: 10,
    fontFamily: "InterRegular",
    lineHeight: 15,
  },

  walletFullHint: {
    marginTop: 10,
    backgroundColor: "#E8F8EE",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  walletFullHintText: {
    flex: 1,
    marginLeft: 7,
    color: "#39734F",
    fontSize: 10,
    fontFamily: "InterRegular",
    lineHeight: 15,
  },

  // =================================================
  // PRACTICE UPI
  // =================================================

  practiceCard: {
    marginTop: 14,
    backgroundColor: "#F7F0FF",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  practiceIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  practiceInfo: {
    flex: 1,
    marginLeft: 11,
  },

  practiceTitle: {
    color: "#222222",
    fontSize: 13,
    fontFamily: "InterBold",
  },

  practiceText: {
    marginTop: 4,
    color: "#7650A5",
    fontSize: 10,
    fontFamily: "InterRegular",
    lineHeight: 15,
  },

  // =================================================
  // SECURITY
  // =================================================

  securityCard: {
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  securityIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#E8F8EE",
    justifyContent: "center",
    alignItems: "center",
  },

  securityInfo: {
    flex: 1,
    marginLeft: 11,
  },

  securityTitle: {
    color: "#222222",
    fontSize: 13,
    fontFamily: "InterSemiBold",
  },

  securityText: {
    marginTop: 3,
    color: "#888888",
    fontSize: 11,
    fontFamily: "InterRegular",
    lineHeight: 16,
  },

  // =================================================
  // PAY BUTTON
  // =================================================

  payButton: {
    marginTop: 20,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#9B4DFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  payButtonDisabled: {
    opacity: 0.55,
  },

  payButtonText: {
    marginLeft: 9,
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "InterBold",
  },

  // =================================================
  // BACK
  // =================================================

  cancelButton: {
    marginTop: 12,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.2,
    borderColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#777777",
    fontSize: 13,
    fontFamily: "InterSemiBold",
  },

  // =================================================
  // QR
  // =================================================

  qrCard: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  qrInfo: {
    flex: 1,
    marginLeft: 11,
  },

  qrLabel: {
    color: "#999999",
    fontSize: 9,
    fontFamily: "InterBold",
    letterSpacing: 1,
  },

  qrValue: {
    marginTop: 4,
    color: "#555555",
    fontSize: 11,
    fontFamily: "InterRegular",
    lineHeight: 16,
  },

  // =================================================
  // FOOTER
  // =================================================

  footerText: {
    marginTop: 18,
    textAlign: "center",
    color: "#AAAAAA",
    fontSize: 12,
    fontFamily: "InterRegular",
  },
  // =================================================
// CUSTOM ALERT
// =================================================

alertOverlay: {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.45)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 24,
},

alertBox: {
  width: "100%",
  maxWidth: 360,
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
  padding: 24,
  alignItems: "center",
},

alertTitle: {
  color: "#222222",
  fontSize: 20,
  fontFamily: "InterBold",
  textAlign: "center",
  marginBottom: 10,
},

alertMessage: {
  color: "#666666",
  fontSize: 14,
  fontFamily: "InterRegular",
  textAlign: "center",
  lineHeight: 22,
  marginBottom: 24,
},

alertButton: {
  width: "100%",
  height: 48,
  borderRadius: 24,
  backgroundColor: "#9B4DFF",
  justifyContent: "center",
  alignItems: "center",
},

alertButtonText: {
  color: "#FFFFFF",
  fontSize: 15,
  fontFamily: "InterSemiBold",
},
});