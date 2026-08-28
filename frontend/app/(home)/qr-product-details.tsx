// import React, {
//   useCallback,
//   useState,
// } from "react";

// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import { SafeAreaView } from "react-native-safe-area-context";

// import { Ionicons } from "@expo/vector-icons";

// import {
//   router,
//   useFocusEffect,
//   useLocalSearchParams,
// } from "expo-router";

// import { API_BASE_URL } from "@/constants/api";
// import { getToken } from "@/utils/storage";

// // =====================================================
// // TYPES
// // =====================================================

// type QRData = {
//   id?: number;
//   product_id?: number;

//   qr_code?: string;

//   unit_number?: number | string;

//   is_claimed?: boolean;

//   claimed_by?: number | null;
//   claimed_at?: string | null;

//   category_id?: number;
//   category_name?: string;

//   product_name?: string;
//   product_description?: string;
//   product_price?: string | number;
//   product_image?: string | null;
//   product_stock?: number | string;

//   reward_amount?: string | number;

//   product?: {
//     id?: number;
//     name?: string;
//     description?: string;
//     price?: string | number;
//     image?: string | null;
//     stock?: number | string;
//     category_id?: number;
//     category_name?: string;
//   };

//   reward?: {
//     amount?: string | number;
//   };
// };

// // =====================================================
// // HELPER
// // =====================================================

// const getParam = (
//   value?: string | string[]
// ): string | undefined => {
//   if (Array.isArray(value)) {
//     return value[0];
//   }

//   return value;
// };

// // =====================================================
// // SCREEN
// // =====================================================

// export default function QRProductDetailsScreen() {
//   // =====================================================
//   // ROUTE PARAMS
//   // =====================================================

//   const params =
//     useLocalSearchParams<{
//       qrCode?: string | string[];

//       productId?: string | string[];
//       productName?: string | string[];
//       productDescription?: string | string[];
//       productPrice?: string | string[];
//       productImage?: string | string[];
//       productStock?: string | string[];
//       rewardAmount?: string | string[];
//       unitNumber?: string | string[];
//       categoryName?: string | string[];
//       isClaimed?: string | string[];
//     }>();

//   const qrCode = getParam(
//     params.qrCode
//   );

//   // =====================================================
//   // STATES
//   // =====================================================

//   const [qrData, setQrData] =
//     useState<QRData | null>(null);

//   const [loading, setLoading] =
//     useState(true);

//   const [claiming, setClaiming] =
//     useState(false);

//   // =====================================================
//   // FETCH QR DETAILS
//   // =====================================================

//   const fetchQRDetails =
//     useCallback(async () => {
//       if (!qrCode) {
//         setLoading(false);

//         Alert.alert(
//           "Invalid QR",
//           "QR code was not found.",
//           [
//             {
//               text: "Scan Again",
//               onPress: () =>
//                 router.replace(
//                   "/scanner"
//                 ),
//             },
//           ]
//         );

//         return;
//       }

//       try {
//         setLoading(true);

//         console.log(
//           "================================"
//         );

//         console.log(
//           "QR PRODUCT DETAILS"
//         );

//         console.log(
//           "QR CODE:",
//           qrCode
//         );

//         console.log(
//           "================================"
//         );

//         // =================================================
//         // API URL
//         // =================================================

//         const url =
//           `${API_BASE_URL}/api/product-qr/scan/` +
//           encodeURIComponent(
//             qrCode.trim()
//           );

//         console.log(
//           "QR DETAILS URL:",
//           url
//         );

//         // =================================================
//         // FETCH
//         // =================================================

//         const response =
//           await fetch(url);

//         const result =
//           await response.json();

//         console.log(
//           "QR DETAILS STATUS:",
//           response.status
//         );

//         console.log(
//           "QR DETAILS RESPONSE:",
//           JSON.stringify(
//             result,
//             null,
//             2
//           )
//         );

//         // =================================================
//         // VALIDATE
//         // =================================================

//         if (
//           !response.ok ||
//           !result?.success
//         ) {
//           throw new Error(
//             result?.message ||
//               "Unable to load QR product details."
//           );
//         }

//         if (!result?.data) {
//           throw new Error(
//             "QR product details were not found."
//           );
//         }

//         // =================================================
//         // SAVE DATA
//         // =================================================

//         setQrData(
//           result.data
//         );

//         console.log(
//           "================================"
//         );

//         console.log(
//           "QR DATA LOADED"
//         );

//         console.log(
//           "PRODUCT ID:",
//           result.data?.product_id
//         );

//         console.log(
//           "PRODUCT NAME:",
//           result.data?.product_name ||
//             result.data?.product?.name
//         );

//         console.log(
//           "REWARD:",
//           result.data?.reward_amount ||
//             result.data?.reward?.amount
//         );

//         console.log(
//           "IS CLAIMED:",
//           result.data?.is_claimed
//         );

//         console.log(
//           "UNIT:",
//           result.data?.unit_number
//         );

//         console.log(
//           "================================"
//         );
//       } catch (error: any) {
//         console.error(
//           "QR PRODUCT DETAILS ERROR:",
//           error
//         );

//         setQrData(null);

//         Alert.alert(
//           "Unable to Load QR",
//           error?.message ||
//             "Unable to load product QR details.",
//           [
//             {
//               text: "Scan Again",
//               onPress: () =>
//                 router.replace(
//                   "/scanner"
//                 ),
//             },
//           ]
//         );
//       } finally {
//         setLoading(false);
//       }
//     }, [qrCode]);

//   // =====================================================
//   // REFRESH WHEN SCREEN OPENS
//   // =====================================================

//   useFocusEffect(
//     useCallback(() => {
//       fetchQRDetails();
//     }, [fetchQRDetails])
//   );

//   // =====================================================
//   // PRODUCT DATA
//   // =====================================================

//   const productName =
//     qrData?.product?.name ||
//     qrData?.product_name ||
//     getParam(
//       params.productName
//     ) ||
//     "VedAmrut Product";

//   const productDescription =
//     qrData?.product?.description ||
//     qrData?.product_description ||
//     getParam(
//       params.productDescription
//     ) ||
//     "";

//   const productPrice =
//     Number(
//       qrData?.product?.price ??
//         qrData?.product_price ??
//         getParam(
//           params.productPrice
//         ) ??
//         0
//     ) || 0;

//   const productStock =
//     Number(
//       qrData?.product?.stock ??
//         qrData?.product_stock ??
//         getParam(
//           params.productStock
//         ) ??
//         0
//     ) || 0;

//   const productImage =
//     qrData?.product?.image ||
//     qrData?.product_image ||
//     getParam(
//       params.productImage
//     ) ||
//     "";

//   const categoryName =
//     qrData?.product?.category_name ||
//     qrData?.category_name ||
//     getParam(
//       params.categoryName
//     ) ||
//     "";

