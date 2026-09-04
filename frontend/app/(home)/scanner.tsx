// import { Ionicons } from "@expo/vector-icons";
// import {
//   CameraView,
//   useCameraPermissions,
// } from "expo-camera";
// import { router } from "expo-router";
// import React, { useState } from "react";

// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import { SafeAreaView } from "react-native-safe-area-context";

// import ScreenHeader from "@/components/common/ScreenHeader";
// import { API_BASE_URL } from "@/constants/api";
// import { getToken } from "@/utils/storage";

// const { width } = Dimensions.get("window");

// const FRAME_SIZE = width - 64;
// const CORNER_SIZE = 32;

// export default function ScannerScreen() {
//   const [permission, requestPermission] =
//     useCameraPermissions();

//   const [torchOn, setTorchOn] = useState(false);
//   const [scanned, setScanned] = useState(false);
//   const [processing, setProcessing] = useState(false);

//   // =====================================================
//   // QR SCANNED
//   // =====================================================

//   const handleBarcodeScanned = async ({
//     data,
//   }: {
//     data: string;
//   }) => {
//     if (scanned || processing) {
//       return;
//     }

//     const qrCode = String(data || "").trim();

//     if (!qrCode) {
//       return;
//     }

//     setScanned(true);
//     setProcessing(true);

//     console.log("================================");
//     console.log("PRODUCT QR SCANNED");
//     console.log("QR CODE:", qrCode);
//     console.log("================================");

//     try {
//       // =================================================
//       // LOGIN CHECK
//       // =================================================

//       const token = await getToken();

//       if (!token) {
//         Alert.alert(
//           "Login Required",
//           "Please login before scanning a product QR.",
//           [
//             {
//               text: "OK",
//               onPress: () => {
//                 setScanned(false);
//               },
//             },
//           ]
//         );

//         return;
//       }

//       // =================================================
//       // GET QR DETAILS
//       // =================================================

//       const url =
//         `${API_BASE_URL}/api/product-qr/scan/` +
//         encodeURIComponent(qrCode);

//       console.log("QR DETAILS URL:", url);

//       const response = await fetch(url);

//       const result = await response.json();

//       console.log(
//         "QR DETAILS RESPONSE:",
//         JSON.stringify(result, null, 2)
//       );

//       // if (!response.ok || !result?.success) {
//       //   throw new Error(
//       //     result?.message ||
//       //       "Invalid product QR code"
//       //   );
//       // }
// if (!response.ok || !result?.success || !result?.data) {
//   Alert.alert(
//     "Invalid QR Code",
//     result?.message ||
//       "This QR code is not a valid VedAmrut product QR.",
//     [
//       {
//         text: "Scan Again",
//         onPress: () => {
//           setScanned(false);
//         },
//       },
//     ]
//   );

//   return;
// }
//       const qrData = result?.data;

//       if (!qrData) {
//         throw new Error(
//           "Product details not found"
//         );
//       }

//       // =================================================
//       // EXTRACT DATA
//       // =================================================

//       const productId =
//         qrData?.product_id;

//       const productName =
//         qrData?.product_name ??
//         qrData?.product?.name ??
//         "";

//       const productDescription =
//         qrData?.product_description ??
//         qrData?.product?.description ??
//         "";

//       const productPrice =
//         qrData?.product_price ??
//         qrData?.product?.price ??
//         "0";

//       const productImage =
//         qrData?.product_image ??
//         qrData?.product?.image ??
//         "";

//       const productStock =
//         qrData?.product_stock ??
//         "0";

//       const rewardAmount =
//         qrData?.reward_amount ??
//         qrData?.reward?.amount ??
//         "0";

//       const unitNumber =
//         qrData?.unit_number ??
//         "";

//       const categoryName =
//         qrData?.category_name ??
//         qrData?.product?.category_name ??
//         "";

//       const isClaimed =
//         qrData?.is_claimed === true;

//       // =================================================
//       // VALIDATE PRODUCT
//       // =================================================

//       if (
//         productId === undefined ||
//         productId === null ||
//         String(productId).trim() === ""
//       ) {
//         throw new Error(
//           "QR code does not contain a valid product"
//         );
//       }

