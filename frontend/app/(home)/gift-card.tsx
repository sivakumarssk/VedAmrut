import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import { API_BASE_URL } from "@/constants/api";
import { getToken } from "@/utils/storage";

export default function GiftCardScreen() {
  const params = useLocalSearchParams();

  const qrCode = String(params.qrCode || "");
  const productId = String(params.productId || "");

  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  const [scratched, setScratched] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const [product, setProduct] = useState<any>(null);

  const [giftReward, setGiftReward] = useState(0);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  // =====================================================
  // LOAD GIFT
  // =====================================================

  useEffect(() => {
    loadGiftDetails();
  }, []);

  const loadGiftDetails = async () => {
    try {
      console.log("================================");
      console.log("GIFT CARD SCREEN");
      console.log("QR CODE:", qrCode);
      console.log("PRODUCT ID:", productId);
      console.log("================================");

      if (!qrCode) {
        Alert.alert("Invalid QR", "QR code is missing.", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);

        return;
      }

      // =================================================
      // GET QR DETAILS
      // =================================================

      const qrUrl =
        `${API_BASE_URL}/api/product-qr/scan/` +
        encodeURIComponent(qrCode);

      console.log("QR DETAILS URL:", qrUrl);

      const qrResponse = await fetch(qrUrl);
      const qrResult = await qrResponse.json();

      console.log(
        "QR DETAILS RESPONSE:",
        JSON.stringify(qrResult, null, 2)
      );

      if (!qrResponse.ok || !qrResult?.success) {
        throw new Error(
          qrResult?.message ||
            "Failed to load gift details."
        );
      }

      const qrData = qrResult?.data;

      if (!qrData) {
        throw new Error("Gift details not found.");
      }

      // =================================================
      // PRODUCT ID
      // =================================================

      const qrProductId =
        qrData?.product_id ??
        qrData?.product?.id ??
        productId;

      if (
        qrProductId === undefined ||
        qrProductId === null ||
        String(qrProductId).trim() === ""
      ) {
        throw new Error("Product ID not found.");
      }

      // =================================================
      // GET PRODUCT
      // =================================================

      const productsUrl =
        `${API_BASE_URL}/api/products`;

      const productResponse =
        await fetch(productsUrl);

      const productResult =
        await productResponse.json();

      if (
        !productResponse.ok ||
        !productResult?.success
      ) {
        throw new Error(
          productResult?.message ||
            "Failed to load product."
        );
      }

      const products =
        Array.isArray(productResult?.data)
          ? productResult.data
          : [];

      const currentProduct =
        products.find(
          (item: any) =>
            String(item.id) ===
            String(qrProductId)
        );

      if (!currentProduct) {
        throw new Error(
          "Product was not found."
        );
      }

      setProduct(currentProduct);

      // =================================================
      // GET REWARD
      // =================================================

      const rawReward =
        qrData?.reward_amount ??
        qrData?.gift_reward ??
        qrData?.gift?.amount ??
        qrData?.reward ??
        currentProduct?.reward_amount ??
        params.rewardAmount ??
        0;

      const reward = Number(rawReward);

      const finalReward =
        Number.isFinite(reward) && reward > 0
          ? reward
          : 0;

      console.log("================================");
      console.log("REWARD VALUES");
      console.log("RAW REWARD:", rawReward);
      console.log("FINAL REWARD:", finalReward);
      console.log("================================");

      setGiftReward(finalReward);

      // =================================================
      // CLAIM STATUS
      // =================================================

      const alreadyClaimed =
        qrData?.is_claimed === true ||
        qrData?.is_claimed === "true" ||
        qrData?.is_claimed === 1 ||
        qrData?.is_claimed === "1";

      console.log(
        "IS CLAIMED:",
        alreadyClaimed
      );

      setClaimed(alreadyClaimed);

      // =================================================
      // IMPORTANT
      // If reward is 0, immediately mark as revealed.
      // This means we don't show a scratch card for
      // something that has no gift.
      // =================================================

      if (finalReward <= 0) {
        setScratched(true);
      }

    } catch (error: any) {
      console.error(
        "LOAD GIFT ERROR:",
        error
      );

      Alert.alert(
        "Error",
        error?.message ||
          "Unable to load gift.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REVEAL GIFT
  // =====================================================

  const revealGift = () => {
    if (claimed) {
      return;
    }

    if (giftReward <= 0) {
      setScratched(true);
      return;
    }

    setScratched(true);
  };

  // =====================================================
  // CLAIM REWARD
  // =====================================================

  const claimReward = async () => {
    try {
      if (claiming) {
        return;
      }

      if (!qrCode) {
        Alert.alert(
          "Error",
          "QR code is missing."
        );
        return;
      }

      if (giftReward <= 0) {
        return;
      }

      const token = await getToken();

      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login to claim this gift."
        );
        return;
      }

      setClaiming(true);

      console.log("================================");
      console.log("CLAIM GIFT");
      console.log("QR CODE:", qrCode);
      console.log("REWARD:", giftReward);
      console.log("================================");

      const response = await fetch(
        `${API_BASE_URL}/api/product-qr/claim`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            qrCode,
          }),
        }
      );

      const result = await response.json();

      console.log(
        "CLAIM RESPONSE:",
        JSON.stringify(result, null, 2)
      );

      if (
        !response.ok ||
        !result?.success
      ) {
        throw new Error(
          result?.message ||
            "Failed to claim gift."
        );
      }

      const data = result?.data || {};

      const reward = Number(
        data?.reward ??
          data?.reward_amount ??
          data?.gift?.amount ??
          giftReward
      );

      const balance = Number(
        data?.remaining_balance ??
          data?.wallet?.balance ??
          0
      );

      setWalletBalance(balance);
      setClaimed(true);

      Alert.alert(
        "🎁 Gift Added!",
        `₹${reward} has been added to your wallet.`,
        [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]
      );

    } catch (error: any) {
      console.error(
        "CLAIM REWARD ERROR:",
        error
      );

      Alert.alert(
        "Unable to Claim Gift",
        error?.message ||
          "Something went wrong."
      );

    } finally {
      setClaiming(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#9B4DFF"
        />

        <Text style={styles.loadingText}>
          Opening your gift...
        </Text>
      </View>
    );
  }

  // =====================================================
  // IMAGE
  // =====================================================

  const imageName =
    String(product?.image || "").trim();

  const productImageUrl =
    imageName
      ? imageName.startsWith("http://") ||
        imageName.startsWith("https://")
        ? imageName
        : `${API_BASE_URL}/uploads/${imageName}`
      : "";

  // =====================================================
  // SCREEN
  // =====================================================

  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ‹
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Your Gift
        </Text>

        <View style={styles.headerSpace} />

      </View>

      {/* PRODUCT */}

      <View style={styles.productCard}>

        {productImageUrl ? (
          <Image
            source={{
              uri: productImageUrl,
            }}
            style={styles.productImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text
              style={styles.imagePlaceholderText}
            >
              No Image
            </Text>
          </View>
        )}

        <Text style={styles.productName}>
          {product?.name || "Product"}
        </Text>

        <Text style={styles.productText}>
          You received a special gift
          with this product.
        </Text>

      </View>

      {/* GIFT SECTION */}

      <View style={styles.scratchSection}>

        <Text style={styles.giftTitle}>
          🎁 Your Gift
        </Text>

        {/* ============================================
            ALREADY CLAIMED
        ============================================ */}

        {claimed ? (

          <View style={styles.revealedCard}>

            <Text style={styles.revealedEmoji}>
              🎁
            </Text>

            <Text style={styles.congratulations}>
              Gift Already Claimed
            </Text>

            <Text style={styles.productText}>
              This gift has already been claimed.
            </Text>

          </View>

        ) : giftReward <= 0 ? (

          /* ============================================
             NO GIFT
          ============================================ */

          <View style={styles.revealedCard}>

            <Text style={styles.revealedEmoji}>
              🎁
            </Text>

            <Text style={styles.noGiftTitle}>
              Gift Not Available
            </Text>

            <Text style={styles.productText}>
              This product QR code is valid,
              but no gift has been assigned
              to it.
            </Text>

          </View>

        ) : !scratched ? (

          /* ============================================
             SCRATCH CARD
          ============================================ */

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={revealGift}
            style={styles.scratchCard}
          >

            <Text style={styles.giftEmoji}>
              🎁
            </Text>

            <Text style={styles.scratchText}>
              SCRATCH
            </Text>

            <Text style={styles.scratchSubText}>
              Tap to reveal
            </Text>

          </TouchableOpacity>

        ) : (

          /* ============================================
             GIFT AVAILABLE
          ============================================ */

          <View style={styles.revealedCard}>

            <Text style={styles.revealedEmoji}>
              🎉
            </Text>

            <Text style={styles.congratulations}>
              Congratulations!
            </Text>

            <Text style={styles.rewardLabel}>
              Your Gift
            </Text>

            <Text style={styles.rewardAmount}>
              ₹{giftReward}
            </Text>

            <TouchableOpacity
              style={styles.claimButton}
              onPress={claimReward}
              disabled={claiming}
            >

              {claiming ? (

                <ActivityIndicator
                  color="#FFFFFF"
                />

              ) : (

                <Text
                  style={styles.claimButtonText}
                >
                  Add Gift to Wallet
                </Text>

              )}

            </TouchableOpacity>

          </View>
        )}

      </View>

      {/* INFO */}

      <Text style={styles.infoText}>
        This gift can be claimed only once.
      </Text>

    </View>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8F6F0",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F6F0",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#444444",
  },

  // ===================================================
  // HEADER
  // ===================================================

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  backText: {
    fontSize: 36,
    lineHeight: 38,
    color: "#222222",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222222",
  },

  headerSpace: {
    width: 40,
  },

  // ===================================================
  // PRODUCT
  // ===================================================

  productCard: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "#FFFFFF",

    elevation: 4,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  productImage: {
    width: 160,
    height: 160,
    marginBottom: 12,
  },

  imagePlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEEEEE",
    marginBottom: 12,
  },

  imagePlaceholderText: {
    color: "#999999",
    fontSize: 14,
  },

  productName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    color: "#222222",
  },

  productText: {
    fontSize: 14,
    textAlign: "center",
    color: "#666666",
    lineHeight: 20,
  },

  // ===================================================
  // GIFT
  // ===================================================

  scratchSection: {
    alignItems: "center",
    paddingHorizontal: 20,
  },

  giftTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 18,
    color: "#222222",
  },

  scratchCard: {
    width: "100%",
    height: 230,
    borderRadius: 28,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",

    elevation: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },

  giftEmoji: {
    fontSize: 58,
    marginBottom: 10,
  },

  scratchText: {
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#222222",
  },

  scratchSubText: {
    marginTop: 8,
    color: "#555555",
    fontSize: 14,
  },

  // ===================================================
  // REVEALED
  // ===================================================

  revealedCard: {
    width: "100%",
    minHeight: 280,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,

    elevation: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },

  revealedEmoji: {
    fontSize: 55,
  },

  congratulations: {
    fontSize: 23,
    fontWeight: "800",
    marginTop: 8,
    color: "#222222",
    textAlign: "center",
  },

  noGiftTitle: {
    fontSize: 23,
    fontWeight: "800",
    marginTop: 8,
    color: "#777777",
    textAlign: "center",
  },

  rewardLabel: {
    marginTop: 12,
    fontSize: 15,
    color: "#777777",
  },

  rewardAmount: {
    fontSize: 42,
    fontWeight: "900",
    marginTop: 3,
    color: "#1B7F3A",
  },

  // ===================================================
  // CLAIM
  // ===================================================

  claimButton: {
    width: "100%",
    marginTop: 22,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: "#1B7F3A",
    alignItems: "center",
  },

  claimButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  // ===================================================
  // INFO
  // ===================================================

  infoText: {
    textAlign: "center",
    marginTop: 20,
    color: "#777777",
    fontSize: 13,
    paddingHorizontal: 20,
  },
});