//   const unitNumber =
//     qrData?.unit_number ??
//     getParam(
//       params.unitNumber
//     ) ??
//     "";

//   // =====================================================
//   // REWARD
//   // =====================================================

//   const rewardAmount =
//     Number(
//       qrData?.reward?.amount ??
//         qrData?.reward_amount ??
//         getParam(
//           params.rewardAmount
//         ) ??
//         0
//     ) || 0;

//   // =====================================================
//   // CLAIM STATUS
//   //
//   // IMPORTANT:
//   // Prefer fresh backend value.
//   // =====================================================

//   const isClaimed =
//     qrData?.is_claimed === true;

//   // =====================================================
//   // IMAGE URL
//   // =====================================================

//   const getImageUrl = (
//     image: string
//   ): string => {
//     if (!image) {
//       return "";
//     }

//     if (
//       image.startsWith(
//         "http://"
//       ) ||
//       image.startsWith(
//         "https://"
//       )
//     ) {
//       return image;
//     }

//     // Remove leading slash
//     const cleanImage =
//       image.replace(
//         /^\/+/,
//         ""
//       );

//     // If backend already returned uploads/...
//     if (
//       cleanImage.startsWith(
//         "uploads/"
//       )
//     ) {
//       return `${API_BASE_URL}/${cleanImage}`;
//     }

//     // Normal product image
//     return `${API_BASE_URL}/uploads/${cleanImage}`;
//   };

//   // =====================================================
//   // CLAIM REWARD
//   // =====================================================

//   const handleClaimReward =
//     async () => {
//       if (claiming) {
//         return;
//       }

//       if (!qrCode) {
//         Alert.alert(
//           "Invalid QR",
//           "QR code was not found."
//         );

//         return;
//       }

//       // =================================================
//       // ALREADY CLAIMED
//       // =================================================

//       if (isClaimed) {
//         Alert.alert(
//           "Already Claimed",
//           "This QR code has already been claimed."
//         );

//         return;
//       }

//       // =================================================
//       // LOGIN
//       // =================================================

//       try {
//         setClaiming(true);

//         const token =
//           await getToken();

//         if (!token) {
//           Alert.alert(
//             "Login Required",
//             "Please login to claim this reward.",
//             [
//               {
//                 text: "Login",
//                 onPress: () =>
//                   router.replace(
//                     "/login"
//                   ),
//               },
//               {
//                 text: "Cancel",
//                 style: "cancel",
//               },
//             ]
//           );

//           return;
//         }

//         console.log(
//           "================================"
//         );

//         console.log(
//           "CLAIM PRODUCT QR"
//         );

//         console.log(
//           "QR CODE:",
//           qrCode
//         );

//         console.log(
//           "REWARD:",
//           rewardAmount
//         );

//         console.log(
//           "PRODUCT:",
//           productName
//         );

//         console.log(
//           "================================"
//         );

//         // =================================================
//         // CLAIM API
//         // =================================================

//         const response =
//           await fetch(
//             `${API_BASE_URL}/api/product-qr/claim`,
//             {
//               method: "POST",

//               headers: {
//                 "Content-Type":
//                   "application/json",

//                 Authorization:
//                   `Bearer ${token}`,
//               },

//               body: JSON.stringify({
//                 qrCode:
//                   qrCode.trim(),
//               }),
//             }
//           );

//         const result =
//           await response.json();

//         console.log(
//           "CLAIM STATUS:",
//           response.status
//         );

//         console.log(
//           "CLAIM RESPONSE:",
//           JSON.stringify(
//             result,
//             null,
//             2
//           )
//         );

//         // =================================================
//         // UNAUTHORIZED
//         // =================================================

//         if (
//           response.status ===
//           401
//         ) {
//           Alert.alert(
//             "Login Required",
//             "Please login again to claim this reward.",
//             [
//               {
//                 text: "Login",
//                 onPress: () =>
//                   router.replace(
//                     "/login"
//                   ),
//               },
//             ]
//           );

//           return;
//         }

//         // =================================================
//         // ALREADY CLAIMED
//         // =================================================

//         if (
//           response.status ===
//           409
//         ) {
//           Alert.alert(
//             "QR Already Claimed",
//             result?.message ||
//               "This QR code has already been claimed.",
//             [
//               {
//                 text: "OK",
//                 onPress:
//                   fetchQRDetails,
//               },
//             ]
//           );

//           return;
//         }

//         // =================================================
//         // OTHER FAILURE
//         // =================================================

//         if (
//           !response.ok ||
//           !result?.success
//         ) {
//           throw new Error(
//             result?.message ||
//               "Unable to claim reward."
//           );
//         }

//         // =================================================
//         // SUCCESS DATA
//         // =================================================

//         const data =
//           result?.data || {};

//         const finalReward =
//           Number(
//             data?.reward ??
//               data?.reward_amount ??
//               data?.amount ??
//               rewardAmount
//           ) || 0;

//         const finalBalance =
//           Number(
//             data?.wallet?.balance ??
//               data?.wallet_balance ??
//               data?.remaining_balance ??
//               data?.balance ??
//               0
//           ) || 0;

//         const finalProductName =
//           data?.product?.name ||
//           data?.product_name ||
//           productName;

//         console.log(
//           "================================"
//         );

//         console.log(
//           "QR CLAIM SUCCESS"
//         );

//         console.log(
//           "PRODUCT:",
//           finalProductName
//         );

//         console.log(
//           "REWARD:",
//           finalReward
//         );

//         console.log(
//           "WALLET BALANCE:",
//           finalBalance
//         );

//         console.log(
//           "================================"
//         );

//         // =================================================
//         // GO TO SUCCESS SCREEN
//         // =================================================

//         router.replace({
//           pathname:
//             "/(home)/qr-payment-success",

//           params: {
//             productName:
//               String(
//                 finalProductName
//               ),

//             reward:
//               String(
//                 finalReward
//               ),

//             remainingBalance:
//               String(
//                 finalBalance
//               ),
//           },
//         });
//       } catch (error: any) {
//         console.error(
//           "CLAIM REWARD ERROR:",
//           error
//         );

//         Alert.alert(
//           "Reward Failed",
//           error?.message ||
//             "Something went wrong while claiming this reward."
//         );
//       } finally {
//         setClaiming(false);
//       }
//     };

//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (loading) {
//     return (
//       <SafeAreaView
//         style={styles.safeArea}
//       >
//         <Header />

//         <View
//           style={styles.center}
//         >
//           <ActivityIndicator
//             size="large"
//             color="#9B4DFF"
//           />

//           <Text
//             style={
//               styles.loadingText
//             }
//           >
//             Loading product details...
//           </Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // =====================================================
//   // NO DATA
//   // =====================================================

//   if (!qrData) {
//     return (
//       <SafeAreaView
//         style={styles.safeArea}
//       >
//         <Header />