//       // =================================================
//       // ALREADY CLAIMED
//       // =================================================

//       if (isClaimed) {
//         Alert.alert(
//           "Already Claimed",
//           "This product QR reward has already been claimed.",
//           [
//             {
//               text: "Scan Again",
//               onPress: () => {
//                 setScanned(false);
//               },
//             },
//           ]
//         );

//         return;
//       }

//       const reward = Number(rewardAmount);

// if (!Number.isFinite(reward) || reward <= 0) {
//   Alert.alert(
//     "No Gift Available",
//     "This VedAmrut product QR is valid, but no gift is assigned to this QR code.",
//     [
//       {
//         text: "Scan Again",
//         onPress: () => {
//           setScanned(false);
//         },
//       },
//     ]
//   );

//   return;
// }
//       // =================================================
//       // GO DIRECTLY TO GIFT CARD
//       // =================================================

//       console.log("================================");
//       console.log("OPEN GIFT CARD");
//       console.log("PRODUCT ID:", productId);
//       console.log("PRODUCT:", productName);
//       console.log("REWARD:", rewardAmount);
//       console.log("QR CODE:", qrCode);
//       console.log("================================");

//       router.push({
//         pathname: "/(home)/gift-card",

//         params: {
//           productId: String(productId),

//           qrCode: String(qrCode),

//           productName:
//             String(productName),

//           productDescription:
//             String(productDescription),

//           productPrice:
//             String(productPrice),

//           productImage:
//             String(productImage),

//           productStock:
//             String(productStock),

//           rewardAmount:
//             String(rewardAmount),

//           unitNumber:
//             String(unitNumber),

//           categoryName:
//             String(categoryName),

//           isClaimed: "false",
//         },
//       });
//     } catch (error: any) {
//       console.error(
//         "QR SCAN ERROR:",
//         error
//       );

//       Alert.alert(
//         "QR Scan Failed",
//         error?.message ||
//           "Unable to process this QR code.",
//         [
//           {
//             text: "Try Again",
//             onPress: () => {
//               setScanned(false);
//             },
//           },
//         ]
//       );
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // =====================================================
//   // CAMERA PERMISSION
//   // =====================================================

//   if (!permission) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.center}>
//           <ActivityIndicator
//             size="large"
//             color="#9B4DFF"
//           />

//           <Text style={styles.loadingText}>
//             Checking camera permission...
//           </Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // =====================================================
//   // SCREEN
//   // =====================================================

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScreenHeader
//         title="Scan Product QR"
//         titleStyle={styles.title}
//         iconColor="#FFFFFF"
//       />

//       <View style={styles.content}>

//         {/* HEADER */}

//         <View style={styles.headingContainer}>

//           <View style={styles.qrHeaderIcon}>
//             <Ionicons
//               name="qr-code-outline"
//               size={26}
//               color="#9B4DFF"
//             />
//           </View>

//           <Text style={styles.heading}>
//             Scan Product QR
//           </Text>

//           <Text style={styles.subtitle}>
//             Scan the QR code printed on your
//             VedAmrut product to reveal your gift.
//           </Text>

//         </View>

//         {/* CAMERA */}

//         <View style={styles.frameWrapper}>

//           {permission.granted ? (
//             <CameraView
//               style={styles.camera}
//               facing="back"
//               enableTorch={torchOn}
//               barcodeScannerSettings={{
//                 barcodeTypes: ["qr"],
//               }}
//               onBarcodeScanned={
//                 scanned
//                   ? undefined
//                   : handleBarcodeScanned
//               }
//             />
//           ) : (
//             <TouchableOpacity
//               style={styles.permissionPrompt}
//               onPress={requestPermission}
//               activeOpacity={0.8}
//             >
//               <View style={styles.permissionIcon}>
//                 <Ionicons
//                   name="camera-outline"
//                   size={35}
//                   color="#9B4DFF"
//                 />
//               </View>

//               <Text style={styles.permissionTitle}>
//                 Camera Access Required
//               </Text>

//               <Text style={styles.permissionText}>
//                 Tap here to allow camera access
//               </Text>
//             </TouchableOpacity>
//           )}

