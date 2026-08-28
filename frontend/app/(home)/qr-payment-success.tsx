// import React from "react";

// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import { Ionicons } from "@expo/vector-icons";

// import {
//   router,
//   useLocalSearchParams,
// } from "expo-router";

// import { SafeAreaView } from "react-native-safe-area-context";

// export default function QRPaymentSuccessScreen() {
//   const params =
//     useLocalSearchParams<{
//       productName?: string | string[];
//       reward?: string | string[];
//       remainingBalance?: string | string[];
//     }>();

//   const getParam = (
//     value?: string | string[]
//   ) => {
//     return Array.isArray(value)
//       ? value[0]
//       : value;
//   };

//   const productName =
//     getParam(params.productName);

//   const reward =
//     getParam(params.reward);

//   const remainingBalance =
//     getParam(params.remainingBalance);

//   const rewardAmount = Number(
//     reward || 0
//   );

//   const walletBalance = Number(
//     remainingBalance || 0
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         {/* SUCCESS */}

//         <View style={styles.successCircle}>
//           <Ionicons
//             name="checkmark"
//             size={62}
//             color="#FFFFFF"
//           />
//         </View>

//         <Text style={styles.title}>
//           Reward Added!
//         </Text>

//         <Text style={styles.subtitle}>
//           Your QR reward has been successfully
//           credited to your VedAmrut wallet.
//         </Text>

//         {/* AMOUNT */}

//         <View style={styles.rewardBox}>
//           <Text style={styles.rewardBoxLabel}>
//             REWARD ADDED
//           </Text>

//           <Text style={styles.rewardBoxAmount}>
//             ₹{rewardAmount.toFixed(2)}
//           </Text>

//           <View style={styles.rewardBoxIcon}>
//             <Ionicons
//               name="wallet-outline"
//               size={22}
//               color="#9B4DFF"
//             />

//             <Text style={styles.walletText}>
//               Wallet credited successfully
//             </Text>
//           </View>
//         </View>

//         {/* DETAILS */}

//         <View style={styles.card}>
//           <DetailRow
//             icon="cube-outline"
//             label="Product"
//             value={productName || "-"}
//           />

//           <View style={styles.divider} />

//           <DetailRow
//             icon="gift-outline"
//             label="Reward"
//             value={`₹${rewardAmount.toFixed(2)}`}
//             valueStyle={styles.rewardValue}
//           />

//           <View style={styles.divider} />

//           <DetailRow
//             icon="wallet-outline"
//             label="Wallet Balance"
//             value={`₹${walletBalance.toFixed(2)}`}
//             valueStyle={styles.balanceValue}
//           />
//         </View>

//         {/* HOME */}

//         <TouchableOpacity
//           style={styles.homeButton}
//           onPress={() =>
//             router.replace("/")
//           }
//           activeOpacity={0.85}
//         >
//           <Ionicons
//             name="home-outline"
//             size={20}
//             color="#FFFFFF"
//           />

//           <Text style={styles.homeButtonText}>
//             BACK TO HOME
//           </Text>
//         </TouchableOpacity>

//         {/* SCAN AGAIN */}

//         <TouchableOpacity
//           style={styles.scanButton}
//           onPress={() =>
//             router.replace("/scanner")
//           }
//           activeOpacity={0.85}
//         >
//           <Ionicons
//             name="qr-code-outline"
//             size={20}
//             color="#9B4DFF"
//           />

//           <Text style={styles.scanButtonText}>
//             SCAN ANOTHER PRODUCT
//           </Text>
//         </TouchableOpacity>

//         <Text style={styles.bottomText}>
//           Thank you for choosing VedAmrut
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// }

// // =====================================================
// // DETAIL ROW
// // =====================================================

// function DetailRow({
//   icon,
//   label,
//   value,
//   valueStyle,
// }: {
//   icon: any;
//   label: string;
//   value: string;
//   valueStyle?: any;
// }) {
//   return (
//     <View style={styles.detailRow}>
//       <View style={styles.detailLeft}>
//         <View style={styles.detailIcon}>
//           <Ionicons
//             name={icon}
//             size={19}
//             color="#9B4DFF"
//           />
//         </View>