//         <View
//           style={styles.center}
//         >
//           <View
//             style={
//               styles.errorIcon
//             }
//           >
//             <Ionicons
//               name="alert-circle-outline"
//               size={48}
//               color="#E74C3C"
//             />
//           </View>

//           <Text
//             style={
//               styles.errorTitle
//             }
//           >
//             QR Details Not Found
//           </Text>

//           <Text
//             style={
//               styles.errorText
//             }
//           >
//             We couldn't find the
//             product associated with
//             this QR code.
//           </Text>

//           <TouchableOpacity
//             style={
//               styles.goBackButton
//             }
//             onPress={() =>
//               router.replace(
//                 "/scanner"
//               )
//             }
//           >
//             <Text
//               style={
//                 styles.goBackText
//               }
//             >
//               Scan Again
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // =====================================================
//   // MAIN SCREEN
//   // =====================================================

//   return (
//     <SafeAreaView
//       style={styles.safeArea}
//     >
//       <Header />

//       <ScrollView
//         showsVerticalScrollIndicator={
//           false
//         }
//         contentContainerStyle={
//           styles.scrollContent
//         }
//       >
//         {/* =================================================
//             SCANNED BADGE
//         ================================================= */}

//         <View
//           style={
//             styles.scannedBadge
//           }
//         >
//           <Ionicons
//             name="checkmark-circle"
//             size={18}
//             color="#27AE60"
//           />

//           <Text
//             style={
//               styles.scannedText
//             }
//           >
//             QR scanned successfully
//           </Text>
//         </View>

//         {/* =================================================
//             PRODUCT IMAGE
//         ================================================= */}

//         <View
//           style={styles.imageCard}
//         >
//           {productImage ? (
//             <Image
//               source={{
//                 uri: getImageUrl(
//                   productImage
//                 ),
//               }}
//               style={
//                 styles.productImage
//               }
//               resizeMode="contain"
//               onError={(
//                 event
//               ) => {
//                 console.log(
//                   "PRODUCT IMAGE ERROR:",
//                   event.nativeEvent
//                 );

//                 console.log(
//                   "IMAGE URL:",
//                   getImageUrl(
//                     productImage
//                   )
//                 );
//               }}
//             />
//           ) : (
//             <View
//               style={styles.noImage}
//             >
//               <Ionicons
//                 name="image-outline"
//                 size={60}
//                 color="#CCCCCC"
//               />

//               <Text
//                 style={
//                   styles.noImageText
//                 }
//               >
//                 No product image
//               </Text>
//             </View>
//           )}

//           {categoryName ? (
//             <View
//               style={
//                 styles.categoryBadge
//               }
//             >
//               <Text
//                 style={
//                   styles.categoryText
//                 }
//               >
//                 {categoryName}
//               </Text>
//             </View>
//           ) : null}
//         </View>

//         {/* =================================================
//             PRODUCT INFORMATION
//         ================================================= */}

//         <View
//           style={styles.productCard}
//         >
//           <Text
//             style={
//               styles.productName
//             }
//           >
//             {productName}
//           </Text>

//           {productDescription ? (
//             <Text
//               style={
//                 styles.description
//               }
//             >
//               {productDescription}
//             </Text>
//           ) : null}

//           <View
//             style={styles.divider}
//           />

//           <InfoRow
//             label="Product Price"
//             value={`₹${productPrice.toFixed(
//               2
//             )}`}
//             valueStyle={
//               styles.price
//             }
//           />

//           <InfoRow
//             label="Available Stock"
//             value={String(
//               productStock
//             )}
//           />

//           <InfoRow
//             label="Unit Number"
//             value={
//               unitNumber
//                 ? String(
//                     unitNumber
//                   )
//                 : "-"
//             }
//             last
//           />
//         </View>

//         {/* =================================================
//             QR CODE
//         ================================================= */}

//         <View
//           style={styles.qrCard}
//         >
//           <View
//             style={styles.qrIcon}
//           >
//             <Ionicons
//               name="qr-code-outline"
//               size={27}
//               color="#9B4DFF"
//             />
//           </View>

//           <View
//             style={styles.qrContent}
//           >
//             <Text
//               style={styles.qrLabel}
//             >
//               PRODUCT QR
//             </Text>

//             <Text
//               style={styles.qrCode}
//               numberOfLines={3}
//             >
//               {qrCode || "-"}
//             </Text>
//           </View>
//         </View>

//         {/* =================================================
//             REWARD
//         ================================================= */}

//         <View
//           style={styles.rewardCard}
//         >
//           <View
//             style={styles.rewardIcon}
//           >
//             <Ionicons
//               name="gift-outline"
//               size={30}
//               color="#9B4DFF"
//             />
//           </View>

//           <View
//             style={styles.rewardContent}
//           >
//             <Text
//               style={
//                 styles.rewardLabel
//               }
//             >
//               YOUR WALLET REWARD
//             </Text>

//             <Text
//               style={
//                 styles.rewardAmount
//               }
//             >
//               ₹
//               {rewardAmount.toFixed(
//                 2
//               )}
//             </Text>

//             <Text
//               style={
//                 styles.rewardHint
//               }
//             >
//               This amount will be
//               credited to your
//               VedAmrut wallet.
//             </Text>
//           </View>
//         </View>

//         {/* =================================================
//             CLAIM STATUS
//         ================================================= */}

//         {isClaimed ? (
//           <View
//             style={
//               styles.claimedCard
//             }
//           >
//             <View
//               style={
//                 styles.claimedIcon
//               }
//             >
//               <Ionicons
//                 name="checkmark"
//                 size={28}
//                 color="#27AE60"
//               />
//             </View>

//             <View
//               style={
//                 styles.claimedContent
//               }
//             >
//               <Text
//                 style={
//                   styles.claimedTitle
//                 }
//               >
//                 Already Claimed
//               </Text>

//               <Text
//                 style={
//                   styles.claimedText
//                 }
//               >
//                 This product QR has
//                 already been claimed.
//               </Text>

//               {qrData.claimed_at ? (
//                 <Text
//                   style={
//                     styles.claimedDate
//                   }
//                 >
//                   Claimed on{" "}
//                   {new Date(
//                     qrData.claimed_at
//                   ).toLocaleDateString()}
//                 </Text>
//               ) : null}
//             </View>
//           </View>
//         ) : (
//           <>
//             {/* =================================================
//                 CLAIM BUTTON
//             ================================================= */}

//             <TouchableOpacity
//               style={[
//                 styles.claimButton,
//                 claiming &&
//                   styles.claimButtonDisabled,
//               ]}
//               onPress={
//                 handleClaimReward
//               }
//               disabled={
//                 claiming
//               }
//               activeOpacity={
//                 0.85
//               }
//             >
//               {claiming ? (
//                 <>
//                   <ActivityIndicator
//                     size="small"
//                     color="#FFFFFF"
//                   />

