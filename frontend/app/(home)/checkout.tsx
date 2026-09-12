import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import { useCartContext } from '@/context/CartContext';
import { useAddress } from '@/hooks/useAddress';
import { API_BASE_URL } from '@/constants/api';
import { getToken } from '@/utils/storage';

type PaymentMethod =
  | 'cod'
  | 'upi'
  | 'card'
  | 'netbanking'
  | 'wallet';

type BuyNowProduct = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  category_name?: string;
};

export default function CheckoutScreen() {
  // =====================================================
  // PARAMS
  // =====================================================

  const params =
    useLocalSearchParams<{
      mode?: string | string[];

      productId?: string | string[];
      productName?: string | string[];
      productPrice?: string | string[];
      productImage?: string | string[];
      categoryName?: string | string[];
      quantity?: string | string[];
    }>();

  // =====================================================
  // PARAM HELPER
  // =====================================================

  const getParam = (
    value?: string | string[],
  ): string => {
    if (Array.isArray(value)) {
      return value[0] || '';
    }

    return value || '';
  };

  // =====================================================
  // MODE
  // =====================================================

  const mode = getParam(params.mode);

  const isBuyNow =
    mode === 'buyNow';

  // =====================================================
  // CART
  // =====================================================

 const {
  cartLines,
  totalCount: cartTotalCount,
  totalPrice: cartTotalPrice,
  clearCart,
} = useCartContext();

  // =====================================================
  // ADDRESS
  // =====================================================

  const {
    selectedAddress,
  } = useAddress();

  // =====================================================
  // PAYMENT
  // =====================================================

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState<PaymentMethod>('cod');

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const [
    placingOrder,
    setPlacingOrder,
  ] = useState(false);

  // =====================================================
  // WALLET
  // =====================================================

  const [
    walletBalance,
    setWalletBalance,
  ] = useState(0);

  const [
    walletLoading,
    setWalletLoading,
  ] = useState(false);

  // =====================================================
  // BUY NOW PRODUCT
  // =====================================================

  const buyNowProduct:
    | BuyNowProduct
    | null = useMemo(() => {
    if (!isBuyNow) {
      return null;
    }

    const id = Number(
      getParam(params.productId),
    );

    const price = Number(
      getParam(params.productPrice),
    );

    const quantity = Number(
      getParam(params.quantity) || '1',
    );

    if (!id || !price) {
      return null;
    }

    return {
      id,

      name:
        getParam(params.productName) ||
        'Product',

      price,

      quantity:
        quantity > 0
          ? quantity
          : 1,

      image:
        getParam(params.productImage) ||
        null,

      category_name:
        getParam(params.categoryName) ||
        '',
    };
  }, [
    isBuyNow,
    params.productId,
    params.productName,
    params.productPrice,
    params.productImage,
    params.categoryName,
    params.quantity,
  ]);

  // =====================================================
  // CHECKOUT ITEMS
  // =====================================================

  const checkoutItems =
    useMemo(() => {
      if (isBuyNow) {
        if (!buyNowProduct) {
          return [];
        }

        return [
          {
            productId:
              buyNowProduct.id,

            quantity:
              buyNowProduct.quantity,

            product: {
              id:
                buyNowProduct.id,

              name:
                buyNowProduct.name,

              price:
                buyNowProduct.price,

              image:
                buyNowProduct.image,

              category_name:
                buyNowProduct.category_name,
            },
          },
        ];
      }

      return cartLines;
    }, [
      isBuyNow,
      buyNowProduct,
      cartLines,
    ]);

  // =====================================================
  // TOTALS
  // =====================================================

  const totalCount =
    isBuyNow
      ? buyNowProduct?.quantity || 0
      : cartTotalCount;

  const totalPrice =
    isBuyNow
      ? (buyNowProduct?.price || 0) *
        (buyNowProduct?.quantity || 0)
      : cartTotalPrice;

  // =====================================================
  // WALLET AMOUNT
  // =====================================================

  const walletPayableAmount =
    Math.min(
      walletBalance,
      totalPrice,
    );

  const upiPayableAmount =
    Math.max(
      totalPrice -
        walletPayableAmount,
      0,
    );

  // =====================================================
  // LOAD WALLET
  // =====================================================

  const loadWallet = async () => {
    try {
      setWalletLoading(true);

      const token =
        await getToken();

      if (!token) {
        return;
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/wallet`,
          {
            method: 'GET',

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      const result =
        await response.json();

      console.log(
        'WALLET RESPONSE:',
        result,
      );

      if (
        response.ok &&
        result.success
      ) {
        const balance =
          Number(
            result.data?.wallet
              ?.balance ??
              result.data?.balance ??
              0,
          );

        setWalletBalance(
          Number.isFinite(balance)
            ? balance
            : 0,
        );
      }
    } catch (error) {
      console.error(
        'LOAD WALLET ERROR:',
        error,
      );
    } finally {
      setWalletLoading(false);
    }
  };

  // =====================================================
  // LOAD WALLET WHEN BUY NOW + WALLET
  // =====================================================

  useEffect(() => {
  if (paymentMethod === 'wallet') {
    loadWallet();
  }
}, [paymentMethod]);

  // =====================================================
  // IMAGE
  // =====================================================

  const getImageSource = (
    image?: string | null,
  ) => {
    if (!image) {
      return require('@/assets/images/product1.png');
    }

    if (
      image.startsWith('http://') ||
      image.startsWith('https://')
    ) {
      return {
        uri: image,
      };
    }

    return {
      uri:
        `${API_BASE_URL}/uploads/${image}`,
    };
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    if (
      isBuyNow &&
      buyNowProduct
    ) {
      router.replace({
        pathname:
          '/(home)/product-details',

        params: {
          id: String(
            buyNowProduct.id,
          ),
        },
      });

      return;
    }

    router.replace(
      '/(home)/cart',
    );
  };

  // =====================================================
  // ADDRESS PARAMS
  // =====================================================

  const getAddressNavigationParams =
    () => {
      const addressParams: Record<
        string,
        string
      > = {
        returnTo:
          'checkout',

        mode:
          isBuyNow
            ? 'buyNow'
            : 'cart',
      };

      if (
        isBuyNow &&
        buyNowProduct
      ) {
        addressParams.productId =
          String(
            buyNowProduct.id,
          );

        addressParams.productName =
          buyNowProduct.name;

        addressParams.productPrice =
          String(
            buyNowProduct.price,
          );

        addressParams.productImage =
          buyNowProduct.image || '';

        addressParams.categoryName =
          buyNowProduct.category_name ||
          '';

        addressParams.quantity =
          String(
            buyNowProduct.quantity,
          );
      }

      return addressParams;
    };

  // =====================================================
  // CHANGE ADDRESS
  // =====================================================

  const handleChangeAddress =
    () => {
      router.push({
        pathname:
          '/(home)/saved-addresses',

        params:
          getAddressNavigationParams(),
      });
    };

  // =====================================================
  // ADD ADDRESS
  // =====================================================

  const handleAddAddress = () => {
    router.push({
      pathname:
        '/(home)/add-address',

      params:
        getAddressNavigationParams(),
    });
  };

  // =====================================================
  // EMPTY
  // =====================================================

  if (
    checkoutItems.length === 0
  ) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="cart-outline"
          size={60}
          color="#B5B5B5"
        />

        <Text
          style={styles.emptyTitle}
        >
          {isBuyNow
            ? 'Unable to load product'
            : 'Your Cart is Empty'}
        </Text>

        <TouchableOpacity
          style={styles.shopButton}
          onPress={() =>
            router.replace(
              '/(home)/home',
            )
          }
        >
          <Text
            style={
              styles.shopButtonText
            }
          >
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // =====================================================
  // PRODUCT
  // =====================================================

  const renderItem = ({
    item,
  }: {
    item: any;
  }) => {
    const product =
      item.product;

    const itemTotal =
      Number(product.price) *
      Number(item.quantity);

    return (
      <View
        style={
          styles.productCard
        }
      >
        <Image
          source={getImageSource(
            product.image,
          )}
          style={
            styles.productImage
          }
          resizeMode="contain"
        />

        <View
          style={
            styles.productDetails
          }
        >
          <Text
            style={
              styles.productName
            }
            numberOfLines={2}
          >
            {product.name}
          </Text>

          <Text
            style={
              styles.category
            }
          >
            {product.category_name ||
              'Product'}
          </Text>

          <Text
            style={
              styles.quantity
            }
          >
            Quantity:{' '}
            {item.quantity}
          </Text>

          <Text
            style={
              styles.itemPrice
            }
          >
            ₹
            {itemTotal.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  // =====================================================
  // ADDRESS TEXT
  // =====================================================

  const addressText =
    selectedAddress
      ? [
          selectedAddress.addressLine,
          selectedAddress.area,
          selectedAddress.city,
          selectedAddress.state,
          selectedAddress.pincode,
        ]
          .filter(Boolean)
          .join(', ')
      : '';

  // =====================================================
  // PAYMENT METHOD
  // =====================================================

  const renderPaymentMethod =
    (
      method: PaymentMethod,
      icon: keyof typeof Ionicons.glyphMap,
      title: string,
      subtitle: string,
    ) => {
      const isSelected =
        paymentMethod === method;

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.paymentCard,
            isSelected &&
              styles.paymentCardSelected,
          ]}
          onPress={() => {
            setErrorMessage('');

            setPaymentMethod(
              method,
            );
          }}
        >
          <View
            style={[
              styles.paymentIcon,
              isSelected &&
                styles.paymentIconSelected,
            ]}
          >
            <Ionicons
              name={icon}
              size={23}
              color="#1C9C57"
            />
          </View>

          <View
            style={
              styles.paymentDetails
            }
          >
            <Text
              style={
                styles.paymentTitle
              }
            >
              {title}
            </Text>

            <Text
              style={
                styles.paymentSubtitle
              }
            >
              {subtitle}
            </Text>
          </View>

          <View
            style={[
              styles.radioOuter,
              isSelected &&
                styles.radioOuterSelected,
            ]}
          >
            {isSelected && (
              <View
                style={
                  styles.radioInner
                }
              />
            )}
          </View>
        </TouchableOpacity>
      );
    };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder =
    async () => {
      if (placingOrder) {
        return;
      }

      try {
        setErrorMessage('');
        setPlacingOrder(true);

        // =================================================
        // ADDRESS
        // =================================================

        if (
          !selectedAddress?.id
        ) {
          setErrorMessage(
            'Please select a delivery address.',
          );

          return;
        }

        // =================================================
        // TOKEN
        // =================================================

        const token =
          await getToken();

        if (!token) {
          setErrorMessage(
            'Please login again to continue.',
          );

          return;
        }

        // =================================================
        // CART ORDER
        // =================================================

        // if (!isBuyNow) {
        //   const requestBody = {
        //     addressId:
        //       selectedAddress.id,

        //     paymentMethod:
        //       paymentMethod === 'cod'
        //         ? 'COD'
        //         : paymentMethod.toUpperCase(),
        //   };

        //   console.log(
        //     'CART ORDER REQUEST:',
        //     requestBody,
        //   );

        //   const response =
        //     await fetch(
        //       `${API_BASE_URL}/api/orders`,
        //       {
        //         method: 'POST',

        //         headers: {
        //           'Content-Type':
        //             'application/json',

        //           Authorization:
        //             `Bearer ${token}`,
        //         },

        //         body:
        //           JSON.stringify(
        //             requestBody,
        //           ),
        //       },
        //     );

        //   const result =
        //     await response.json();

        //   console.log(
        //     'CART ORDER RESPONSE:',
        //     result,
        //   );

        //   if (
        //     !response.ok ||
        //     !result.success
        //   ) {
        //     setErrorMessage(
        //       result.message ||
        //         'Failed to place order.',
        //     );

        //     return;
        //   }

        //   router.push({
        //     pathname:
        //       '/(home)/order-success',

        //     params: {
        //       orderId:
        //         String(
        //           result.data
        //             .order.id,
        //         ),

        //       totalAmount:
        //         String(
        //           result.data
        //             .order
        //             .total_amount,
        //         ),

        //       paymentMethod:
        //         result.data
        //           .order
        //           .payment_method,

        //       mode: 'cart',
        //     },
        //   });

        //   return;
        // }
// =================================================
// CART ORDER
// =================================================

if (!isBuyNow) {
  let finalPaymentMethod =
    paymentMethod === 'cod'
      ? 'COD'
      : paymentMethod.toUpperCase();

  let walletAmount = 0;

  // -------------------------------------------------
  // WALLET
  // -------------------------------------------------

  if (paymentMethod === 'wallet') {
    if (walletBalance <= 0) {
      setErrorMessage(
        'Your wallet balance is ₹0.00. Please select Practice UPI.',
      );

      return;
    }

    walletAmount = Math.min(
      walletBalance,
      totalPrice,
    );

    walletAmount = Number(
      walletAmount.toFixed(2),
    );

    if (walletAmount < totalPrice) {
      finalPaymentMethod = 'SPLIT';
    } else {
      finalPaymentMethod = 'WALLET';
    }
  }

  // -------------------------------------------------
  // UPI
  // -------------------------------------------------

  if (paymentMethod === 'upi') {
    finalPaymentMethod = 'UPI';
    walletAmount = 0;
  }

  // -------------------------------------------------
  // CARD
  // -------------------------------------------------

  if (paymentMethod === 'card') {
    setErrorMessage(
      'Card payment is not connected yet. Please select Practice UPI, Wallet, or Cash on Delivery.',
    );

    return;
  }

  // -------------------------------------------------
  // NET BANKING
  // -------------------------------------------------

  if (paymentMethod === 'netbanking') {
    setErrorMessage(
      'Net Banking is not connected yet. Please select Practice UPI, Wallet, or Cash on Delivery.',
    );

    return;
  }

  // -------------------------------------------------
  // REQUEST
  // -------------------------------------------------

  const requestBody = {
    addressId:
      selectedAddress.id,

    paymentMethod:
      finalPaymentMethod,

    walletAmount,
  };

  console.log(
    'CART ORDER REQUEST:',
    requestBody,
  );

  const response =
    await fetch(
      `${API_BASE_URL}/api/orders`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${token}`,
        },

        body:
          JSON.stringify(
            requestBody,
          ),
      },
    );

  const result =
    await response.json();

  console.log(
    'CART ORDER RESPONSE:',
    result,
  );

  if (
    !response.ok ||
    !result.success
  ) {
    setErrorMessage(
      result.message ||
        'Failed to place order.',
    );

    return;
  }
await clearCart();
  const payment =
    result.data?.payment;

  // router.push({
  //   pathname:
  //     '/(home)/order-success',

  //   params: {
  //     orderId:
  //       String(
  //         result.data
  //           .order.id,
  //       ),

  //     totalAmount:
  //       String(
  //         result.data
  //           .order
  //           .total_amount,
  //       ),

  //     paymentMethod:
  //       result.data
  //         .order
  //         .payment_method,

  //     walletAmount:
  //       String(
  //         payment
  //           ?.wallet_amount ??
  //           walletAmount ??
  //           0,
  //       ),

  //     upiAmount:
  //       String(
  //         payment
  //           ?.upi_amount ??
  //           0,
  //       ),

  //     mode: 'cart',
  //   },
  // });
router.push({
  pathname: '/(home)/order-success',

  params: {
    orderId: String(
      result.data.order.id,
    ),

    totalAmount: String(
      result.data.order.total_amount,
    ),

    paymentMethod:
      result.data.order.payment_method,

    walletAmount: String(
      payment?.wallet_amount ??
      walletAmount ??
      0,
    ),

    upiAmount: String(
      payment?.upi_amount ??
      0,
    ),

    from: 'cart',
  },
});

  return;
}
        // =================================================
        // BUY NOW VALIDATION
        // =================================================

        if (!buyNowProduct) {
          setErrorMessage(
            'Buy Now product information is missing.',
          );

          return;
        }

        // =================================================
        // BUY NOW PAYMENT
        // =================================================

        let finalPaymentMethod =
          paymentMethod === 'cod'
            ? 'COD'
            : paymentMethod.toUpperCase();

        let walletAmount = 0;

        // -------------------------------------------------
        // WALLET
        // -------------------------------------------------

        if (
          paymentMethod === 'wallet'
        ) {
          if (walletBalance <= 0) {
            setErrorMessage(
              'Your wallet balance is ₹0.00. Please select UPI.',
            );

            return;
          }

          walletAmount =
            Math.min(
              walletBalance,
              totalPrice,
            );

          walletAmount =
            Number(
              walletAmount.toFixed(2),
            );

          if (
            walletAmount <
            totalPrice
          ) {
            finalPaymentMethod =
              'SPLIT';
          } else {
            finalPaymentMethod =
              'WALLET';
          }
        }

        // -------------------------------------------------
        // UPI PRACTICE
        // -------------------------------------------------

        if (
          paymentMethod === 'upi'
        ) {
          finalPaymentMethod =
            'UPI';

          walletAmount = 0;
        }

        // -------------------------------------------------
        // OTHER METHODS
        // -------------------------------------------------

        if (
          paymentMethod === 'card'
        ) {
          setErrorMessage(
            'Card payment is not connected yet. Please select Practice UPI, Wallet, or Cash on Delivery.',
          );

          return;
        }

        if (
          paymentMethod ===
          'netbanking'
        ) {
          setErrorMessage(
            'Net Banking is not connected yet. Please select Practice UPI, Wallet, or Cash on Delivery.',
          );

          return;
        }

        // =================================================
        // REQUEST
        // =================================================

        const requestBody = {
          addressId:
            selectedAddress.id,

          paymentMethod:
            finalPaymentMethod,

          walletAmount,

          buyNowProductId:
            buyNowProduct.id,

          buyNowQuantity:
            buyNowProduct.quantity,
        };

        console.log(
          'BUY NOW ORDER REQUEST:',
          requestBody,
        );

        const response =
          await fetch(
            `${API_BASE_URL}/api/orders`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify(
                  requestBody,
                ),
            },
          );

        const result =
          await response.json();

        console.log(
          'BUY NOW ORDER RESPONSE:',
          result,
        );

        if (
          !response.ok ||
          !result.success
        ) {
          setErrorMessage(
            result.message ||
              'Failed to place order.',
          );

          return;
        }

        // =================================================
        // SUCCESS
        // =================================================

        const payment =
          result.data?.payment;

        // router.push({
        //   pathname:
        //     '/(home)/order-success',

        //   params: {
        //     orderId:
        //       String(
        //         result.data
        //           .order.id,
        //       ),

        //     totalAmount:
        //       String(
        //         result.data
        //           .order
        //           .total_amount,
        //       ),

        //     paymentMethod:
        //       result.data
        //         .order
        //         .payment_method,

        //     walletAmount:
        //       String(
        //         payment
        //           ?.wallet_amount ??
        //           0,
        //       ),

        //     upiAmount:
        //       String(
        //         payment
        //           ?.upi_amount ??
        //           0,
        //       ),

        //     mode: 'buyNow',
        //   },
        // });
      
      router.push({
  pathname: '/(home)/order-success',

  params: {
    orderId: String(
      result.data.order.id,
    ),

    totalAmount: String(
      result.data.order.total_amount,
    ),

    paymentMethod:
      result.data.order.payment_method,

    walletAmount: String(
      payment?.wallet_amount ?? 0,
    ),

    upiAmount: String(
      payment?.upi_amount ?? 0,
    ),

    from: 'buy-now',

    productId: String(
      buyNowProduct.id,
    ),
  },
});
      } catch (error) {
        console.error(
          'PLACE ORDER ERROR:',
          error,
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
        );
      } finally {
        setPlacingOrder(false);
      }
    };

  // =====================================================
  // SCREEN
  // =====================================================

  return (
    <View
      style={styles.container}
    >
      {/* HEADER */}

      <View
        style={styles.header}
      >
        <TouchableOpacity
          style={
            styles.backButton
          }
          onPress={
            handleBack
          }
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#222222"
          />
        </TouchableOpacity>

        <Text
          style={
            styles.headerTitle
          }
        >
          Checkout
        </Text>

        <View
          style={
            styles.headerSpacer
          }
        />
      </View>

      {/* CONTENT */}

      <FlatList
        data={checkoutItems}
        keyExtractor={(item) =>
          String(
            item.productId,
          )
        }
        renderItem={
          renderItem
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.listContent
        }
        ListHeaderComponent={
          <>
            {isBuyNow && (
              <View
                style={
                  styles.buyNowBanner
                }
              >
                <Ionicons
                  name="flash"
                  size={20}
                  color="#9B4DFF"
                />

                <Text
                  style={
                    styles.buyNowBannerText
                  }
                >
                  Buy Now — this
                  purchase will not
                  change your cart
                </Text>
              </View>
            )}

            <Text
              style={
                styles.sectionTitle
              }
            >
              Delivery Address
            </Text>

            {selectedAddress ? (
              <View
                style={
                  styles.addressCard
                }
              >
                <View
                  style={
                    styles.addressIcon
                  }
                >
                  <Ionicons
                    name="location"
                    size={20}
                    color="#1C9C57"
                  />
                </View>

                <View
                  style={
                    styles.addressDetails
                  }
                >
                  <Text
                    style={
                      styles.addressName
                    }
                  >
                    {
                      selectedAddress.fullName
                    }
                  </Text>

                  <Text
                    style={
                      styles.addressText
                    }
                  >
                    {addressText}
                  </Text>

                  <Text
                    style={
                      styles.phoneText
                    }
                  >
                    {
                      selectedAddress.phone
                    }
                  </Text>
                </View>

                <TouchableOpacity
                  style={
                    styles.changeButton
                  }
                  activeOpacity={
                    0.8
                  }
                  onPress={
                    handleChangeAddress
                  }
                >
                  <Text
                    style={
                      styles.changeText
                    }
                  >
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={
                  styles.addAddressCard
                }
                activeOpacity={
                  0.8
                }
                onPress={
                  handleAddAddress
                }
              >
                <Ionicons
                  name="add-circle-outline"
                  size={22}
                  color="#1C9C57"
                />

                <Text
                  style={
                    styles.addAddressText
                  }
                >
                  Add Delivery
                  Address
                </Text>
              </TouchableOpacity>
            )}

            <Text
              style={
                styles.sectionTitle
              }
            >
              {isBuyNow
                ? 'Product'
                : 'Order Summary'}
            </Text>
          </>
        }
        ListFooterComponent={
          <>
            {/* PRICE */}

            <Text
              style={
                styles.sectionTitle
              }
            >
              Price Details
            </Text>

            <View
              style={
                styles.priceCard
              }
            >
              <View
                style={
                  styles.priceRow
                }
              >
                <Text
                  style={
                    styles.priceLabel
                  }
                >
                  Items ({totalCount})
                </Text>

                <Text
                  style={
                    styles.priceValue
                  }
                >
                  ₹
                  {totalPrice.toFixed(
                    2,
                  )}
                </Text>
              </View>

              <View
                style={
                  styles.priceRow
                }
              >
                <Text
                  style={
                    styles.priceLabel
                  }
                >
                  Delivery Charges
                </Text>

                <Text
                  style={
                    styles.freeText
                  }
                >
                  FREE
                </Text>
              </View>

              <View
                style={
                  styles.divider
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
                  Total Amount
                </Text>

                <Text
                  style={
                    styles.totalAmount
                  }
                >
                  ₹
                  {totalPrice.toFixed(
                    2,
                  )}
                </Text>
              </View>
            </View>

            {/* PAYMENT */}

            <Text
              style={
                styles.sectionTitle
              }
            >
              Payment Method
            </Text>

            <View
              style={
                styles.paymentContainer
              }
            >
              {renderPaymentMethod(
                'cod',
                'cash-outline',
                'Cash on Delivery',
                'Pay when your order is delivered',
              )}

              {renderPaymentMethod(
                'upi',
                'phone-portrait-outline',
                'Practice UPI',
                'Mock payment • No real charge',
              )}

              {renderPaymentMethod(
                'card',
                'card-outline',
                'Credit / Debit Card',
                'Real payment not connected yet',
              )}

              {renderPaymentMethod(
                'netbanking',
                'business-outline',
                'Net Banking',
                'Real payment not connected yet',
              )}

              {renderPaymentMethod(
                'wallet',
                'wallet-outline',
                'Wallet',
                'Use wallet balance + Practice UPI',
              )}
            </View>

            {/* WALLET BREAKDOWN */}

           {paymentMethod ===
  'wallet' && (
                <View
                  style={
                    styles.walletPaymentBox
                  }
                >
                  <View
                    style={
                      styles.walletPaymentRow
                    }
                  >
                    <Text
                      style={
                        styles.walletPaymentLabel
                      }
                    >
                      Wallet Balance
                    </Text>

                    <Text
                      style={
                        styles.walletPaymentValue
                      }
                    >
                      {walletLoading
                        ? 'Loading...'
                        : `₹${walletBalance.toFixed(
                            2,
                          )}`}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.walletPaymentRow
                    }
                  >
                    <Text
                      style={
                        styles.walletPaymentLabel
                      }
                    >
                      Wallet Amount
                    </Text>

                    <Text
                      style={
                        styles.walletPaymentValue
                      }
                    >
                      ₹
                      {walletPayableAmount.toFixed(
                        2,
                      )}
                    </Text>
                  </View>

                  {walletBalance <
                    totalPrice &&
                    walletBalance >
                      0 && (
                      <>
                        <View
                          style={
                            styles.walletPaymentDivider
                          }
                        />

                        <View
                          style={
                            styles.walletPaymentRow
                          }
                        >
                          <Text
                            style={
                              styles.walletPaymentLabel
                            }
                          >
                            Practice UPI
                          </Text>

                          <Text
                            style={
                              styles.upiPaymentValue
                            }
                          >
                            ₹
                            {upiPayableAmount.toFixed(
                              2,
                            )}
                          </Text>
                        </View>

                        <Text
                          style={
                            styles.mockPaymentText
                          }
                        >
                          Your wallet pays ₹
                          {walletPayableAmount.toFixed(
                            2,
                          )} and the remaining ₹
                          {upiPayableAmount.toFixed(
                            2,
                          )} is simulated as UPI.
                          No real money is charged.
                        </Text>
                      </>
                    )}

                  {walletBalance >=
                    totalPrice && (
                    <Text
                      style={
                        styles.mockPaymentText
                      }
                    >
                      Your wallet has enough
                      balance to pay the full
                      amount.
                    </Text>
                  )}

                  {walletBalance <=
                    0 && (
                    <Text
                      style={
                        styles.walletWarning
                      }
                    >
                      Wallet balance is ₹0.00.
                      Please select Practice UPI
                      or Cash on Delivery.
                    </Text>
                  )}
                </View>
              )}

            {/* SELECTED PAYMENT */}

            <View
              style={
                styles.selectedPaymentBox
              }
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#1C9C57"
              />

              <Text
                style={
                  styles.selectedPaymentText
                }
              >
                {paymentMethod ===
                  'cod' &&
                  'Cash on Delivery selected'}

                {paymentMethod ===
                  'upi' &&
                  'Practice UPI selected • No real charge'}

                {paymentMethod ===
                  'card' &&
                  'Credit / Debit Card selected'}

                {paymentMethod ===
                  'netbanking' &&
                  'Net Banking selected'}

                {paymentMethod ===
                  'wallet' &&
                  'Wallet selected • Remaining amount uses Practice UPI'}
              </Text>
            </View>

            {/* ERROR */}

            {errorMessage ? (
              <View
                style={
                  styles.errorBox
                }
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={21}
                  color="#D32F2F"
                />

                <Text
                  style={
                    styles.errorText
                  }
                >
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            {/* PLACE ORDER */}

            <TouchableOpacity
              style={[
                styles.placeOrderButton,

                !selectedAddress &&
                  styles.placeOrderDisabled,

                placingOrder &&
                  styles.placeOrderDisabled,

              paymentMethod ===
  'wallet' &&
walletBalance <= 0 &&
styles.placeOrderDisabled,
              ]}
              disabled={
  !selectedAddress ||
  placingOrder ||
  (
    paymentMethod ===
      'wallet' &&
    walletBalance <= 0
  )
}
                
              
              onPress={
                handlePlaceOrder
              }
            >
              <Text
                style={
                  styles.placeOrderText
                }
              >
                {placingOrder
                  ? 'Placing Order...'
                  : selectedAddress
                  ? `Place Order • ₹${totalPrice.toFixed(
                      2,
                    )}`
                  : 'Add Address to Continue'}
              </Text>
            </TouchableOpacity>

            <View
              style={
                styles.bottomSpace
              }
            />
          </>
        }
      />
    </View>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 20,
    fontFamily: 'InterBold',
    color: '#222222',
    textAlign: 'center',
  },

  shopButton: {
    marginTop: 20,
    backgroundColor: '#1C9C57',
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'InterSemiBold',
  },

  // ===================================================
  // HEADER
  // ===================================================

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop:30,
    // borderBottomWidth: 1,
    // borderBottomColor: '#EEEEEE',


  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontFamily: 'InterBold',
    color: '#222222',
  },

  headerSpacer: {
    width: 38,
  },

  // ===================================================
  // LIST
  // ===================================================

  listContent: {
    padding: 16,
    paddingBottom: 30,
  },

  // ===================================================
  // BUY NOW
  // ===================================================

  buyNowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EAFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  buyNowBannerText: {
    flex: 1,
    marginLeft: 8,
    color: '#7A35D0',
    fontSize: 13,
    fontFamily: 'InterSemiBold',
    lineHeight: 18,
  },

  // ===================================================
  // SECTION
  // ===================================================

  sectionTitle: {
    fontSize: 18,
    fontFamily: 'InterBold',
    color: '#222222',
    marginTop: 8,
    marginBottom: 12,
  },

  // ===================================================
  // ADDRESS
  // ===================================================

  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },

  addressIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E9FBF0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addressDetails: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },

  addressName: {
    fontSize: 15,
    fontFamily: 'InterBold',
    color: '#222222',
    marginBottom: 4,
  },

  addressText: {
    fontSize: 13,
    fontFamily: 'InterRegular',
    color: '#555555',
    lineHeight: 19,
  },

  phoneText: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'InterRegular',
    color: '#777777',
  },

  changeButton: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },

  changeText: {
    color: '#1C6FD9',
    fontSize: 13,
    fontFamily: 'InterSemiBold',
  },

  addAddressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1C9C57',
    borderRadius: 14,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#F3FFF7',
  },

  addAddressText: {
    marginLeft: 9,
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#1C9C57',
  },

  // ===================================================
  // PRODUCT
  // ===================================================

  productCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },

  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#F7F7F7',
  },

  productDetails: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 15,
    fontFamily: 'InterSemiBold',
    color: '#222222',
  },

  category: {
    marginTop: 3,
    fontSize: 12,
    fontFamily: 'InterRegular',
    color: '#888888',
  },

  quantity: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'InterRegular',
    color: '#666666',
  },

  itemPrice: {
    marginTop: 5,
    fontSize: 15,
    fontFamily: 'InterBold',
    color: '#1C9C57',
  },

  // ===================================================
  // PRICE
  // ===================================================

  priceCard: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  priceLabel: {
    fontSize: 14,
    fontFamily: 'InterRegular',
    color: '#555555',
  },

  priceValue: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#222222',
  },

  freeText: {
    fontSize: 13,
    fontFamily: 'InterBold',
    color: '#1C9C57',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 5,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  totalLabel: {
    fontSize: 16,
    fontFamily: 'InterBold',
    color: '#222222',
  },

  totalAmount: {
    fontSize: 18,
    fontFamily: 'InterBold',
    color: '#1C9C57',
  },

  // ===================================================
  // PAYMENT
  // ===================================================

  paymentContainer: {
    gap: 10,
  },

  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 76,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  paymentCardSelected: {
    borderColor: '#1C9C57',
    backgroundColor: '#F3FFF7',
  },

  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
  },

  paymentIconSelected: {
    backgroundColor: '#E3F8EC',
  },

  paymentDetails: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  paymentTitle: {
    fontSize: 15,
    fontFamily: 'InterBold',
    color: '#222222',
  },

  paymentSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'InterRegular',
    color: '#777777',
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CFCFCF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioOuterSelected: {
    borderColor: '#1C9C57',
  },

  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#1C9C57',
  },

  // ===================================================
  // WALLET PAYMENT
  // ===================================================

  walletPaymentBox: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F3FFF7',
    borderWidth: 1,
    borderColor: '#CDEEDB',
  },

  walletPaymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  walletPaymentLabel: {
    fontSize: 13,
    fontFamily: 'InterRegular',
    color: '#555555',
  },

  walletPaymentValue: {
    fontSize: 14,
    fontFamily: 'InterBold',
    color: '#1C9C57',
  },

  upiPaymentValue: {
    fontSize: 14,
    fontFamily: 'InterBold',
    color: '#7A35D0',
  },

  walletPaymentDivider: {
    height: 1,
    backgroundColor: '#DCEFE4',
    marginVertical: 5,
  },

  mockPaymentText: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: 'InterRegular',
    color: '#777777',
  },

  walletWarning: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'InterSemiBold',
    color: '#D32F2F',
  },

  // ===================================================
  // SELECTED
  // ===================================================

  selectedPaymentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F3FFF7',
  },

  selectedPaymentText: {
    flex: 1,
    marginLeft: 7,
    fontSize: 12,
    fontFamily: 'InterSemiBold',
    color: '#1C9C57',
  },

  // ===================================================
  // ERROR
  // ===================================================

  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#FFF1F1',
    borderWidth: 1,
    borderColor: '#F5C2C2',
  },

  errorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: 'InterSemiBold',
    color: '#D32F2F',
  },

  // ===================================================
  // PLACE ORDER
  // ===================================================

  placeOrderButton: {
    marginTop: 24,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1C9C57',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeOrderDisabled: {
    backgroundColor: '#B5B5B5',
  },

  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'InterBold',
  },

  bottomSpace: {
    height: 30,
  },
});