//         <Text style={styles.detailLabel}>
//           {label}
//         </Text>
//       </View>

//       <Text
//         style={[
//           styles.detailValue,
//           valueStyle,
//         ]}
//         numberOfLines={2}
//       >
//         {value}
//       </Text>
//     </View>
//   );
// }

// // =====================================================
// // STYLES
// // =====================================================

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#F7F7F7",
//   },

//   container: {
//     flex: 1,
//     paddingHorizontal: 24,
//     justifyContent: "center",
//   },

//   successCircle: {
//     width: 96,
//     height: 96,
//     borderRadius: 48,
//     backgroundColor: "#27AE60",
//     justifyContent: "center",
//     alignItems: "center",
//     alignSelf: "center",
//   },

//   title: {
//     marginTop: 20,
//     textAlign: "center",
//     color: "#171717",
//     fontSize: 29,
//     fontWeight: "900",
//   },

//   subtitle: {
//     marginTop: 8,
//     textAlign: "center",
//     color: "#777777",
//     fontSize: 14,
//     lineHeight: 21,
//   },

//   rewardBox: {
//     marginTop: 25,
//     backgroundColor: "#EFE3FF",
//     borderRadius: 22,
//     paddingVertical: 22,
//     alignItems: "center",
//   },

//   rewardBoxLabel: {
//     color: "#777777",
//     fontSize: 10,
//     fontWeight: "800",
//     letterSpacing: 1.2,
//   },

//   rewardBoxAmount: {
//     marginTop: 4,
//     color: "#9B4DFF",
//     fontSize: 36,
//     fontWeight: "900",
//   },