//           {/* CORNERS */}

//           <View
//             pointerEvents="none"
//             style={styles.cornerOverlay}
//           >
//             <View
//               style={[
//                 styles.corner,
//                 styles.cornerTopLeft,
//               ]}
//             />

//             <View
//               style={[
//                 styles.corner,
//                 styles.cornerTopRight,
//               ]}
//             />

//             <View
//               style={[
//                 styles.corner,
//                 styles.cornerBottomLeft,
//               ]}
//             />

//             <View
//               style={[
//                 styles.corner,
//                 styles.cornerBottomRight,
//               ]}
//             />
//           </View>

//           {/* PROCESSING */}

//           {processing && (
//             <View style={styles.loadingOverlay}>
//               <View style={styles.processingCard}>

//                 <ActivityIndicator
//                   size="large"
//                   color="#9B4DFF"
//                 />

//                 <Text style={styles.processingTitle}>
//                   Opening Your Gift...
//                 </Text>

//                 <Text style={styles.processingText}>
//                   Please wait
//                 </Text>

//               </View>
//             </View>
//           )}

//         </View>

//         <Text style={styles.scanHint}>
//           Position the QR code inside the frame
//         </Text>

//         {/* TORCH */}

//         <TouchableOpacity
//           style={styles.torchButton}
//           onPress={() =>
//             setTorchOn(
//               (previous) => !previous
//             )
//           }
//           activeOpacity={0.8}
//         >
//           <View
//             style={[
//               styles.torchIcon,
//               torchOn &&
//                 styles.torchIconActive,
//             ]}
//           >
//             <Ionicons
//               name="flashlight-outline"
//               size={21}
//               color="#FFFFFF"
//             />
//           </View>

//           <Text style={styles.torchText}>
//             {torchOn
//               ? "Turn Off Torch"
//               : "Turn On Torch"}
//           </Text>
//         </TouchableOpacity>

//       </View>
//     </SafeAreaView>
//   );
// }

// // =====================================================
// // STYLES
// // =====================================================

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#000000",
//   },

//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//   },

//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#000000",
//   },

//   loadingText: {
//     marginTop: 12,
//     color: "#AAAAAA",
//     fontSize: 14,
//   },

//   title: {
//     flex: 1,
//     fontSize: 21,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     textAlign: "center",
//     marginRight: 40,
//   },

//   headingContainer: {
//     alignItems: "center",
//     marginTop: 22,
//     marginBottom: 24,
//   },

//   qrHeaderIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#EFE3FF",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   heading: {
//     color: "#FFFFFF",
//     fontSize: 23,
//     fontWeight: "800",
//   },

//   subtitle: {
//     marginTop: 7,
//     textAlign: "center",
//     color: "#999999",
//     fontSize: 13,
//     lineHeight: 19,
//     maxWidth: 330,
//   },

//   frameWrapper: {
//     width: FRAME_SIZE,
//     height: FRAME_SIZE,
//     maxHeight: 390,
//     alignSelf: "center",
//     borderRadius: 26,
//     overflow: "hidden",
//     backgroundColor: "#181818",
//   },

//   camera: {
//     flex: 1,
//   },

//   permissionPrompt: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 30,
//   },

//   permissionIcon: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: "#EFE3FF",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   permissionTitle: {
//     marginTop: 15,
//     color: "#FFFFFF",
//     fontSize: 17,
//     fontWeight: "700",
//   },

//   permissionText: {
//     marginTop: 7,
//     color: "#999999",
//     fontSize: 13,
//     textAlign: "center",
//   },

//   cornerOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },

//   corner: {
//     position: "absolute",
//     width: CORNER_SIZE,
//     height: CORNER_SIZE,
//     borderColor: "#9B4DFF",
//   },

//   cornerTopLeft: {
//     top: 20,
//     left: 20,
//     borderTopWidth: 4,
//     borderLeftWidth: 4,
//     borderTopLeftRadius: 12,
//   },

//   cornerTopRight: {
//     top: 20,
//     right: 20,
//     borderTopWidth: 4,
//     borderRightWidth: 4,
//     borderTopRightRadius: 12,
//   },