//                   <Text
//                     style={
//                       styles.claimButtonText
//                     }
//                   >
//                     Claiming Reward...
//                   </Text>
//                 </>
//               ) : (
//                 <>
//                   <Ionicons
//                     name="wallet-outline"
//                     size={22}
//                     color="#FFFFFF"
//                   />

//                   <Text
//                     style={
//                       styles.claimButtonText
//                     }
//                   >
//                     Claim ₹
//                     {rewardAmount.toFixed(
//                       2
//                     )}{" "}
//                     Reward
//                   </Text>
//                 </>
//               )}
//             </TouchableOpacity>

//             <Text
//               style={
//                 styles.secureText
//               }
//             >
//               Your reward will be
//               securely credited to
//               your wallet.
//             </Text>
//           </>
//         )}

//         {/* =================================================
//             SCAN ANOTHER
//         ================================================= */}

//         <TouchableOpacity
//           style={
//             styles.scanAgainButton
//           }
//           onPress={() =>
//             router.replace(
//               "/scanner"
//             )
//           }
//           activeOpacity={0.8}
//         >
//           <Ionicons
//             name="qr-code-outline"
//             size={20}
//             color="#9B4DFF"
//           />

//           <Text
//             style={
//               styles.scanAgainText
//             }
//           >
//             SCAN ANOTHER PRODUCT
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // =====================================================
// // HEADER
// // =====================================================

// function Header() {
//   return (
//     <View style={styles.header}>
//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={() =>
//           router.back()
//         }
//       >
//         <Ionicons
//           name="arrow-back"
//           size={24}
//           color="#FFFFFF"
//         />
//       </TouchableOpacity>

//       <Text
//         style={styles.headerTitle}
//       >
//         Product Details
//       </Text>

//       <View
//         style={styles.headerRight}
//       />
//     </View>
//   );
// }

// // =====================================================
// // INFO ROW
// // =====================================================

// function InfoRow({
//   label,
//   value,
//   valueStyle,
//   last = false,
// }: {
//   label: string;
//   value: string;
//   valueStyle?: any;
//   last?: boolean;
// }) {
//   return (
//     <View
//       style={[
//         styles.infoRow,
//         last &&
//           styles.infoRowLast,
//       ]}
//     >
//       <Text
//         style={styles.infoLabel}
//       >
//         {label}
//       </Text>

//       <Text
//         style={[
//           styles.infoValue,
//           valueStyle,
//         ]}
//       >
//         {value}
//       </Text>
//     </View>
//   );
// }

// // =====================================================
// // STYLES
// // =====================================================

// const styles =
//   StyleSheet.create({
//     safeArea: {
//       flex: 1,
//       backgroundColor: "#F7F7F7",
//     },

//     header: {
//       height: 60,
//       backgroundColor: "#000000",
//       flexDirection: "row",
//       alignItems: "center",
//       paddingHorizontal: 16,
//     },

//     backButton: {
//       width: 40,
//       height: 40,
//       justifyContent:
//         "center",
//       alignItems:
//         "flex-start",
//     },

//     headerTitle: {
//       flex: 1,
//       color: "#FFFFFF",
//       fontSize: 20,
//       fontWeight: "700",
//       textAlign: "center",
//     },

//     headerRight: {
//       width: 40,
//     },

//     scrollContent: {
//       padding: 20,
//       paddingBottom: 45,
//     },

//     center: {
//       flex: 1,
//       justifyContent:
//         "center",
//       alignItems: "center",
//       padding: 25,
//     },

//     loadingText: {
//       marginTop: 14,
//       color: "#777777",
//       fontSize: 14,
//     },

//     scannedBadge: {
//       alignSelf: "center",
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//       backgroundColor:
//         "#E9F8EF",
//       paddingHorizontal: 15,
//       paddingVertical: 9,
//       borderRadius: 22,
//       marginBottom: 17,
//     },

//     scannedText: {
//       marginLeft: 7,
//       color: "#239B56",
//       fontSize: 13,
//       fontWeight: "600",
//     },

//     imageCard: {
//       height: 270,
//       backgroundColor:
//         "#FFFFFF",
//       borderRadius: 22,
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//       overflow: "hidden",
//       elevation: 2,
//       position:
//         "relative",
//     },

//     productImage: {
//       width: "88%",
//       height: "88%",
//     },

//     noImage: {
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//     },

//     noImageText: {
//       marginTop: 8,
//       color: "#AAAAAA",
//       fontSize: 13,
//     },

//     categoryBadge: {
//       position:
//         "absolute",
//       top: 14,
//       right: 14,
//       backgroundColor:
//         "#EFE3FF",
//       paddingHorizontal: 12,
//       paddingVertical: 7,
//       borderRadius: 16,
//     },

//     categoryText: {
//       color: "#9B4DFF",
//       fontSize: 11,
//       fontWeight: "700",
//     },

//     productCard: {
//       marginTop: 16,
//       backgroundColor:
//         "#FFFFFF",
//       borderRadius: 20,
//       padding: 20,
//       elevation: 2,
//     },

//     productName: {
//       color: "#171717",
//       fontSize: 25,
//       fontWeight: "800",
//     },

//     description: {
//       marginTop: 9,
//       color: "#777777",
//       fontSize: 14,
//       lineHeight: 21,
//     },

//     divider: {
//       height: 1,
//       backgroundColor:
//         "#EEEEEE",
//       marginVertical: 17,
//     },

//     infoRow: {
//       flexDirection:
//         "row",
//       justifyContent:
//         "space-between",
//       alignItems:
//         "center",
//       marginBottom: 14,
//     },

//     infoRowLast: {
//       marginBottom: 0,
//     },

//     infoLabel: {
//       color: "#777777",
//       fontSize: 14,
//     },

//     infoValue: {
//       color: "#222222",
//       fontSize: 15,
//       fontWeight: "700",
//     },

//     price: {
//       color: "#171717",
//       fontSize: 19,
//       fontWeight: "800",
//     },

//     qrCard: {
//       marginTop: 16,
//       backgroundColor:
//         "#FFFFFF",
//       borderRadius: 18,
//       padding: 17,
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//       elevation: 2,
//     },

//     qrIcon: {
//       width: 52,
//       height: 52,
//       borderRadius: 26,
//       backgroundColor:
//         "#EFE3FF",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//       marginRight: 14,
//     },

//     qrContent: {
//       flex: 1,
//     },

//     qrLabel: {
//       color: "#999999",
//       fontSize: 10,
//       fontWeight: "800",
//       letterSpacing: 1,
//     },

//     qrCode: {
//       marginTop: 5,
//       color: "#333333",
//       fontSize: 12,
//       lineHeight: 17,
//       fontWeight: "600",
//     },

//     rewardCard: {
//       marginTop: 16,
//       backgroundColor:
//         "#EFE3FF",
//       borderRadius: 20,
//       padding: 20,
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//     },