//   rewardBoxIcon: {
//     marginTop: 8,
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   walletText: {
//     marginLeft: 6,
//     color: "#777777",
//     fontSize: 12,
//     fontWeight: "600",
//   },

//   card: {
//     marginTop: 16,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 19,
//     elevation: 2,
//   },

//   detailRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   detailLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },

//   detailIcon: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: "#EFE3FF",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 10,
//   },

//   detailLabel: {
//     color: "#777777",
//     fontSize: 14,
//   },

//   detailValue: {
//     maxWidth: "55%",
//     textAlign: "right",
//     color: "#222222",
//     fontSize: 14,
//     fontWeight: "700",
//   },

//   rewardValue: {
//     color: "#9B4DFF",
//     fontSize: 17,
//     fontWeight: "800",
//   },

//   balanceValue: {
//     color: "#27AE60",
//     fontSize: 17,
//     fontWeight: "800",
//   },

//   divider: {
//     height: 1,
//     backgroundColor: "#EEEEEE",
//     marginVertical: 14,
//   },

//   homeButton: {
//     marginTop: 22,
//     height: 55,
//     borderRadius: 28,
//     backgroundColor: "#9B4DFF",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 3,
//   },

//   homeButtonText: {
//     marginLeft: 8,
//     color: "#FFFFFF",
//     fontSize: 15,
//     fontWeight: "800",
//   },

//   scanButton: {
//     marginTop: 12,
//     height: 55,
//     borderRadius: 28,
//     borderWidth: 1,
//     borderColor: "#9B4DFF",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   scanButtonText: {
//     marginLeft: 8,
//     color: "#9B4DFF",
//     fontSize: 14,
//     fontWeight: "800",
//   },

//   bottomText: {
//     marginTop: 18,
//     textAlign: "center",
//     color: "#AAAAAA",
//     fontSize: 12,
//   },
// });

import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

export default function QRPaymentSuccessScreen() {
  const params =
    useLocalSearchParams<{
      productId?: string | string[];
      qrCode?: string | string[];
      productName?: string | string[];
      productPrice?: string | string[];
      reward?: string | string[];
      rewardClaimed?: string | string[];
      remainingBalance?: string | string[];
      categoryName?: string | string[];
      productImage?: string | string[];
      unitNumber?: string | string[];
    }>();

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
    value?: string | number | null
  ): number => {
    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      return 0;
    }

    return numberValue;
  };

  const formatMoney = (
    value?: string | number | null
  ): string => {
    return `₹${toNumber(value).toFixed(2)}`;
  };

  // =====================================================
  // PARAMS
  // =====================================================

  const productName =
    getParam(params.productName) ||
    "VedAmrut Product";

  const productPrice =
    toNumber(
      getParam(params.productPrice)
    );

  const reward =
    toNumber(
      getParam(params.reward)
    );

  const remainingBalance =
    toNumber(
      getParam(
        params.remainingBalance
      )
    );

  const rewardClaimed =
    getParam(
      params.rewardClaimed
    ) === "true";

  // =====================================================
  // SCREEN
  // =====================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* =================================================
            SUCCESS ICON
        ================================================= */}

        <View style={styles.successCircle}>
          <Ionicons
            name="checkmark"
            size={62}
            color="#FFFFFF"
          />
        </View>

        {/* =================================================
            TITLE
        ================================================= */}

        <Text style={styles.title}>
          Payment Successful!
        </Text>

        <Text style={styles.subtitle}>
          Your payment has been successfully
          completed using your VedAmrut wallet.
        </Text>

        {/* =================================================
            PAYMENT AMOUNT
        ================================================= */}

        <View style={styles.paymentBox}>
          <Text style={styles.paymentBoxLabel}>
            PAYMENT SUCCESSFUL
          </Text>

          <Text style={styles.paymentBoxAmount}>
            {formatMoney(productPrice)}
          </Text>

          <View style={styles.paymentBoxIcon}>
            <Ionicons
              name="wallet-outline"
              size={22}
              color="#9B4DFF"
            />

            <Text style={styles.walletText}>
              Amount deducted from wallet
            </Text>
          </View>
        </View>

        {/* =================================================
            PAYMENT DETAILS
        ================================================= */}

        <View style={styles.card}>

          <DetailRow
            icon="cube-outline"
            label="Product"
            value={productName}
          />

          <View style={styles.divider} />

          <DetailRow
            icon="card-outline"
            label="Amount Paid"
            value={formatMoney(productPrice)}
            valueStyle={styles.paymentValue}
          />

          <View style={styles.divider} />

          <DetailRow
            icon="wallet-outline"
            label="Wallet Balance"
            value={formatMoney(
              remainingBalance
            )}
            valueStyle={styles.balanceValue}
          />

        </View>

        {/* =================================================
            REWARD NOT CLAIMED
        ================================================= */}

        {!rewardClaimed &&
          reward > 0 && (
            <View style={styles.rewardCard}>

              <View style={styles.rewardIcon}>
                <Ionicons
                  name="gift-outline"
                  size={24}
                  color="#9B4DFF"
                />
              </View>

              <View style={styles.rewardContent}>

                <Text style={styles.rewardTitle}>
                  QR Reward Available
                </Text>

                <Text style={styles.rewardText}>
                  Your QR reward of{" "}
                  <Text style={styles.rewardAmount}>
                    {formatMoney(reward)}
                  </Text>{" "}
                  has not been claimed yet.
                </Text>

                <Text style={styles.rewardHint}>
                  You can claim it separately later.
                </Text>

              </View>
            </View>
          )}

        {/* =================================================
            REWARD CLAIMED
        ================================================= */}

        {rewardClaimed &&
          reward > 0 && (
            <View
              style={styles.rewardClaimedCard}
            >
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#27AE60"
              />

              <View
                style={
                  styles.rewardClaimedContent
                }
              >
                <Text
                  style={
                    styles.rewardClaimedTitle
                  }
                >
                  Reward Claimed
                </Text>

                <Text
                  style={
                    styles.rewardClaimedText
                  }
                >
                  {formatMoney(reward)} was
                  added to your wallet.
                </Text>
              </View>
            </View>
          )}

        {/* =================================================
            BACK HOME
        ================================================= */}

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() =>
            router.replace("/")
          }
          activeOpacity={0.85}
        >
          <Ionicons
            name="home-outline"
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.homeButtonText}>
            BACK TO HOME
          </Text>
        </TouchableOpacity>

        {/* =================================================
            SCAN ANOTHER PRODUCT
        ================================================= */}

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() =>
            router.replace("/scanner")
          }
          activeOpacity={0.85}
        >
          <Ionicons
            name="qr-code-outline"
            size={20}
            color="#9B4DFF"
          />

          <Text style={styles.scanButtonText}>
            SCAN ANOTHER PRODUCT
          </Text>
        </TouchableOpacity>

        {/* =================================================
            FOOTER
        ================================================= */}

        <Text style={styles.bottomText}>
          Thank you for choosing VedAmrut
        </Text>

      </View>
    </SafeAreaView>
  );
}