//   cornerBottomLeft: {
//     bottom: 20,
//     left: 20,
//     borderBottomWidth: 4,
//     borderLeftWidth: 4,
//     borderBottomLeftRadius: 12,
//   },

//   cornerBottomRight: {
//     bottom: 20,
//     right: 20,
//     borderBottomWidth: 4,
//     borderRightWidth: 4,
//     borderBottomRightRadius: 12,
//   },

//   scanHint: {
//     marginTop: 16,
//     textAlign: "center",
//     color: "#999999",
//     fontSize: 13,
//   },

//   torchButton: {
//     alignSelf: "center",
//     marginTop: 18,
//     marginBottom: 25,
//     alignItems: "center",
//   },

//   torchIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#292929",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   torchIconActive: {
//     backgroundColor: "#9B4DFF",
//   },

//   torchText: {
//     marginTop: 7,
//     color: "#FFFFFF",
//     fontSize: 12,
//     fontWeight: "600",
//   },

//   loadingOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.65)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   processingCard: {
//     width: 180,
//     paddingVertical: 22,
//     borderRadius: 18,
//     backgroundColor: "#FFFFFF",
//     alignItems: "center",
//   },

//   processingTitle: {
//     marginTop: 12,
//     color: "#222222",
//     fontSize: 15,
//     fontWeight: "700",
//   },

//   processingText: {
//     marginTop: 4,
//     color: "#999999",
//     fontSize: 12,
//   },
// });
import { Ionicons } from "@expo/vector-icons";
import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import ScreenHeader from "@/components/common/ScreenHeader";
import { API_BASE_URL } from "@/constants/api";
import { getToken } from "@/utils/storage";

const { width } = Dimensions.get("window");

const FRAME_SIZE = width - 64;
const CORNER_SIZE = 32;