//     rewardIcon: {
//       width: 58,
//       height: 58,
//       borderRadius: 29,
//       backgroundColor:
//         "#FFFFFF",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//       marginRight: 15,
//     },

//     rewardContent: {
//       flex: 1,
//     },

//     rewardLabel: {
//       color: "#777777",
//       fontSize: 10,
//       fontWeight: "800",
//       letterSpacing: 1,
//     },

//     rewardAmount: {
//       marginTop: 3,
//       color: "#9B4DFF",
//       fontSize: 30,
//       fontWeight: "900",
//     },

//     rewardHint: {
//       marginTop: 4,
//       color: "#777777",
//       fontSize: 12,
//       lineHeight: 18,
//     },

//     claimedCard: {
//       marginTop: 20,
//       backgroundColor:
//         "#E9F8EF",
//       borderRadius: 18,
//       padding: 18,
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//     },

//     claimedIcon: {
//       width: 54,
//       height: 54,
//       borderRadius: 27,
//       backgroundColor:
//         "#FFFFFF",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//       marginRight: 14,
//     },

//     claimedContent: {
//       flex: 1,
//     },

//     claimedTitle: {
//       color: "#239B56",
//       fontSize: 17,
//       fontWeight: "800",
//     },

//     claimedText: {
//       marginTop: 4,
//       color: "#555555",
//       fontSize: 13,
//       lineHeight: 19,
//     },

//     claimedDate: {
//       marginTop: 5,
//       color: "#777777",
//       fontSize: 11,
//     },

//     claimButton: {
//       marginTop: 24,
//       height: 57,
//       borderRadius: 29,
//       backgroundColor:
//         "#9B4DFF",
//       flexDirection:
//         "row",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//       elevation: 3,
//     },

//     claimButtonDisabled: {
//       opacity: 0.6,
//     },

//     claimButtonText: {
//       marginLeft: 9,
//       color: "#FFFFFF",
//       fontSize: 16,
//       fontWeight: "800",
//     },

//     secureText: {
//       marginTop: 10,
//       textAlign: "center",
//       color: "#999999",
//       fontSize: 12,
//       lineHeight: 18,
//     },

//     scanAgainButton: {
//       marginTop: 17,
//       height: 54,
//       borderRadius: 27,
//       borderWidth: 1,
//       borderColor:
//         "#9B4DFF",
//       flexDirection:
//         "row",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//     },

//     scanAgainText: {
//       marginLeft: 8,
//       color: "#9B4DFF",
//       fontSize: 14,
//       fontWeight: "800",
//     },

//     errorIcon: {
//       width: 80,
//       height: 80,
//       borderRadius: 40,
//       backgroundColor:
//         "#FDECEC",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//     },

//     errorTitle: {
//       marginTop: 15,
//       color: "#222222",
//       fontSize: 20,
//       fontWeight: "800",
//     },

//     errorText: {
//       marginTop: 7,
//       color: "#777777",
//       fontSize: 14,
//       textAlign: "center",
//       lineHeight: 20,
//     },

//     goBackButton: {
//       marginTop: 22,
//       backgroundColor:
//         "#9B4DFF",
//       paddingHorizontal: 32,
//       paddingVertical: 13,
//       borderRadius: 26,
//     },