// =====================================================
// DETAIL ROW
// =====================================================

function DetailRow({
  icon,
  label,
  value,
  valueStyle,
}: {
  icon: any;
  label: string;
  value: string;
  valueStyle?: any;
}) {
  return (
    <View style={styles.detailRow}>

      <View style={styles.detailLeft}>

        <View style={styles.detailIcon}>
          <Ionicons
            name={icon}
            size={19}
            color="#9B4DFF"
          />
        </View>

        <Text style={styles.detailLabel}>
          {label}
        </Text>

      </View>

      <Text
        style={[
          styles.detailValue,
          valueStyle,
        ]}
        numberOfLines={2}
      >
        {value}
      </Text>

    </View>
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

  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  // ===================================================
  // SUCCESS
  // ===================================================

  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#27AE60",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  title: {
    marginTop: 20,
    textAlign: "center",
    color: "#171717",
    fontSize: 29,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 8,
    textAlign: "center",
    color: "#777777",
    fontSize: 14,
    lineHeight: 21,
  },

  // ===================================================
  // PAYMENT BOX
  // ===================================================

  paymentBox: {
    marginTop: 25,
    backgroundColor: "#EFE3FF",
    borderRadius: 22,
    paddingVertical: 22,
    alignItems: "center",
  },

  paymentBoxLabel: {
    color: "#777777",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  paymentBoxAmount: {
    marginTop: 4,
    color: "#9B4DFF",
    fontSize: 36,
    fontWeight: "900",
  },

  paymentBoxIcon: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  walletText: {
    marginLeft: 6,
    color: "#777777",
    fontSize: 12,
    fontWeight: "600",
  },

  // ===================================================
  // DETAILS CARD
  // ===================================================

  card: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 19,
    elevation: 2,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  detailIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EFE3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  detailLabel: {
    color: "#777777",
    fontSize: 14,
  },

  detailValue: {
    maxWidth: "55%",
    textAlign: "right",
    color: "#222222",
    fontSize: 14,
    fontWeight: "700",
  },

  paymentValue: {
    color: "#9B4DFF",
    fontSize: 17,
    fontWeight: "800",
  },

  balanceValue: {
    color: "#27AE60",
    fontSize: 17,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 14,
  },

  // ===================================================
  // REWARD AVAILABLE
  // ===================================================

  rewardCard: {
    marginTop: 14,
    backgroundColor: "#EFE3FF",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  rewardIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
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
    fontWeight: "900",
  },

  rewardText: {
    marginTop: 3,
    color: "#777777",
    fontSize: 11,
    lineHeight: 17,
  },

  rewardAmount: {
    color: "#9B4DFF",
    fontWeight: "900",
  },

  rewardHint: {
    marginTop: 2,
    color: "#999999",
    fontSize: 10,
  },

  // ===================================================
  // REWARD CLAIMED
  // ===================================================

  rewardClaimedCard: {
    marginTop: 14,
    backgroundColor: "#E8F8EE",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  rewardClaimedContent: {
    flex: 1,
    marginLeft: 11,
  },

  rewardClaimedTitle: {
    color: "#27AE60",
    fontSize: 14,
    fontWeight: "900",
  },

  rewardClaimedText: {
    marginTop: 3,
    color: "#777777",
    fontSize: 11,
  },

  // ===================================================
  // HOME BUTTON
  // ===================================================

  homeButton: {
    marginTop: 22,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#9B4DFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  homeButtonText: {
    marginLeft: 8,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  // ===================================================
  // SCAN BUTTON
  // ===================================================

  scanButton: {
    marginTop: 12,
    height: 55,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#9B4DFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  scanButtonText: {
    marginLeft: 8,
    color: "#9B4DFF",
    fontSize: 14,
    fontWeight: "800",
  },

  // ===================================================
  // FOOTER
  // ===================================================

  bottomText: {
    marginTop: 18,
    textAlign: "center",
    color: "#AAAAAA",
    fontSize: 12,
  },
});