export default function ScannerScreen() {
  const [permission, requestPermission] =
    useCameraPermissions();

  const [torchOn, setTorchOn] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      setProcessing(false);
    }, [])
  );

  // =====================================================
  // QR SCANNED
  // =====================================================

  const handleBarcodeScanned = async ({
    data,
  }: {
    data: string;
  }) => {
    if (scanned || processing) {
      return;
    }

    const qrCode = String(data || "").trim();

    if (!qrCode) {
      return;
    }

    setScanned(true);
    setProcessing(true);

    console.log("================================");
    console.log("PRODUCT QR SCANNED");
    console.log("QR CODE:", qrCode);
    console.log("================================");

    try {
      // =================================================
      // LOGIN CHECK
      // =================================================

      const token = await getToken();

      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login before scanning a product QR.",
          [
            {
              text: "OK",
              onPress: () => {
                setScanned(false);
              },
            },
          ]
        );

        return;
      }

      // =================================================
      // GET QR DETAILS
      // =================================================

      const url =
        `${API_BASE_URL}/api/product-qr/scan/` +
        encodeURIComponent(qrCode);

      console.log("QR DETAILS URL:", url);

      const response = await fetch(url);

      const result = await response.json();

      console.log(
        "QR DETAILS RESPONSE:",
        JSON.stringify(result, null, 2)
      );

      // =================================================
      // VALID QR CHECK
      // =================================================

      if (
        !response.ok ||
        !result?.success ||
        !result?.data
      ) {
        Alert.alert(
          "Invalid QR Code",
          result?.message ||
            "This QR code is not a valid VedAmrut product QR.",
          [
            {
              text: "Scan Again",
              onPress: () => {
                setScanned(false);
              },
            },
          ]
        );

        return;
      }

      const qrData = result?.data;

      if (!qrData) {
        throw new Error(
          "Product details not found"
        );
      }

      // =================================================
      // EXTRACT DATA
      // =================================================

      const productId =
        qrData?.product_id;

      const productName =
        qrData?.product_name ??
        qrData?.product?.name ??
        "";

      const productDescription =
        qrData?.product_description ??
        qrData?.product?.description ??
        "";

      const productPrice =
        qrData?.product_price ??
        qrData?.product?.price ??
        "0";

      const productImage =
        qrData?.product_image ??
        qrData?.product?.image ??
        "";

      const productStock =
        qrData?.product_stock ??
        "0";

      const rewardAmount =
        qrData?.reward_amount ??
        qrData?.reward?.amount ??
        qrData?.gift_reward ??
        qrData?.gift?.amount ??
        "0";

      const unitNumber =
        qrData?.unit_number ??
        "";

      const categoryName =
        qrData?.category_name ??
        qrData?.product?.category_name ??
        "";

      // =================================================
      // CLAIM STATUS
      // =================================================

      const isClaimed =
        qrData?.is_claimed === true ||
        qrData?.is_claimed === "true" ||
        qrData?.is_claimed === 1 ||
        qrData?.is_claimed === "1";

      // =================================================
      // VALIDATE PRODUCT
      // =================================================

      if (
        productId === undefined ||
        productId === null ||
        String(productId).trim() === ""
      ) {
        throw new Error(
          "QR code does not contain a valid product"
        );
      }

      const reward = Number(
        rewardAmount
      );

      console.log("================================");
      console.log("QR PRODUCT DETAILS");
      console.log("PRODUCT ID:", productId);
      console.log("PRODUCT:", productName);
      console.log("REWARD:", reward);
      console.log("IS CLAIMED:", isClaimed);
      console.log("================================");

      // =================================================
      // IMPORTANT
      //
      // DO NOT SHOW ALERT FOR reward = 0
      //
      // GiftCardScreen will display:
      // "Gift Not Available"
      //
      // Also do not stop for claimed QR.
      // GiftCardScreen will display:
      // "Gift Already Claimed"
      // =================================================

      // =================================================
      // GO TO GIFT CARD
      // =================================================

      console.log("================================");
      console.log("OPEN GIFT CARD");
      console.log("PRODUCT ID:", productId);
      console.log("PRODUCT:", productName);
      console.log("REWARD:", rewardAmount);
      console.log("QR CODE:", qrCode);
      console.log("CLAIMED:", isClaimed);
      console.log("================================");

      router.push({
        pathname: "/(home)/gift-card",

        params: {
          productId:
            String(productId),

          qrCode:
            String(qrCode),

          productName:
            String(productName),

          productDescription:
            String(productDescription),

          productPrice:
            String(productPrice),

          productImage:
            String(productImage),

          productStock:
            String(productStock),

          rewardAmount:
            String(rewardAmount),

          unitNumber:
            String(unitNumber),

          categoryName:
            String(categoryName),

          // IMPORTANT:
          // Send the actual claim status.
          isClaimed:
            String(isClaimed),
        },
      });
    } catch (error: any) {
      console.error(
        "QR SCAN ERROR:",
        error
      );

      Alert.alert(
        "QR Scan Failed",
        error?.message ||
          "Unable to process this QR code.",
        [
          {
            text: "Try Again",
            onPress: () => {
              setScanned(false);
            },
          },
        ]
      );
    } finally {
      setProcessing(false);
    }
  };

  // =====================================================
  // CAMERA PERMISSION
  // =====================================================

  if (!permission) {
    return (
      <SafeAreaView
        style={styles.safeArea}
      >
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#9B4DFF"
          />

          <Text style={styles.loadingText}>
            Checking camera permission...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // =====================================================
  // SCREEN
  // =====================================================

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ScreenHeader
        title="Scan Product QR"
        titleStyle={styles.title}
        iconColor="#FFFFFF"
      />

      <View style={styles.content}>

        {/* HEADER */}

        <View
          style={styles.headingContainer}
        >
          <View
            style={styles.qrHeaderIcon}
          >
            <Ionicons
              name="qr-code-outline"
              size={26}
              color="#9B4DFF"
            />
          </View>

          <Text style={styles.heading}>
            Scan Product QR
          </Text>

          <Text style={styles.subtitle}>
            Scan the QR code printed on your
            VedAmrut product to reveal your gift.
          </Text>
        </View>

        {/* CAMERA */}

        <View
          style={styles.frameWrapper}
        >
          {permission.granted ? (
            <CameraView
              style={styles.camera}
              facing="back"
              enableTorch={torchOn}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={
                scanned
                  ? undefined
                  : handleBarcodeScanned
              }
            />
          ) : (
            <TouchableOpacity
              style={styles.permissionPrompt}
              onPress={
                requestPermission
              }
              activeOpacity={0.8}
            >
              <View
                style={
                  styles.permissionIcon
                }
              >
                <Ionicons
                  name="camera-outline"
                  size={35}
                  color="#9B4DFF"
                />
              </View>

              <Text
                style={
                  styles.permissionTitle
                }
              >
                Camera Access Required
              </Text>

              <Text
                style={
                  styles.permissionText
                }
              >
                Tap here to allow camera access
              </Text>
            </TouchableOpacity>
          )}

          {/* CORNERS */}

          <View
            pointerEvents="none"
            style={styles.cornerOverlay}
          >
            <View
              style={[
                styles.corner,
                styles.cornerTopLeft,
              ]}
            />

            <View
              style={[
                styles.corner,
                styles.cornerTopRight,
              ]}
            />

            <View
              style={[
                styles.corner,
                styles.cornerBottomLeft,
              ]}
            />

            <View
              style={[
                styles.corner,
                styles.cornerBottomRight,
              ]}
            />
          </View>

          {/* PROCESSING */}

          {processing && (
            <View
              style={styles.loadingOverlay}
            >
              <View
                style={
                  styles.processingCard
                }
              >
                <ActivityIndicator
                  size="large"
                  color="#9B4DFF"
                />

                <Text
                  style={
                    styles.processingTitle
                  }
                >
                  Opening Your Gift...
                </Text>

                <Text
                  style={
                    styles.processingText
                  }
                >
                  Please wait
                </Text>
              </View>
            </View>
          )}
        </View>

        <Text style={styles.scanHint}>
          Position the QR code inside the frame
        </Text>

        {/* TORCH */}

        <TouchableOpacity
          style={styles.torchButton}
          onPress={() =>
            setTorchOn(
              (previous) => !previous
            )
          }
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.torchIcon,
              torchOn &&
                styles.torchIconActive,
            ]}
          >
            <Ionicons
              name="flashlight-outline"
              size={21}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.torchText}>
            {torchOn
              ? "Turn Off Torch"
              : "Turn On Torch"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },

  loadingText: {
    marginTop: 12,
    color: "#AAAAAA",
    fontSize: 14,
  },

  title: {
    flex: 1,
    fontSize: 21,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginRight: 40,
  },

  headingContainer: {
    alignItems: "center",
    marginTop: 22,
    marginBottom: 24,
  },

  qrHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EFE3FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  heading: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 7,
    textAlign: "center",
    color: "#999999",
    fontSize: 13,
    lineHeight: 19,
    maxWidth: 330,
  },

  frameWrapper: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    maxHeight: 390,
    alignSelf: "center",
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "#181818",
  },

  camera: {
    flex: 1,
  },

  permissionPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  permissionIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#EFE3FF",
    justifyContent: "center",
    alignItems: "center",
  },

  permissionTitle: {
    marginTop: 15,
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  permissionText: {
    marginTop: 7,
    color: "#999999",
    fontSize: 13,
    textAlign: "center",
  },

  cornerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: "#9B4DFF",
  },

  cornerTopLeft: {
    top: 20,
    left: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },

  cornerTopRight: {
    top: 20,
    right: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },

  cornerBottomLeft: {
    bottom: 20,
    left: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },

  cornerBottomRight: {
    bottom: 20,
    right: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },

  scanHint: {
    marginTop: 16,
    textAlign: "center",
    color: "#999999",
    fontSize: 13,
  },

  torchButton: {
    alignSelf: "center",
    marginTop: 18,
    marginBottom: 25,
    alignItems: "center",
  },

  torchIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#292929",
    justifyContent: "center",
    alignItems: "center",
  },

  torchIconActive: {
    backgroundColor: "#9B4DFF",
  },

  torchText: {
    marginTop: 7,
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:
      "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },

  processingCard: {
    width: 180,
    paddingVertical: 22,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },

  processingTitle: {
    marginTop: 12,
    color: "#222222",
    fontSize: 15,
    fontWeight: "700",
  },

  processingText: {
    marginTop: 4,
    color: "#999999",
    fontSize: 12,
  },
});