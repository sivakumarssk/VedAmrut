import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Canvas,
  Path,
  RoundedRect,
  Skia,
} from "@shopify/react-native-skia";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { API_BASE_URL } from "@/constants/api";
import { getToken } from "@/utils/storage";

const { width: SCREEN_WIDTH } =
  Dimensions.get("window");

const CARD_HORIZONTAL_MARGIN = 20;

const SCRATCH_CARD_WIDTH =
  SCREEN_WIDTH -
  CARD_HORIZONTAL_MARGIN * 2;

const SCRATCH_CARD_HEIGHT = 230;

const SCRATCH_REQUIRED_PERCENT = 45;

const SCRATCH_BRUSH_SIZE = 55;

const GRID_SIZE = 20;

export default function GiftCardScreen() {
  const params = useLocalSearchParams();

  const qrCode = String(
    params.qrCode || ""
  );

  const productId = String(
    params.productId || ""
  );

  const [loading, setLoading] =
    useState(true);

  const [claiming, setClaiming] =
    useState(false);

  const [scratched, setScratched] =
    useState(false);

  const [claimed, setClaimed] =
    useState(false);

  const [product, setProduct] =
    useState<any>(null);

  const [giftReward, setGiftReward] =
    useState(0);

  const [scratchPaths, setScratchPaths] =
    useState<any[]>([]);

  const currentPathRef =
    useRef<any>(null);

  const scratchedCellsRef =
    useRef<Set<string>>(new Set());

  // =====================================================
  // LOAD GIFT DETAILS
  // =====================================================

  useEffect(() => {
    loadGiftDetails();
  }, []);

  const loadGiftDetails =
    async () => {
      try {
        if (!qrCode) {
          Alert.alert(
            "Invalid QR",
            "QR code is missing.",
            [
              {
                text: "OK",
                onPress: () =>
                  router.back(),
              },
            ]
          );

          return;
        }

        // -------------------------------------------------
        // GET QR DETAILS
        // -------------------------------------------------

        const qrUrl =
          `${API_BASE_URL}/api/product-qr/scan/` +
          encodeURIComponent(qrCode);

        console.log(
          "QR DETAILS URL:",
          qrUrl
        );

        const qrResponse =
          await fetch(qrUrl);

        const qrResult =
          await qrResponse.json();

        console.log(
          "QR DETAILS:",
          JSON.stringify(
            qrResult,
            null,
            2
          )
        );

        if (
          !qrResponse.ok ||
          !qrResult?.success
        ) {
          throw new Error(
            qrResult?.message ||
              "Failed to load gift details."
          );
        }

        const qrData =
          qrResult?.data;

        if (!qrData) {
          throw new Error(
            "Gift details not found."
          );
        }

        // -------------------------------------------------
        // PRODUCT ID
        // -------------------------------------------------

        const qrProductId =
          qrData?.product_id ??
          qrData?.product?.id ??
          productId;

        // -------------------------------------------------
        // GET PRODUCTS
        // -------------------------------------------------

        const productsResponse =
          await fetch(
            `${API_BASE_URL}/api/products`
          );

        const productsResult =
          await productsResponse.json();

        if (
          !productsResponse.ok ||
          !productsResult?.success
        ) {
          throw new Error(
            productsResult?.message ||
              "Failed to load products."
          );
        }

        const products =
          Array.isArray(
            productsResult?.data
          )
            ? productsResult.data
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

        setProduct(
          currentProduct
        );

        // -------------------------------------------------
        // QR-SPECIFIC REWARD
        // -------------------------------------------------

        const rawReward =
          qrData?.reward_amount ?? 0;

        const reward =
          Number(rawReward);

        const finalReward =
          Number.isFinite(reward) &&
          reward > 0
            ? reward
            : 0;

        console.log(
          "QR REWARD:",
          finalReward
        );

        setGiftReward(
          finalReward
        );

        // -------------------------------------------------
        // CLAIM STATUS
        // -------------------------------------------------

        const alreadyClaimed =
          qrData?.is_claimed === true ||
          qrData?.is_claimed === "true" ||
          qrData?.is_claimed === 1 ||
          qrData?.is_claimed === "1";

        console.log(
          "ALREADY CLAIMED:",
          alreadyClaimed
        );

        setClaimed(
          alreadyClaimed
        );

        // Already claimed does not
        // need scratch screen.
        if (alreadyClaimed) {
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
              onPress: () =>
                router.back(),
            },
          ]
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // CREATE SCRATCH PATH
  // =====================================================

  const createScratchPath = (
    x: number,
    y: number
  ) => {
    const path =
      Skia.Path.Make();

    path.moveTo(x, y);

    return path;
  };

  // =====================================================
  // CALCULATE SCRATCHED AREA
  // =====================================================

  const markScratchedArea = (
    x: number,
    y: number
  ) => {
    const radius =
      SCRATCH_BRUSH_SIZE / 2;

    const startX = Math.floor(
      (x - radius) / GRID_SIZE
    );

    const endX = Math.floor(
      (x + radius) / GRID_SIZE
    );

    const startY = Math.floor(
      (y - radius) / GRID_SIZE
    );

    const endY = Math.floor(
      (y + radius) / GRID_SIZE
    );

    for (
      let gridX = startX;
      gridX <= endX;
      gridX++
    ) {
      for (
        let gridY = startY;
        gridY <= endY;
        gridY++
      ) {
        const centerX =
          gridX * GRID_SIZE +
          GRID_SIZE / 2;

        const centerY =
          gridY * GRID_SIZE +
          GRID_SIZE / 2;

        const distance =
          Math.sqrt(
            Math.pow(
              centerX - x,
              2
            ) +
              Math.pow(
                centerY - y,
                2
              )
          );

        if (
          distance <= radius
        ) {
          scratchedCellsRef.current.add(
            `${gridX}_${gridY}`
          );
        }
      }
    }

    const totalColumns =
      Math.ceil(
        SCRATCH_CARD_WIDTH /
          GRID_SIZE
      );

    const totalRows =
      Math.ceil(
        SCRATCH_CARD_HEIGHT /
          GRID_SIZE
      );

    const totalCells =
      totalColumns * totalRows;

    const scratchedPercentage =
      (scratchedCellsRef.current
        .size /
        totalCells) *
      100;

    console.log(
      "SCRATCHED:",
      scratchedPercentage.toFixed(
        1
      ),
      "%"
    );

    if (
      scratchedPercentage >=
      SCRATCH_REQUIRED_PERCENT
    ) {
      setScratched(true);
    }
  };

  // =====================================================
  // SCRATCH PAN RESPONDER
  // =====================================================

  const scratchPanResponder =
    useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder:
            () => true,

          onMoveShouldSetPanResponder:
            () => true,

          // ---------------------------------------------
          // FINGER TOUCH
          // ---------------------------------------------

          onPanResponderGrant:
            (event) => {
              if (scratched) {
                return;
              }

              const {
                locationX,
                locationY,
              } =
                event.nativeEvent;

              const path =
                createScratchPath(
                  locationX,
                  locationY
                );

              currentPathRef.current =
                path;

              setScratchPaths(
                (prev) => [
                  ...prev,
                  path,
                ]
              );

              // Immediately erase
              // touched area.
              markScratchedArea(
                locationX,
                locationY
              );
            },

          // ---------------------------------------------
          // FINGER MOVEMENT
          // ---------------------------------------------

          onPanResponderMove:
            (event) => {
              if (scratched) {
                return;
              }

              const {
                locationX,
                locationY,
              } =
                event.nativeEvent;

              const path =
                currentPathRef.current;

              if (!path) {
                return;
              }

              path.lineTo(
                locationX,
                locationY
              );

              setScratchPaths(
                (prev) => [
                  ...prev.slice(
                    0,
                    -1
                  ),
                  path,
                ]
              );

              // Erase continuously
              // while finger moves.
              markScratchedArea(
                locationX,
                locationY
              );
            },

          // ---------------------------------------------
          // RELEASE
          // ---------------------------------------------

          onPanResponderRelease:
            () => {
              currentPathRef.current =
                null;
            },

          onPanResponderTerminate:
            () => {
              currentPathRef.current =
                null;
            },
        }),
      [scratched]
    );

  // =====================================================
  // CLAIM REWARD
  // =====================================================

  const claimReward =
    async () => {
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

        if (claimed) {
          Alert.alert(
            "Gift Already Claimed",
            "This gift has already been claimed."
          );

          return;
        }

        const token =
          await getToken();

        if (!token) {
          Alert.alert(
            "Login Required",
            "Please login to claim this gift."
          );

          return;
        }

        setClaiming(true);

        const response =
          await fetch(
            `${API_BASE_URL}/api/product-qr/claim`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                qrCode,
              }),
            }
          );

        const result =
          await response.json();

        console.log(
          "CLAIM RESPONSE:",
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
              "Failed to claim gift."
          );
        }

        const data =
          result?.data || {};

        const reward =
          Number(
            data?.reward ??
              data?.reward_amount ??
              data?.gift?.amount ??
              giftReward
          );

        setClaimed(true);

        // Alert.alert(
        //   "🎁 Gift Added!",
        //   `₹${reward.toFixed(
        //     2
        //   )} has been added to your wallet.`,
        //   [
        //     {
        //       text: "OK",
        //       onPress: () =>
        //         router.back(),
        //     },
        //   ]
        // );
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
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color="#9B4DFF"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Opening your gift...
        </Text>
      </View>
    );
  }

  // =====================================================
  // PRODUCT IMAGE
  // =====================================================

  const imageName =
    String(
      product?.image || ""
    ).trim();

  const productImageUrl =
    imageName
      ? imageName.startsWith(
          "http://"
        ) ||
        imageName.startsWith(
          "https://"
        )
        ? imageName
        : `${API_BASE_URL}/uploads/${imageName}`
      : "";

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <View
      style={styles.container}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <View
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() =>
            router.back()
          }
          style={
            styles.backButton
          }
        >
          <Text
            style={
              styles.backText
            }
          >
            ‹
          </Text>
        </TouchableOpacity>

        <Text
          style={
            styles.headerTitle
          }
        >
          Your Gift
        </Text>

        <View
          style={
            styles.headerSpace
          }
        />
      </View>

      {/* =================================================
          GIFT SECTION
      ================================================= */}

      <View
        style={
          styles.giftSection
        }
      >
        <Text
          style={
            styles.giftTitle
          }
        >
          🎁 Your Gift
        </Text>

        {/* =================================================
            SCRATCH CARD
        ================================================= */}

        {!scratched ? (
          <View
            style={
              styles.scratchCard
            }
            {...scratchPanResponder.panHandlers}
          >
            {/* =================================================
                CONTENT UNDER SCRATCH COATING
            ================================================= */}

            <View
              style={
                styles.scratchBase
              }
            >
              {giftReward > 0 ? (
                <>
                  <Text
                    style={
                      styles.scratchEmoji
                    }
                  >
                    🎁
                  </Text>

                  <Text
                    style={
                      styles.scratchBaseTitle
                    }
                  >
                    Your Gift
                  </Text>

                  <Text
                    style={
                      styles.rewardLabel
                    }
                  >
                    Gift Amount
                  </Text>

                  <Text
                    style={
                      styles.rewardAmount
                    }
                  >
                    ₹
                    {giftReward.toFixed(
                      2
                    )}
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={
                      styles.scratchEmoji
                    }
                  >
                    🎁
                  </Text>

                  <Text
                    style={
                      styles.scratchBaseTitle
                    }
                  >
                    Gift Not Available
                  </Text>

                  <Text
                    style={
                      styles.noGiftText
                    }
                  >
                    No gift is assigned
                    to this QR code
                  </Text>
                </>
              )}
            </View>

            {/* =================================================
                SCRATCH COATING
            ================================================= */}

            <View
              pointerEvents="none"
              style={
                StyleSheet.absoluteFill
              }
            >
              <Canvas
                style={
                  StyleSheet.absoluteFill
                }
              >
                {/* Gray scratch layer */}

                <RoundedRect
                  x={0}
                  y={0}
                  width={
                    SCRATCH_CARD_WIDTH
                  }
                  height={
                    SCRATCH_CARD_HEIGHT
                  }
                  r={28}
                  color="#C8C8C8"
                />

                {/* Actual erasing paths */}

                {scratchPaths.map(
                  (
                    path,
                    index
                  ) => (
                    <Path
                      key={index}
                      path={path}
                      style="stroke"
                      strokeWidth={
                        SCRATCH_BRUSH_SIZE
                      }
                      strokeCap="round"
                      strokeJoin="round"
                      color="#FFFFFF"
                      blendMode="dstOut"
                    />
                  )
                )}
              </Canvas>
            </View>

            {/* =================================================
                SCRATCH INSTRUCTION
            ================================================= */}

            {scratchPaths.length ===
              0 && (
              <View
                pointerEvents="none"
                style={
                  styles.scratchInstruction
                }
              >
                <Text
                  style={
                    styles.scratchOverlayText
                  }
                >
                  SCRATCH HERE
                </Text>

                <Text
                  style={
                    styles.scratchOverlaySubText
                  }
                >
                  Move your finger
                  over the card
                </Text>
              </View>
            )}
          </View>
        ) : claimed ? (
          /* =================================================
             ALREADY CLAIMED
          ================================================= */

          <View
            style={
              styles.revealedCard
            }
          >
            <Text
              style={
                styles.revealedEmoji
              }
            >
              🎁
            </Text>

            <Text
              style={
                styles.congratulations
              }
            >
              Gift Already Claimed
            </Text>

            <Text
              style={
                styles.productText
              }
            >
              This gift has already
              been claimed.
            </Text>
          </View>
        ) : giftReward > 0 ? (
          /* =================================================
             GIFT AVAILABLE
          ================================================= */

          <View
            style={
              styles.revealedCard
            }
          >
            <Text
              style={
                styles.revealedEmoji
              }
            >
              🎉
            </Text>

            {/* IMPORTANT:
                Congratulations appears ONLY here,
                after scratching is completed.
            */}

            <Text
              style={
                styles.congratulations
              }
            >
              Congratulations!
            </Text>

            <Text
              style={
                styles.rewardLabelDark
              }
            >
              You won
            </Text>

            <Text
              style={
                styles.rewardAmountDark
              }
            >
              ₹
              {giftReward.toFixed(
                2
              )}
            </Text>

            <TouchableOpacity
              style={
                styles.claimButton
              }
              onPress={
                claimReward
              }
              disabled={
                claiming
              }
            >
              {claiming ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <Text
                  style={
                    styles.claimButtonText
                  }
                >
                  Add Gift to Wallet
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          /* =================================================
             NO GIFT
          ================================================= */

          <View
            style={
              styles.revealedCard
            }
          >
            <Text
              style={
                styles.revealedEmoji
              }
            >
              🎁
            </Text>

            <Text
              style={
                styles.noGiftTitle
              }
            >
              Gift Not Available
            </Text>

            <Text
              style={
                styles.productText
              }
            >
              This QR code is valid,
              but no gift has been
              assigned to it.
            </Text>
          </View>
        )}
      </View>

      {/* =================================================
          PRODUCT
      ================================================= */}

      <View
        style={
          styles.productCard
        }
      >
        <Text
          style={
            styles.productSectionTitle
          }
        >
          Product
        </Text>

        {productImageUrl ? (
          <Image
            source={{
              uri: productImageUrl,
            }}
            style={
              styles.productImage
            }
            resizeMode="contain"
          />
        ) : (
          <View
            style={
              styles.imagePlaceholder
            }
          >
            <Text
              style={
                styles.imagePlaceholderText
              }
            >
              No Image
            </Text>
          </View>
        )}

        <Text
          style={
            styles.productName
          }
        >
          {product?.name ||
            "Product"}
        </Text>

        <Text
          style={
            styles.productText
          }
        >
          You received a special
          gift with this product.
        </Text>
      </View>

      {/* =================================================
          INFO
      ================================================= */}

      <Text
        style={
          styles.infoText
        }
      >
        This gift can be claimed
        only once.
      </Text>
    </View>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#F8F6F0",
    },

    loadingContainer: {
      flex: 1,
      justifyContent:
        "center",
      alignItems: "center",
      backgroundColor:
        "#F8F6F0",
    },

    loadingText: {
      marginTop: 12,
      fontSize: 15,
      fontFamily:
        "InterRegular",
      color: "#444444",
    },

    // =================================================
    // HEADER
    // =================================================

    header: {
      height: 60,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      paddingHorizontal: 18,
      backgroundColor:
        "#FFFFFF",
    },

    backButton: {
      width: 40,
      height: 40,
      justifyContent:
        "center",
      alignItems: "center",
    },

    backText: {
      fontSize: 36,
      lineHeight: 38,
      fontFamily:
        "InterRegular",
      color: "#222222",
    },

    headerTitle: {
      fontSize: 20,
      fontFamily:
        "InterBold",
      color: "#222222",
    },

    headerSpace: {
      width: 40,
    },

    // =================================================
    // GIFT SECTION
    // =================================================

    giftSection: {
      alignItems:
        "center",
      paddingHorizontal: 20,
      paddingTop: 18,
    },

    giftTitle: {
      fontSize: 22,
      fontFamily:
        "InterBold",
      marginBottom: 14,
      color: "#222222",
    },

    // =================================================
    // SCRATCH CARD
    // =================================================

    scratchCard: {
      width: "100%",
      height:
        SCRATCH_CARD_HEIGHT,
      borderRadius: 28,
      overflow: "hidden",
      elevation: 5,
      shadowColor:
        "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },

    scratchBase: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        "#9B4DFF",
      justifyContent:
        "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },

    scratchEmoji: {
      fontSize: 48,
      marginBottom: 5,
    },

    scratchBaseTitle: {
      fontSize: 24,
      fontFamily:
        "InterBold",
      color: "#FFFFFF",
      textAlign: "center",
    },

    rewardLabel: {
      marginTop: 8,
      fontSize: 15,
      fontFamily:
        "InterRegular",
      color: "#FFFFFF",
    },

    rewardAmount: {
      fontSize: 38,
      fontFamily:
        "InterBold",
      marginTop: 2,
      color: "#FFFFFF",
    },

    noGiftText: {
      marginTop: 8,
      fontSize: 14,
      fontFamily:
        "InterRegular",
      color: "#FFFFFF",
      textAlign: "center",
    },

    // =================================================
    // SCRATCH INSTRUCTION
    // =================================================

    scratchInstruction: {
      ...StyleSheet.absoluteFillObject,
      justifyContent:
        "center",
      alignItems: "center",
    },

    scratchOverlayText: {
      fontSize: 25,
      fontFamily:
        "InterBold",
      letterSpacing: 2,
      color: "#333333",
    },

    scratchOverlaySubText: {
      marginTop: 8,
      fontSize: 14,
      fontFamily:
        "InterRegular",
      color: "#555555",
      textAlign: "center",
    },

    // =================================================
    // REVEALED CARD
    // =================================================

    revealedCard: {
      width: "100%",
      minHeight: 230,
      borderRadius: 28,
      backgroundColor:
        "#FFFFFF",
      justifyContent:
        "center",
      alignItems: "center",
      padding: 25,
      elevation: 5,
      shadowColor:
        "#000000",
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
      fontFamily:
        "InterBold",
      marginTop: 8,
      color: "#222222",
      textAlign: "center",
    },

    rewardLabelDark: {
      marginTop: 10,
      fontSize: 15,
      fontFamily:
        "InterRegular",
      color: "#666666",
    },

    rewardAmountDark: {
      fontSize: 38,
      fontFamily:
        "InterBold",
      marginTop: 2,
      color: "#9B4DFF",
    },

    noGiftTitle: {
      fontSize: 23,
      fontFamily:
        "InterBold",
      marginTop: 8,
      color: "#777777",
      textAlign: "center",
    },

    // =================================================
    // CLAIM BUTTON
    // =================================================

    claimButton: {
      width: "100%",
      marginTop: 20,
      paddingVertical: 15,
      borderRadius: 14,
      backgroundColor:
        "#1B7F3A",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    claimButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontFamily:
        "InterBold",
    },

    // =================================================
    // PRODUCT
    // =================================================

    productCard: {
      marginHorizontal: 20,
      marginTop: 18,
      padding: 15,
      borderRadius: 20,
      alignItems:
        "center",
      backgroundColor:
        "#FFFFFF",
      elevation: 4,
      shadowColor:
        "#000000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 5,
    },

    productSectionTitle: {
      alignSelf:
        "flex-start",
      fontSize: 16,
      fontFamily:
        "InterBold",
      color: "#222222",
      marginBottom: 5,
    },

    productImage: {
      width: 90,
      height: 90,
      marginBottom: 5,
    },

    imagePlaceholder: {
      width: 90,
      height: 90,
      borderRadius: 15,
      justifyContent:
        "center",
      alignItems:
        "center",
      backgroundColor:
        "#EEEEEE",
      marginBottom: 5,
    },

    imagePlaceholderText: {
      color: "#999999",
      fontSize: 14,
      fontFamily:
        "InterRegular",
    },

    productName: {
      fontSize: 18,
      fontFamily:
        "InterBold",
      marginBottom: 4,
      textAlign: "center",
      color: "#222222",
    },

    productText: {
      fontSize: 13,
      fontFamily:
        "InterRegular",
      textAlign: "center",
      color: "#666666",
      lineHeight: 18,
    },

    infoText: {
      textAlign: "center",
      marginTop: 12,
      color: "#777777",
      fontSize: 13,
      fontFamily:
        "InterRegular",
      paddingHorizontal: 20,
    },
  });