//     goBackText: {
//       color: "#FFFFFF",
//       fontSize: 15,
//       fontWeight: "700",
//     },
//   });
import React, { useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import ScreenHeader from "@/components/common/ScreenHeader";
import { API_BASE_URL } from "@/constants/api";
import { getToken } from "@/utils/storage";

// =====================================================
// TYPES
// =====================================================

type QRDetails = {
  id: number;
  product_id: number;
  qr_code: string;
  unit_number: number;
  is_claimed: boolean;
  claimed_by: number | null;
  claimed_at: string | null;
  created_at: string;

  category_id?: number;
  category_name?: string;

  product_name?: string;
  product_description?: string;
  product_price?: string | number;
  product_image?: string | null;
  product_stock?: string | number;

  reward_amount?: string | number;

  product?: {
    id?: number;
    name?: string;
    description?: string;
    price?: string | number;
    image?: string | null;
    category_name?: string;
  };

  reward?: {
    amount?: string | number;
  };
};

type ClaimResponse = {
  success: boolean;
  message: string;

  data?: {
    success?: boolean;

    product?: {
      id?: number;
      name?: string;
      price?: string | number;
    };

    reward?: string | number;

    reward_amount?: string | number;

    wallet?: {
      id?: number;
      user_id?: number;
      balance?: string | number;
    };

    transaction?: {
      id?: number;
      amount?: string | number;
      transaction_type?: string;
      description?: string;
      created_at?: string;
      balance_after?: string | number | null;
    };

    previous_balance?: string | number;
    remaining_balance?: string | number;

    qr?: {
      id?: number;
      product_id?: number;
      qr_code?: string;
      reward_amount?: string | number;
      is_claimed?: boolean;
      claimed_by?: number;
      claimed_at?: string;
      unit_number?: number;
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
  value: string | number | null | undefined
): number => {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return 0;
  }

  return numberValue;
};

const formatMoney = (
  value: string | number | null | undefined
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

  const trimmedImage = String(image).trim();

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

export default function QRProductDetailsScreen() {
  const params =
    useLocalSearchParams<{
      productId?: string | string[];
      qrCode?: string | string[];
      productName?: string | string[];
      productDescription?: string | string[];
      productPrice?: string | string[];
      productImage?: string | string[];
      productStock?: string | string[];
      rewardAmount?: string | string[];
      unitNumber?: string | string[];
      categoryName?: string | string[];
      isClaimed?: string | string[];
    }>();

  const productId = getParam(params.productId);

  const qrCode = getParam(params.qrCode);

  const initialProductName =
    getParam(params.productName);

  const initialDescription =
    getParam(params.productDescription);

  const initialPrice =
    getParam(params.productPrice);

  const initialImage =
    getParam(params.productImage);

  const initialStock =
    getParam(params.productStock);

  const initialReward =
    getParam(params.rewardAmount);

  const initialUnit =
    getParam(params.unitNumber);

  const initialCategory =
    getParam(params.categoryName);

  const initialClaimed =
    getParam(params.isClaimed);

  // ===================================================
  // STATE
  // ===================================================

  const [loading, setLoading] =
    useState(true);

  const [claiming, setClaiming] =
    useState(false);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [qrData, setQrData] =
    useState<QRDetails | null>(null);

  const [imageError, setImageError] =
    useState(false);

  // ===================================================
  // FETCH QR DETAILS
  // ===================================================

  useEffect(() => {
    loadQRDetails();
  }, [qrCode]);

  const loadQRDetails = async () => {
    if (!qrCode) {
      Alert.alert(
        "Invalid QR",
        "QR code is missing.",
        [
          {
            text: "Go Back",
            onPress: () => router.back(),
          },
        ]
      );

      return;
    }

    try {
      setLoading(true);

      console.log(
        "================================"
      );
      console.log(
        "QR PRODUCT DETAILS"
      );
      console.log(
        "QR CODE:",
        qrCode
      );
      console.log(
        "================================"
      );

      const url =
        `${API_BASE_URL}/api/product-qr/scan/` +
        encodeURIComponent(qrCode);

      console.log(
        "QR DETAILS URL:",
        url
      );

      const response =
        await fetch(url);

      const result =
        await response.json();

      console.log(
        "QR DETAILS STATUS:",
        response.status
      );

      console.log(
        "QR DETAILS RESPONSE:",
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
            "Unable to load QR details."
        );
      }

      const data =
        result?.data as QRDetails;

      if (!data) {
        throw new Error(
          "QR product details not found."
        );
      }

      setQrData(data);

      setImageError(false);

      console.log(
        "================================"
      );
      console.log(
        "QR DATA LOADED"
      );
      console.log(
        "PRODUCT ID:",
        data.product_id
      );
      console.log(
        "PRODUCT NAME:",
        data.product_name
      );
      console.log(
        "REWARD:",
        data.reward_amount
      );
      console.log(
        "IS CLAIMED:",
        data.is_claimed
      );
      console.log(
        "UNIT:",
        data.unit_number
      );
      console.log(
        "IMAGE:",
        data.product_image
      );
      console.log(
        "================================"
      );

      if (data.is_claimed) {
        Alert.alert(
          "QR Already Claimed",
          "This product QR code has already been claimed.",
          [
            {
              text: "Back to Scanner",
              onPress: () =>
                router.replace(
                  "/scanner"
                ),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error(
        "QR PRODUCT DETAILS ERROR:",
        error
      );

      Alert.alert(
        "Unable to Load Product",
        error?.message ||
          "Something went wrong while loading the product.",
        [
          {
            text: "Back",
            onPress: () =>
              router.back(),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // PRODUCT DATA
  // ===================================================

  const productName =
    qrData?.product_name ||
    qrData?.product?.name ||
    initialProductName ||
    "VedAmrut Product";

  const description =
    qrData?.product_description ||
    qrData?.product?.description ||
    initialDescription ||
    "Natural VedAmrut wellness product.";

  const price =
    qrData?.product_price ??
    qrData?.product?.price ??
    initialPrice ??
    "0";

  const image =
    qrData?.product_image ||
    qrData?.product?.image ||
    initialImage ||
    null;

  const stock =
    qrData?.product_stock ??
    initialStock ??
    "0";

  const reward =
    qrData?.reward_amount ??
    qrData?.reward?.amount ??
    initialReward ??
    "0";

  const unitNumber =
    qrData?.unit_number ??
    initialUnit ??
    "-";

  const category =
    qrData?.category_name ||
    qrData?.product?.category_name ||
    initialCategory ||
    "Wellness";

  const claimed =
    qrData?.is_claimed ??
    (initialClaimed === "true");

  const rewardAmount =
    toNumber(reward);

  const productPrice =
    toNumber(price);

  const productImageUrl =
    useMemo(
      () =>
        getProductImageUrl(
          image
        ),
      [image]
    );

  // ===================================================
  // CLAIM QR REWARD
  // ===================================================

  const handleClaimQR = async () => {
    if (claiming) {
      return;
    }

    if (!qrCode) {
      Alert.alert(
        "Invalid QR",
        "QR code is missing."
      );

      return;
    }

    if (claimed) {
      Alert.alert(
        "Already Claimed",
        "This QR code has already been claimed."
      );

      return;
    }

    try {
      const token =
        await getToken();

      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login before claiming your reward.",
          [
            {
              text: "OK",
              onPress: () =>
                router.replace(
                  "/login"
                ),
            },
          ]
        );

        return;
      }

      setClaiming(true);

      console.log(
        "================================"
      );
      console.log(
        "CLAIM PRODUCT QR"
      );
      console.log(
        "QR CODE:",
        qrCode
      );
      console.log(
        "REWARD:",
        rewardAmount
      );
      console.log(
        "PRODUCT:",
        productName
      );
      console.log(
        "================================"
      );

      const url =
        `${API_BASE_URL}/api/product-qr/claim`;

      const response =
        await fetch(url, {
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
        });

      const result =
        (await response.json()) as ClaimResponse;

      console.log(
        "CLAIM STATUS:",
        response.status
      );

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
            "Unable to claim QR reward."
        );
      }

      const claimData =
        result?.data;

      const claimedReward =
        toNumber(
          claimData?.reward_amount ??
            claimData?.reward ??
            rewardAmount
        );

      const remainingBalance =
        toNumber(
          claimData?.remaining_balance ??
            claimData?.wallet?.balance ??
            0
        );

      console.log(
        "================================"
      );
      console.log(
        "QR CLAIM SUCCESS"
      );
      console.log(
        "PRODUCT:",
        productName
      );
      console.log(
        "REWARD:",
        claimedReward
      );
      console.log(
        "WALLET BALANCE:",
        remainingBalance
      );
      console.log(
        "================================"
      );

      // =================================================
      // GO TO SUCCESS SCREEN AFTER CLAIM
      // =================================================

      router.replace({
        pathname:
          "/(home)/qr-payment-success",

        params: {
          productId:
            String(
              qrData?.product_id ||
                productId
            ),

          qrCode:
            String(qrCode),

          productName:
            String(productName),

          productPrice:
            String(productPrice),

          reward:
            String(claimedReward),

          rewardClaimed:
            "true",

          remainingBalance:
            String(
              remainingBalance
            ),

          categoryName:
            String(category),

          productImage:
            String(image || ""),
        },
      });
    } catch (error: any) {
      console.error(
        "QR CLAIM ERROR:",
        error
      );

      Alert.alert(
        "Claim Failed",
        error?.message ||
          "Unable to claim the QR reward. Please try again."
      );
    } finally {
      setClaiming(false);
    }
  };

  // ===================================================
  // CONTINUE TO PAYMENT WITHOUT CLAIMING
  // ===================================================

  const handleContinueToPayment =
    async () => {
      if (paymentLoading) {
        return;
      }

      if (!qrCode) {
        Alert.alert(
          "Invalid QR",
          "QR code is missing."
        );

        return;
      }

      if (claimed) {
        Alert.alert(
          "QR Already Claimed",
          "This QR code has already been claimed."
        );

        return;
      }

      try {
        setPaymentLoading(true);

        console.log(
          "================================"
        );
        console.log(
          "CONTINUE TO QR PAYMENT"
        );
        console.log(
          "QR CODE:",
          qrCode
        );
        console.log(
          "PRODUCT ID:",
          qrData?.product_id ||
            productId
        );
        console.log(
          "PRODUCT:",
          productName
        );
        console.log(
          "PRICE:",
          productPrice
        );
        console.log(
          "REWARD NOT CLAIMED"
        );
        console.log(
          "================================"
        );

        /*
         * IMPORTANT:
         *
         * We are NOT calling the claim API here.
         *
         * The reward remains unclaimed.
         *
         * We only move the user to the
         * QR payment screen.
         */

        router.push({
          pathname:
            "/(home)/qr-payment",

          params: {
            productId:
              String(
                qrData?.product_id ||
                  productId
              ),

            qrCode:
              String(qrCode),

            productName:
              String(productName),

            productDescription:
              String(description),

            productPrice:
              String(productPrice),

            productImage:
              String(image || ""),

            categoryName:
              String(category),

            unitNumber:
              String(unitNumber),

            reward:
              String(rewardAmount),

            rewardClaimed:
              "false",
          },
        });
      } catch (error: any) {
        console.error(
          "QR PAYMENT NAVIGATION ERROR:",
          error
        );

        Alert.alert(
          "Unable to Continue",
          "Unable to open the QR payment screen."
        );
      } finally {
        setPaymentLoading(false);
      }
    };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.safeArea}
      >
        <ScreenHeader
          title="Product Details"
          titleStyle={
            styles.headerTitle
          }
          iconColor="#FFFFFF"
        />

        <View
          style={
            styles.loadingContainer
          }
        >
          <View
            style={
              styles.loadingCircle
            }
          >
            <ActivityIndicator
              size="large"
              color="#9B4DFF"
            />
          </View>

          <Text
            style={
              styles.loadingTitle
            }
          >
            Loading Product...
          </Text>

          <Text
            style={
              styles.loadingText
            }
          >
            Please wait while we fetch
            the QR product details.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ===================================================
  // SCREEN
  // ===================================================

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ScreenHeader
        title="Product Details"
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
            PRODUCT IMAGE
        ================================================= */}

        <View
          style={styles.imageCard}
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
              onError={(event) => {
                console.log(
                  "PRODUCT IMAGE ERROR:",
                  event.nativeEvent
                );

                console.log(
                  "IMAGE URL:",
                  productImageUrl
                );

                setImageError(true);
              }}
            />
          ) : (
            <View
              style={
                styles.imagePlaceholder
              }
            >
              <Ionicons
                name="cube-outline"
                size={75}
                color="#9B4DFF"
              />

              <Text
                style={
                  styles.imagePlaceholderText
                }
              >
                Product Image
              </Text>
            </View>
          )}

          {/* CATEGORY */}

          <View
            style={
              styles.categoryBadge
            }
          >
            <Ionicons
              name="pricetag-outline"
              size={14}
              color="#9B4DFF"
            />

            <Text
              style={
                styles.categoryText
              }
            >
              {category}
            </Text>
          </View>
        </View>

        {/* =================================================
            PRODUCT TITLE
        ================================================= */}

        <View
          style={styles.titleSection}
        >
          <Text
            style={styles.productName}
          >
            {productName}
          </Text>

          <Text
            style={
              styles.productDescription
            }
          >
            {description}
          </Text>
        </View>

        {/* =================================================
            PRICE
        ================================================= */}

        <View
          style={styles.priceCard}
        >
          <View>
            <Text
              style={
                styles.priceLabel
              }
            >
              PRODUCT PRICE
            </Text>

            <Text
              style={styles.price}
            >
              {formatMoney(price)}
            </Text>
          </View>

          <View
            style={styles.unitBox}
          >
            <Text
              style={styles.unitLabel}
            >
              UNIT
            </Text>

            <Text
              style={styles.unitValue}
            >
              #{unitNumber}
            </Text>
          </View>
        </View>

        {/* =================================================
            REWARD
        ================================================= */}

        <View
          style={styles.rewardCard}
        >
          <View
            style={styles.rewardIcon}
          >
            <Ionicons
              name="gift-outline"
              size={27}
              color="#9B4DFF"
            />
          </View>

          <View
            style={styles.rewardInfo}
          >
            <Text
              style={styles.rewardLabel}
            >
              YOUR QR REWARD
            </Text>

            <Text
              style={styles.rewardAmount}
            >
              {formatMoney(
                rewardAmount
              )}
            </Text>
          </View>

          <Ionicons
            name="checkmark-circle"
            size={27}
            color="#27AE60"
          />
        </View>

        {/* =================================================
            PRODUCT DETAILS
        ================================================= */}

        <View
          style={styles.detailsCard}
        >
          <Text
            style={styles.sectionTitle}
          >
            Product Information
          </Text>

          <DetailRow
            icon="cube-outline"
            label="Product"
            value={productName}
          />

          <View
            style={styles.divider}
          />

          <DetailRow
            icon="pricetag-outline"
            label="Category"
            value={category}
          />

          <View
            style={styles.divider}
          />

          <DetailRow
            icon="barcode-outline"
            label="Unit Number"
            value={`#${unitNumber}`}
          />

          <View
            style={styles.divider}
          />

          <DetailRow
            icon="layers-outline"
            label="Available Stock"
            value={String(stock)}
          />

          <View
            style={styles.divider}
          />

          <DetailRow
            icon="gift-outline"
            label="QR Reward"
            value={formatMoney(
              rewardAmount
            )}
            valueStyle={
              styles.rewardValue
            }
          />
        </View>

        {/* =================================================
            QR STATUS
        ================================================= */}

        <View
          style={styles.statusCard}
        >
          <View
            style={styles.statusIcon}
          >
            <Ionicons
              name={
                claimed
                  ? "checkmark-circle"
                  : "qr-code-outline"
              }
              size={24}
              color={
                claimed
                  ? "#27AE60"
                  : "#9B4DFF"
              }
            />
          </View>

          <View
            style={styles.statusInfo}
          >
            <Text
              style={styles.statusTitle}
            >
              {claimed
                ? "QR Already Claimed"
                : "QR Ready"}
            </Text>

            <Text
              style={styles.statusText}
            >
              {claimed
                ? "This QR reward has already been credited."
                : "You can claim the reward or continue directly to QR payment."}
            </Text>
          </View>
        </View>

        {/* =================================================
            QR ACTIONS
        ================================================= */}

        {!claimed && (
          <>
            {/* CLAIM REWARD */}

            <TouchableOpacity
              style={[
                styles.claimButton,
                claiming &&
                  styles.claimButtonDisabled,
              ]}
              onPress={
                handleClaimQR
              }
              disabled={
                claiming ||
                paymentLoading
              }
              activeOpacity={0.85}
            >
              {claiming ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.claimButtonText
                    }
                  >
                    CLAIMING REWARD...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="gift-outline"
                    size={22}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.claimButtonText
                    }
                  >
                    CLAIM QR REWARD
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* CONTINUE TO PAYMENT */}

            <TouchableOpacity
              style={[
                styles.paymentButton,
                paymentLoading &&
                  styles.paymentButtonDisabled,
              ]}
              onPress={
                handleContinueToPayment
              }
              disabled={
                paymentLoading ||
                claiming
              }
              activeOpacity={0.85}
            >
              {paymentLoading ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="#9B4DFF"
                  />

                  <Text
                    style={
                      styles.paymentButtonText
                    }
                  >
                    OPENING PAYMENT...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="card-outline"
                    size={21}
                    color="#9B4DFF"
                  />

                  <Text
                    style={
                      styles.paymentButtonText
                    }
                  >
                    CONTINUE TO QR PAYMENT
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* INFO */}

            <Text
              style={
                styles.skipRewardText
              }
            >
              Don't want to claim the
              reward? You can continue
              directly to payment.
            </Text>
          </>
        )}

        {/* =================================================
            SCAN AGAIN
        ================================================= */}

        <TouchableOpacity
          style={
            styles.scanAgainButton
          }
          onPress={() =>
            router.replace(
              "/scanner"
            )
          }
          activeOpacity={0.85}
        >
          <Ionicons
            name="qr-code-outline"
            size={20}
            color="#9B4DFF"
          />

          <Text
            style={
              styles.scanAgainText
            }
          >
            SCAN ANOTHER PRODUCT
          </Text>
        </TouchableOpacity>

        {/* =================================================
            QR CODE
        ================================================= */}

        <View
          style={styles.qrInfoCard}
        >
          <Ionicons
            name="qr-code"
            size={22}
            color="#777777"
          />

          <View
            style={styles.qrInfoText}
          >
            <Text
              style={styles.qrInfoLabel}
            >
              QR CODE
            </Text>

            <Text
              style={styles.qrCode}
              numberOfLines={2}
            >
              {qrCode}
            </Text>
          </View>
        </View>

        <Text
          style={styles.bottomText}
        >
          Thank you for choosing
          VedAmrut
        </Text>
      </ScrollView>
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
    <View
      style={styles.detailRow}
    >
      <View
        style={styles.detailLeft}
      >
        <View
          style={styles.detailIcon}
        >
          <Ionicons
            name={icon}
            size={19}
            color="#9B4DFF"
          />
        </View>

        <Text
          style={styles.detailLabel}
        >
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

  headerTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginRight: 40,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 35,
  },

  // ===================================================
  // LOADING
  // ===================================================

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  loadingCircle: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "#EFE3FF",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingTitle: {
    marginTop: 18,
    color: "#222222",
    fontSize: 19,
    fontWeight: "800",
  },

  loadingText: {
    marginTop: 8,
    color: "#888888",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },

  // ===================================================
  // IMAGE
  // ===================================================

  imageCard: {
    height: 260,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  imagePlaceholderText: {
    marginTop: 10,
    color: "#999999",
    fontSize: 13,
  },

  categoryBadge: {
    position: "absolute",
    left: 15,
    top: 15,
    backgroundColor: "#EFE3FF",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
  },

  categoryText: {
    marginLeft: 5,
    color: "#9B4DFF",
    fontSize: 12,
    fontWeight: "800",
  },

  // ===================================================
  // TITLE
  // ===================================================

  titleSection: {
    marginTop: 18,
  },

  productName: {
    color: "#171717",
    fontSize: 26,
    fontWeight: "900",
  },

  productDescription: {
    marginTop: 7,
    color: "#777777",
    fontSize: 14,
    lineHeight: 21,
  },

  // ===================================================
  // PRICE
  // ===================================================

  priceCard: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  priceLabel: {
    color: "#999999",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  price: {
    marginTop: 4,
    color: "#171717",
    fontSize: 28,
    fontWeight: "900",
  },

  unitBox: {
    backgroundColor: "#EFE3FF",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
  },

  unitLabel: {
    color: "#888888",
    fontSize: 9,
    fontWeight: "800",
  },

  unitValue: {
    marginTop: 2,
    color: "#9B4DFF",
    fontSize: 16,
    fontWeight: "900",
  },

  // ===================================================
  // REWARD
  // ===================================================

  rewardCard: {
    marginTop: 14,
    backgroundColor: "#EFE3FF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  rewardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  rewardInfo: {
    flex: 1,
    marginLeft: 13,
  },

  rewardLabel: {
    color: "#777777",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  rewardAmount: {
    marginTop: 2,
    color: "#9B4DFF",
    fontSize: 24,
    fontWeight: "900",
  },

  // ===================================================
  // DETAILS
  // ===================================================

  detailsCard: {
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    elevation: 2,
  },

  sectionTitle: {
    marginBottom: 16,
    color: "#222222",
    fontSize: 17,
    fontWeight: "800",
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  detailLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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

  rewardValue: {
    color: "#9B4DFF",
    fontSize: 16,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 13,
  },

  // ===================================================
  // STATUS
  // ===================================================

  statusCard: {
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EFE3FF",
    justifyContent: "center",
    alignItems: "center",
  },

  statusInfo: {
    flex: 1,
    marginLeft: 12,
  },

  statusTitle: {
    color: "#222222",
    fontSize: 15,
    fontWeight: "800",
  },

  statusText: {
    marginTop: 4,
    color: "#888888",
    fontSize: 12,
    lineHeight: 18,
  },

  // ===================================================
  // CLAIM BUTTON
  // ===================================================

  claimButton: {
    marginTop: 18,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#9B4DFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  claimButtonDisabled: {
    opacity: 0.7,
  },

  claimButtonText: {
    marginLeft: 9,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  // ===================================================
  // PAYMENT BUTTON
  // ===================================================

  paymentButton: {
    marginTop: 12,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: "#9B4DFF",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  paymentButtonDisabled: {
    opacity: 0.6,
  },

  paymentButtonText: {
    marginLeft: 9,
    color: "#9B4DFF",
    fontSize: 14,
    fontWeight: "900",
  },

  skipRewardText: {
    marginTop: 9,
    paddingHorizontal: 15,
    textAlign: "center",
    color: "#999999",
    fontSize: 11,
    lineHeight: 16,
  },

  // ===================================================
  // SCAN AGAIN
  // ===================================================

  scanAgainButton: {
    marginTop: 12,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.2,
    borderColor: "#9B4DFF",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  scanAgainText: {
    marginLeft: 8,
    color: "#9B4DFF",
    fontSize: 14,
    fontWeight: "800",
  },

  // ===================================================
  // QR INFO
  // ===================================================

  qrInfoCard: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  qrInfoText: {
    flex: 1,
    marginLeft: 12,
  },

  qrInfoLabel: {
    color: "#999999",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  qrCode: {
    marginTop: 4,
    color: "#555555",
    fontSize: 11,
    lineHeight: 16,
  },

  bottomText: {
    marginTop: 18,
    textAlign: "center",
    color: "#AAAAAA",
    fontSize: 12,
  },
});