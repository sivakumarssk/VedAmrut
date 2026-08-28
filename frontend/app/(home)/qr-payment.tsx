// import React, {
//   useEffect,
//   useMemo,
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

// import { Ionicons } from "@expo/vector-icons";
// import {
//   router,
//   useLocalSearchParams,
// } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";

// import ScreenHeader from "@/components/common/ScreenHeader";
// import {
//   API_BASE_URL,
// } from "@/constants/api";
// import {
//   getToken,
// } from "@/utils/storage";

// // =====================================================
// // TYPES
// // =====================================================

// type PaymentResponse = {
//   success: boolean;
//   message?: string;

//   data?: {
//     success?: boolean;

//     transaction?: {
//       id?: number;
//       amount?: string | number;
//       transaction_type?: string;
//       description?: string;
//       created_at?: string;
//       balance_after?: string | number | null;
//     };

//     wallet?: {
//       id?: number;
//       user_id?: number;
//       balance?: string | number;
//     };

//     previous_balance?: string | number;

//     remaining_balance?: string | number;

//     balance?: string | number;

//     payment?: {
//       id?: number;
//       amount?: string | number;
//       status?: string;
//     };

//     order?: {
//       id?: number;
//       status?: string;
//     };

//     qr?: {
//       id?: number;
//       qr_code?: string;
//       is_claimed?: boolean;
//       reward_amount?: string | number;
//     };
//   };
// };

// // =====================================================
// // HELPERS
// // =====================================================

// const getParam = (
//   value?: string | string[]
// ): string => {
//   if (Array.isArray(value)) {
//     return value[0] || "";
//   }

//   return value || "";
// };

// const toNumber = (
//   value:
//     | string
//     | number
//     | null
//     | undefined
// ): number => {
//   const numberValue = Number(value);

//   if (Number.isNaN(numberValue)) {
//     return 0;
//   }

//   return numberValue;
// };

// const formatMoney = (
//   value:
//     | string
//     | number
//     | null
//     | undefined
// ): string => {
//   return `₹${toNumber(value).toFixed(2)}`;
// };

// // =====================================================
// // IMAGE URL
// // =====================================================

// const getProductImageUrl = (
//   image?: string | null
// ): string | null => {
//   if (!image) {
//     return null;
//   }

//   const trimmedImage =
//     String(image).trim();

//   if (!trimmedImage) {
//     return null;
//   }

//   if (
//     trimmedImage.startsWith("http://") ||
//     trimmedImage.startsWith("https://")
//   ) {
//     return trimmedImage;
//   }

//   return `${API_BASE_URL}/uploads/${encodeURIComponent(
//     trimmedImage
//   )}`;
// };

// // =====================================================
// // SCREEN
// // =====================================================

// export default function QRPaymentScreen() {
//   const params =
//     useLocalSearchParams<{
//       productId?: string | string[];
//       qrCode?: string | string[];
//       productName?: string | string[];
//       productDescription?: string | string[];
//       productPrice?: string | string[];
//       productImage?: string | string[];
//       categoryName?: string | string[];
//       unitNumber?: string | string[];
//       reward?: string | string[];
//       rewardClaimed?: string | string[];
//     }>();

//   // ===================================================
//   // PARAMS
//   // ===================================================

//   const productId =
//     getParam(params.productId);

//   const qrCode =
//     getParam(params.qrCode);

//   const productName =
//     getParam(params.productName) ||
//     "VedAmrut Product";

//   const productDescription =
//     getParam(
//       params.productDescription
//     ) ||
//     "Natural VedAmrut wellness product.";

//   const productPrice =
//     toNumber(
//       getParam(params.productPrice)
//     );

//   const productImage =
//     getParam(params.productImage);

//   const categoryName =
//     getParam(params.categoryName) ||
//     "Wellness";

//   const unitNumber =
//     getParam(params.unitNumber) ||
//     "-";

//   const reward =
//     toNumber(
//       getParam(params.reward)
//     );

//   /*
//    * IMPORTANT:
//    *
//    * When the user comes here from
//    * "CONTINUE TO QR PAYMENT",
//    *
//    * rewardClaimed = false
//    *
//    * We DO NOT call the claim API.
//    */
//   const rewardClaimed =
//     getParam(
//       params.rewardClaimed
//     ) === "true";

//   // ===================================================
//   // STATE
//   // ===================================================

//   const [
//     paymentLoading,
//     setPaymentLoading,
//   ] = useState(false);

//   const [
//     walletBalance,
//     setWalletBalance,
//   ] = useState<number | null>(null);

//   const [
//     walletLoading,
//     setWalletLoading,
//   ] = useState(true);

//   const [
//     imageError,
//     setImageError,
//   ] = useState(false);

//   // ===================================================
//   // IMAGE
//   // ===================================================

//   const productImageUrl =
//     useMemo(
//       () =>
//         getProductImageUrl(
//           productImage
//         ),
//       [productImage]
//     );

//   // ===================================================
//   // LOAD WALLET
//   // ===================================================

//   useEffect(() => {
//     loadWallet();
//   }, []);

//   const loadWallet = async () => {
//     try {
//       const token =
//         await getToken();

//       if (!token) {
//         setWalletLoading(false);
//         return;
//       }

//       console.log(
//         "================================"
//       );
//       console.log(
//         "LOADING WALLET FOR QR PAYMENT"
//       );
//       console.log(
//         "================================"
//       );

//       /*
//        * Existing VedAmrut wallet endpoint.
//        */
//       const response =
//         await fetch(
//           `${API_BASE_URL}/api/wallet`,
//           {
//             method: "GET",

//             headers: {
//               Authorization:
//                 `Bearer ${token}`,
//               "Content-Type":
//                 "application/json",
//             },
//           }
//         );

//       const result =
//         await response.json();

//       console.log(
//         "WALLET STATUS:",
//         response.status
//       );

//       console.log(
//         "WALLET RESPONSE:",
//         JSON.stringify(
//           result,
//           null,
//           2
//         )
//       );

//       if (!response.ok) {
//         throw new Error(
//           result?.message ||
//             "Unable to load wallet."
//         );
//       }

//       const balance =
//         toNumber(
//           result?.data?.balance ??
//             result?.data?.wallet?.balance ??
//             result?.balance ??
//             result?.wallet?.balance ??
//             0
//         );

//       setWalletBalance(balance);
//     } catch (error) {
//       console.error(
//         "WALLET LOAD ERROR:",
//         error
//       );
//     } finally {
//       setWalletLoading(false);
//     }
//   };

//   // ===================================================
//   // PAYMENT
//   // ===================================================

//   const handlePayment =
//     async () => {
//       if (paymentLoading) {
//         return;
//       }

//       // -----------------------------------------------
//       // VALIDATION
//       // -----------------------------------------------

//       if (!productId) {
//         Alert.alert(
//           "Payment Error",
//           "Product information is missing."
//         );

//         return;
//       }

//       if (!qrCode) {
//         Alert.alert(
//           "Payment Error",
//           "QR code is missing."
//         );

//         return;
//       }

//       if (productPrice <= 0) {
//         Alert.alert(
//           "Payment Error",
//           "Invalid product price."
//         );

//         return;
//       }

//       // -----------------------------------------------
//       // LOGIN
//       // -----------------------------------------------

//       const token =
//         await getToken();

//       if (!token) {
//         Alert.alert(
//           "Login Required",
//           "Please login to make the payment.",
//           [
//             {
//               text: "Login",
//               onPress: () =>
//                 router.replace(
//                   "/login"
//                 ),
//             },
//             {
//               text: "Cancel",
//               style: "cancel",
//             },
//           ]
//         );

//         return;
//       }

//       // -----------------------------------------------
//       // CHECK WALLET BALANCE
//       // -----------------------------------------------

//       if (
//         walletBalance !== null &&
//         walletBalance < productPrice
//       ) {
//         Alert.alert(
//           "Insufficient Wallet Balance",
//           `Your wallet balance is ${formatMoney(
//             walletBalance
//           )}.\n\nYou need ${formatMoney(
//             productPrice
//           )} to complete this payment.`,
//           [
//             {
//               text: "OK",
//             },
//           ]
//         );

//         return;
//       }

//       try {
//         setPaymentLoading(true);

//         console.log(
//           "================================"
//         );
//         console.log(
//           "QR PAYMENT STARTED"
//         );
//         console.log(
//           "PRODUCT ID:",
//           productId
//         );
//         console.log(
//           "PRODUCT:",
//           productName
//         );
//         console.log(
//           "QR CODE:",
//           qrCode
//         );
//         console.log(
//           "PRODUCT PRICE:",
//           productPrice
//         );
//         console.log(
//           "REWARD:",
//           reward
//         );
//         console.log(
//           "REWARD CLAIMED:",
//           rewardClaimed
//         );
//         console.log(
//           "PAYMENT AMOUNT:",
//           productPrice
//         );
//         console.log(
//           "================================"
//         );

//         /*
//          * IMPORTANT:
//          *
//          * The user selected:
//          *
//          * CONTINUE TO QR PAYMENT
//          *
//          * Therefore we DO NOT call:
//          *
//          * /api/product-qr/claim
//          *
//          * The reward remains unclaimed.
//          *
//          * We debit only the product price.
//          */

//         const paymentUrl =
//           `${API_BASE_URL}/api/wallet/pay/pay-qr`;

//         const response =
//           await fetch(
//             paymentUrl,
//             {
//               method: "POST",

//               headers: {
//                 "Content-Type":
//                   "application/json",

//                 Authorization:
//                   `Bearer ${token}`,
//               },

//               body: JSON.stringify({
//                 productId:
//                   Number(productId),

//                 qrCode,

//                 amount:
//                   productPrice,

//                 productName,

//                 description:
//                   `QR payment - ${productName}`,

//                 rewardClaimed:
//                   false,
//               }),
//             }
//           );

//         const result =
//           (await response.json()) as PaymentResponse;

//         console.log(
//           "================================"
//         );
//         console.log(
//           "QR PAYMENT RESPONSE"
//         );
//         console.log(
//           "STATUS:",
//           response.status
//         );
//         console.log(
//           JSON.stringify(
//             result,
//             null,
//             2
//           )
//         );
//         console.log(
//           "================================"
//         );

//         if (
//           !response.ok ||
//           !result?.success
//         ) {
//           throw new Error(
//             result?.message ||
//               "Payment failed."
//           );
//         }

//         // ---------------------------------------------
//         // GET NEW BALANCE
//         // ---------------------------------------------

//         const paymentData =
//           result?.data;

//         const remainingBalance =
//           toNumber(
//             paymentData?.remaining_balance ??
//               paymentData?.wallet
//                 ?.balance ??
//               paymentData?.balance ??
//               paymentData?.transaction
//                 ?.balance_after ??
//               0
//           );

//         console.log(
//           "================================"
//         );
//         console.log(
//           "QR PAYMENT SUCCESS"
//         );
//         console.log(
//           "PRODUCT:",
//           productName
//         );
//         console.log(
//           "AMOUNT:",
//           productPrice
//         );
//         console.log(
//           "REWARD CLAIMED:",
//           false
//         );
//         console.log(
//           "REWARD REMAINS:",
//           reward
//         );
//         console.log(
//           "REMAINING BALANCE:",
//           remainingBalance
//         );
//         console.log(
//           "================================"
//         );

//         // ---------------------------------------------
//         // SUCCESS SCREEN
//         // ---------------------------------------------

//         router.replace({
//           pathname:
//             "/(home)/qr-payment-success",

//           params: {
//             productId:
//               String(productId),

//             qrCode:
//               String(qrCode),

//             productName:
//               String(productName),

//             productPrice:
//               String(productPrice),

//             reward:
//               String(reward),

//             /*
//              * VERY IMPORTANT
//              *
//              * User skipped reward.
//              */
//             rewardClaimed:
//               "false",

//             remainingBalance:
//               String(
//                 remainingBalance
//               ),

//             categoryName:
//               String(categoryName),

//             productImage:
//               String(
//                 productImage || ""
//               ),

//             unitNumber:
//               String(unitNumber),
//           },
//         });
//       } catch (error: any) {
//         console.error(
//           "================================"
//         );
//         console.error(
//           "QR PAYMENT ERROR"
//         );
//         console.error(
//           error
//         );
//         console.error(
//           "================================"
//         );

//         Alert.alert(
//           "Payment Failed",
//           error?.message ||
//             "Unable to complete the payment. Please try again."
//         );
//       } finally {
//         setPaymentLoading(false);
//       }
//     };

//   // ===================================================
//   // ADD MONEY
//   // ===================================================

//   const handleAddMoney =
//     () => {
//       Alert.alert(
//         "Add Money",
//         "Please add money to your wallet before making this payment."
//       );
//     };

//   // ===================================================
//   // SCREEN
//   // ===================================================

//   return (
//     <SafeAreaView
//       style={styles.safeArea}
//     >
//       <ScreenHeader
//         title="QR Payment"
//         titleStyle={
//           styles.headerTitle
//         }
//         iconColor="#FFFFFF"
//       />

//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={
//           styles.scrollContent
//         }
//         showsVerticalScrollIndicator={
//           false
//         }
//       >
//         {/* =================================================
//             PAYMENT HEADER
//         ================================================= */}

//         <View
//           style={
//             styles.paymentHeader
//           }
//         >
//           <View
//             style={
//               styles.paymentIconCircle
//             }
//           >
//             <Ionicons
//               name="qr-code-outline"
//               size={34}
//               color="#9B4DFF"
//             />
//           </View>

//           <Text
//             style={
//               styles.paymentTitle
//             }
//           >
//             Complete Your Payment
//           </Text>

//           <Text
//             style={
//               styles.paymentSubtitle
//             }
//           >
//             Pay securely using your
//             VedAmrut wallet
//           </Text>
//         </View>

//         {/* =================================================
//             PRODUCT CARD
//         ================================================= */}

//         <View
//           style={
//             styles.productCard
//           }
//         >
//           <View
//             style={
//               styles.productImageBox
//             }
//           >
//             {productImageUrl &&
//             !imageError ? (
//               <Image
//                 source={{
//                   uri: productImageUrl,
//                 }}
//                 style={
//                   styles.productImage
//                 }
//                 resizeMode="contain"
//                 onError={() => {
//                   setImageError(true);
//                 }}
//               />
//             ) : (
//               <Ionicons
//                 name="cube-outline"
//                 size={45}
//                 color="#9B4DFF"
//               />
//             )}
//           </View>

//           <View
//             style={
//               styles.productInfo
//             }
//           >
//             <Text
//               style={
//                 styles.productCategory
//               }
//             >
//               {categoryName}
//             </Text>

//             <Text
//               style={
//                 styles.productName
//               }
//               numberOfLines={2}
//             >
//               {productName}
//             </Text>

//             <Text
//               style={
//                 styles.productUnit
//               }
//             >
//               Unit #{unitNumber}
//             </Text>
//           </View>
//         </View>

//         {/* =================================================
//             AMOUNT CARD
//         ================================================= */}

//         <View
//           style={
//             styles.amountCard
//           }
//         >
//           <Text
//             style={
//               styles.amountLabel
//             }
//           >
//             PAYMENT AMOUNT
//           </Text>

//           <Text
//             style={
//               styles.amount
//             }
//           >
//             {formatMoney(
//               productPrice
//             )}
//           </Text>

//           <View
//             style={
//               styles.amountDivider
//             }
//           />

//           <View
//             style={
//               styles.amountRow
//             }
//           >
//             <Text
//               style={
//                 styles.amountRowLabel
//               }
//             >
//               Product Price
//             </Text>

//             <Text
//               style={
//                 styles.amountRowValue
//               }
//             >
//               {formatMoney(
//                 productPrice
//               )}
//             </Text>
//           </View>

//           <View
//             style={
//               styles.amountRow
//             }
//           >
//             <Text
//               style={
//                 styles.amountRowLabel
//               }
//             >
//               QR Reward
//             </Text>

//             <Text
//               style={
//                 styles.rewardNotUsed
//               }
//             >
//               {reward > 0
//                 ? "Not claimed"
//                 : "₹0.00"}
//             </Text>
//           </View>

//           <View
//             style={
//               styles.amountDivider
//             }
//           />

//           <View
//             style={
//               styles.totalRow
//             }
//           >
//             <Text
//               style={
//                 styles.totalLabel
//               }
//             >
//               Total Payable
//             </Text>

//             <Text
//               style={
//                 styles.totalAmount
//               }
//             >
//               {formatMoney(
//                 productPrice
//               )}
//             </Text>
//           </View>
//         </View>

//         {/* =================================================
//             REWARD INFORMATION
//         ================================================= */}

//         {reward > 0 && (
//           <View
//             style={
//               styles.rewardInfoCard
//             }
//           >
//             <View
//               style={
//                 styles.rewardInfoIcon
//               }
//             >
//               <Ionicons
//                 name="gift-outline"
//                 size={22}
//                 color="#9B4DFF"
//               />
//             </View>

//             <View
//               style={
//                 styles.rewardInfoContent
//               }
//             >
//               <Text
//                 style={
//                   styles.rewardInfoTitle
//                 }
//               >
//                 Reward Not Used
//               </Text>

//               <Text
//                 style={
//                   styles.rewardInfoText
//                 }
//               >
//                 Your{" "}
//                 {formatMoney(reward)}
//                 {" "}QR reward has not been
//                 claimed and remains
//                 available.
//               </Text>
//             </View>
//           </View>
//         )}

//         {/* =================================================
//             WALLET CARD
//         ================================================= */}

//         <View
//           style={
//             styles.walletCard
//           }
//         >
//           <View
//             style={
//               styles.walletIcon
//             }
//           >
//             <Ionicons
//               name="wallet-outline"
//               size={25}
//               color="#9B4DFF"
//             />
//           </View>

//           <View
//             style={
//               styles.walletInfo
//             }
//           >
//             <Text
//               style={
//                 styles.walletLabel
//               }
//             >
//               WALLET BALANCE
//             </Text>

//             {walletLoading ? (
//               <View
//                 style={
//                   styles.walletLoading
//                 }
//               >
//                 <ActivityIndicator
//                   size="small"
//                   color="#9B4DFF"
//                 />

//                 <Text
//                   style={
//                     styles.walletLoadingText
//                   }
//                 >
//                   Checking balance...
//                 </Text>
//               </View>
//             ) : (
//               <Text
//                 style={
//                   styles.walletBalance
//                 }
//               >
//                 {walletBalance !==
//                 null
//                   ? formatMoney(
//                       walletBalance
//                     )
//                   : "₹0.00"}
//               </Text>
//             )}
//           </View>

//           {walletBalance !==
//             null &&
//             walletBalance >=
//               productPrice && (
//               <View
//                 style={
//                   styles.sufficientBadge
//                 }
//               >
//                 <Ionicons
//                   name="checkmark"
//                   size={15}
//                   color="#27AE60"
//                 />

//                 <Text
//                   style={
//                     styles.sufficientText
//                   }
//                 >
//                   Available
//                 </Text>
//               </View>
//             )}
//         </View>

//         {/* =================================================
//             INSUFFICIENT BALANCE
//         ================================================= */}

//         {!walletLoading &&
//           walletBalance !==
//             null &&
//           walletBalance <
//             productPrice && (
//             <View
//               style={
//                 styles.insufficientCard
//               }
//             >
//               <View
//                 style={
//                   styles.insufficientIcon
//                 }
//               >
//                 <Ionicons
//                   name="alert-circle-outline"
//                   size={23}
//                   color="#E74C3C"
//                 />
//               </View>

//               <View
//                 style={
//                   styles.insufficientInfo
//                 }
//               >
//                 <Text
//                   style={
//                     styles.insufficientTitle
//                   }
//                 >
//                   Insufficient Balance
//                 </Text>

//                 <Text
//                   style={
//                     styles.insufficientText
//                   }
//                 >
//                   You need{" "}
//                   {formatMoney(
//                     productPrice -
//                       walletBalance
//                   )}{" "}
//                   more to complete
//                   this payment.
//                 </Text>
//               </View>
//             </View>
//           )}

//         {/* =================================================
//             PAYMENT SECURITY
//         ================================================= */}

//         <View
//           style={
//             styles.securityCard
//           }
//         >
//           <View
//             style={
//               styles.securityIcon
//             }
//           >
//             <Ionicons
//               name="shield-checkmark-outline"
//               size={23}
//               color="#27AE60"
//             />
//           </View>

//           <View
//             style={
//               styles.securityInfo
//             }
//           >
//             <Text
//               style={
//                 styles.securityTitle
//               }
//             >
//               Secure Wallet Payment
//             </Text>

//             <Text
//               style={
//                 styles.securityText
//               }
//             >
//               Your payment will be
//               securely deducted from
//               your VedAmrut wallet.
//             </Text>
//           </View>
//         </View>

//         {/* =================================================
//             PAY BUTTON
//         ================================================= */}

//         <TouchableOpacity
//           style={[
//             styles.payButton,
//             paymentLoading &&
//               styles.payButtonDisabled,
//           ]}
//           onPress={
//             handlePayment
//           }
//           disabled={
//             paymentLoading ||
//             walletLoading ||
//             (walletBalance !==
//               null &&
//               walletBalance <
//                 productPrice)
//           }
//           activeOpacity={0.85}
//         >
//           {paymentLoading ? (
//             <>
//               <ActivityIndicator
//                 size="small"
//                 color="#FFFFFF"
//               />

//               <Text
//                 style={
//                   styles.payButtonText
//                 }
//               >
//                 PROCESSING PAYMENT...
//               </Text>
//             </>
//           ) : (
//             <>
//               <Ionicons
//                 name="lock-closed-outline"
//                 size={20}
//                 color="#FFFFFF"
//               />

//               <Text
//                 style={
//                   styles.payButtonText
//                 }
//               >
//                 PAY{" "}
//                 {formatMoney(
//                   productPrice
//                 )}
//               </Text>
//             </>
//           )}
//         </TouchableOpacity>

//         {/* =================================================
//             CANCEL
//         ================================================= */}

//         <TouchableOpacity
//           style={
//             styles.cancelButton
//           }
//           onPress={() =>
//             router.back()
//           }
//           disabled={
//             paymentLoading
//           }
//           activeOpacity={0.85}
//         >
//           <Text
//             style={
//               styles.cancelButtonText
//             }
//           >
//             BACK TO PRODUCT
//           </Text>
//         </TouchableOpacity>

//         {/* =================================================
//             QR INFO
//         ================================================= */}

//         <View
//           style={
//             styles.qrCard
//           }
//         >
//           <Ionicons
//             name="qr-code-outline"
//             size={21}
//             color="#777777"
//           />

//           <View
//             style={
//               styles.qrInfo
//             }
//           >
//             <Text
//               style={
//                 styles.qrLabel
//               }
//             >
//               QR CODE
//             </Text>

//             <Text
//               style={
//                 styles.qrValue
//               }
//               numberOfLines={2}
//             >
//               {qrCode}
//             </Text>
//           </View>
//         </View>

//         {/* =================================================
//             FOOTER
//         ================================================= */}

//         <Text
//           style={
//             styles.footerText
//           }
//         >
//           Thank you for choosing
//           VedAmrut
//         </Text>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // =====================================================
// // STYLES
// // =====================================================

// const styles =
//   StyleSheet.create({
//     safeArea: {
//       flex: 1,
//       backgroundColor:
//         "#F7F7F7",
//     },

//     headerTitle: {
//       flex: 1,
//       color: "#FFFFFF",
//       fontSize: 20,
//       fontWeight: "800",
//       textAlign: "center",
//       marginRight: 40,
//     },

//     scrollView: {
//       flex: 1,
//     },

//     scrollContent: {
//       paddingHorizontal: 20,
//       paddingTop: 18,
//       paddingBottom: 40,
//     },

//     // =================================================
//     // PAYMENT HEADER
//     // =================================================

//     paymentHeader: {
//       alignItems: "center",
//       marginBottom: 18,
//     },

//     paymentIconCircle: {
//       width: 72,
//       height: 72,
//       borderRadius: 36,
//       backgroundColor:
//         "#EFE3FF",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//     },

//     paymentTitle: {
//       marginTop: 13,
//       color: "#222222",
//       fontSize: 22,
//       fontWeight: "900",
//     },

//     paymentSubtitle: {
//       marginTop: 5,
//       color: "#888888",
//       fontSize: 13,
//       textAlign: "center",
//     },

//     // =================================================
//     // PRODUCT
//     // =================================================

//     productCard: {
//       backgroundColor:
//         "#FFFFFF",
//       borderRadius: 20,
//       padding: 14,
//       flexDirection: "row",
//       alignItems: "center",
//       elevation: 2,
//     },

//     productImageBox: {
//       width: 82,
//       height: 82,
//       borderRadius: 16,
//       backgroundColor:
//         "#F5F1FA",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//       overflow: "hidden",
//     },

//     productImage: {
//       width: "100%",
//       height: "100%",
//     },

//     productInfo: {
//       flex: 1,
//       marginLeft: 14,
//     },

//     productCategory: {
//       color: "#9B4DFF",
//       fontSize: 10,
//       fontWeight: "800",
//       textTransform:
//         "uppercase",
//       letterSpacing: 0.7,
//     },

//     productName: {
//       marginTop: 4,
//       color: "#222222",
//       fontSize: 18,
//       fontWeight: "900",
//     },

//     productUnit: {
//       marginTop: 5,
//       color: "#888888",
//       fontSize: 12,
//     },

//     // =================================================
//     // AMOUNT
//     // =================================================

//     amountCard: {
//       marginTop: 14,
//       backgroundColor:
//         "#FFFFFF",
//       borderRadius: 20,
//       padding: 19,
//       elevation: 2,
//     },

//     amountLabel: {
//       color: "#999999",
//       fontSize: 10,
//       fontWeight: "800",
//       letterSpacing: 1,
//       textAlign: "center",
//     },

//     amount: {
//       marginTop: 6,
//       color: "#9B4DFF",
//       fontSize: 34,
//       fontWeight: "900",
//       textAlign: "center",
//     },

//     amountDivider: {
//       height: 1,
//       backgroundColor:
//         "#EEEEEE",
//       marginVertical: 15,
//     },

//     amountRow: {
//       flexDirection:
//         "row",
//       justifyContent:
//         "space-between",
//       alignItems:
//         "center",
//       marginVertical: 5,
//     },

//     amountRowLabel: {
//       color: "#777777",
//       fontSize: 13,
//     },

//     amountRowValue: {
//       color: "#333333",
//       fontSize: 14,
//       fontWeight: "700",
//     },

//     rewardNotUsed: {
//       color: "#9B4DFF",
//       fontSize: 13,
//       fontWeight: "800",
//     },

//     totalRow: {
//       flexDirection:
//         "row",
//       justifyContent:
//         "space-between",
//       alignItems:
//         "center",
//     },

//     totalLabel: {
//       color: "#222222",
//       fontSize: 16,
//       fontWeight: "900",
//     },

//     totalAmount: {
//       color: "#9B4DFF",
//       fontSize: 20,
//       fontWeight: "900",
//     },

//     // =================================================
//     // REWARD INFO
//     // =================================================

//     rewardInfoCard: {
//       marginTop: 14,
//       backgroundColor:
//         "#EFE3FF",
//       borderRadius: 18,
//       padding: 14,
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//     },

//     rewardInfoIcon: {
//       width: 45,
//       height: 45,
//       borderRadius: 23,
//       backgroundColor:
//         "#FFFFFF",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//     },

//     rewardInfoContent: {
//       flex: 1,
//       marginLeft: 12,
//     },

//     rewardInfoTitle: {
//       color: "#222222",
//       fontSize: 14,
//       fontWeight: "800",
//     },

//     rewardInfoText: {
//       marginTop: 3,
//       color: "#777777",
//       fontSize: 11,
//       lineHeight: 17,
//     },

//     // =================================================
//     // WALLET
//     // =================================================

//     walletCard: {
//       marginTop: 14,
//       backgroundColor:
//         "#FFFFFF",
//       borderRadius: 20,
//       padding: 16,
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//       elevation: 2,
//     },

//     walletIcon: {
//       width: 50,
//       height: 50,
//       borderRadius: 25,
//       backgroundColor:
//         "#EFE3FF",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//     },

//     walletInfo: {
//       flex: 1,
//       marginLeft: 12,
//     },

//     walletLabel: {
//       color: "#999999",
//       fontSize: 9,
//       fontWeight: "800",
//       letterSpacing: 0.8,
//     },

//     walletBalance: {
//       marginTop: 3,
//       color: "#222222",
//       fontSize: 22,
//       fontWeight: "900",
//     },

//     walletLoading: {
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//       marginTop: 6,
//     },

//     walletLoadingText: {
//       marginLeft: 7,
//       color: "#888888",
//       fontSize: 11,
//     },

//     sufficientBadge: {
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//       backgroundColor:
//         "#E8F8EE",
//       paddingHorizontal: 9,
//       paddingVertical: 6,
//       borderRadius: 14,
//     },

//     sufficientText: {
//       marginLeft: 3,
//       color: "#27AE60",
//       fontSize: 10,
//       fontWeight: "800",
//     },

//     // =================================================
//     // INSUFFICIENT
//     // =================================================

//     insufficientCard: {
//       marginTop: 12,
//       backgroundColor:
//         "#FFF1F0",
//       borderRadius: 18,
//       padding: 14,
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//     },

//     insufficientIcon: {
//       width: 44,
//       height: 44,
//       borderRadius: 22,
//       backgroundColor:
//         "#FFFFFF",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//     },

//     insufficientInfo: {
//       flex: 1,
//       marginLeft: 11,
//     },

//     insufficientTitle: {
//       color: "#C0392B",
//       fontSize: 14,
//       fontWeight: "800",
//     },

//     insufficientText: {
//       marginTop: 3,
//       color: "#888888",
//       fontSize: 11,
//       lineHeight: 17,
//     },

//     // =================================================
//     // SECURITY
//     // =================================================

//     securityCard: {
//       marginTop: 14,
//       backgroundColor:
//         "#FFFFFF",
//       borderRadius: 18,
//       padding: 14,
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//     },

//     securityIcon: {
//       width: 45,
//       height: 45,
//       borderRadius: 23,
//       backgroundColor:
//         "#E8F8EE",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//     },

//     securityInfo: {
//       flex: 1,
//       marginLeft: 11,
//     },

//     securityTitle: {
//       color: "#222222",
//       fontSize: 13,
//       fontWeight: "800",
//     },

//     securityText: {
//       marginTop: 3,
//       color: "#888888",
//       fontSize: 11,
//       lineHeight: 16,
//     },

//     // =================================================
//     // PAY BUTTON
//     // =================================================

//     payButton: {
//       marginTop: 20,
//       height: 58,
//       borderRadius: 29,
//       backgroundColor:
//         "#9B4DFF",
//       flexDirection:
//         "row",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//       elevation: 4,
//     },

//     payButtonDisabled: {
//       opacity: 0.55,
//     },

//     payButtonText: {
//       marginLeft: 9,
//       color: "#FFFFFF",
//       fontSize: 16,
//       fontWeight: "900",
//     },

//     // =================================================
//     // CANCEL
//     // =================================================

//     cancelButton: {
//       marginTop: 12,
//       height: 52,
//       borderRadius: 26,
//       borderWidth: 1.2,
//       borderColor:
//         "#DDDDDD",
//       backgroundColor:
//         "#FFFFFF",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//     },

//     cancelButtonText: {
//       color: "#777777",
//       fontSize: 13,
//       fontWeight: "800",
//     },

//     // =================================================
//     // QR
//     // =================================================

//     qrCard: {
//       marginTop: 18,
//       backgroundColor:
//         "#FFFFFF",
//       borderRadius: 18,
//       padding: 15,
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//     },

//     qrInfo: {
//       flex: 1,
//       marginLeft: 11,
//     },

//     qrLabel: {
//       color: "#999999",
//       fontSize: 9,
//       fontWeight: "800",
//       letterSpacing: 1,
//     },

//     qrValue: {
//       marginTop: 4,
//       color: "#555555",
//       fontSize: 11,
//       lineHeight: 16,
//     },

//     // =================================================
//     // FOOTER
//     // =================================================

//     footerText: {
//       marginTop: 18,
//       textAlign: "center",
//       color: "#AAAAAA",
//       fontSize: 12,
//     },
//   });


import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

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

    payment?: {
      id?: number;
      amount?: string | number;
      status?: string;
      payment_method?: string;
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

  if (Number.isNaN(numberValue)) {
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
    imageError,
    setImageError,
  ] = useState(false);

  const [
    rewardAdded,
    setRewardAdded,
  ] = useState(
    rewardClaimed
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

  const loadWallet =
    async () => {
      try {
        const token =
          await getToken();

        if (!token) {
          setWalletLoading(false);
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
              result?.data?.wallet?.balance ??
              result?.balance ??
              result?.wallet?.balance ??
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
        Alert.alert(
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

        /*
         * IMPORTANT:
         *
         * This endpoint should be your existing
         * QR reward claim endpoint.
         *
         * We are intentionally NOT using it
         * when the user simply continues to payment.
         *
         * It is only called when the user explicitly
         * chooses ADD REWARD TO WALLET.
         */

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

        setRewardAdded(
          true
        );

        Alert.alert(
          "Reward Added 🎉",
          `${formatMoney(
            reward
          )} has been added to your VedAmrut wallet.`,
          [
            {
              text: "OK",
              onPress:
                loadWallet,
            },
          ]
        );
      } catch (error: any) {
        console.error(
          "REWARD ERROR:",
          error
        );

        Alert.alert(
          "Reward Failed",
          error?.message ||
            "Unable to add reward to wallet."
        );
      } finally {
        setRewardLoading(
          false
        );
      }
    };

  // ===================================================
  // WALLET PAYMENT
  // ===================================================

  const payUsingWallet =
    async (
      token: string
    ) => {
      console.log(
        "================================"
      );

      console.log(
        "WALLET QR PAYMENT"
      );

      console.log(
        "AMOUNT:",
        productPrice
      );

      console.log(
        "================================"
      );

      const paymentUrl =
        `${API_BASE_URL}/api/wallet/pay-qr`;

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

              amount:
                productPrice,

              productName,

              description:
                `QR payment - ${productName}`,

              rewardClaimed:
                false,

              paymentMethod:
                "WALLET",
            }),
          }
        );

      const result =
        (await response.json()) as PaymentResponse;

      console.log(
        "WALLET PAYMENT RESPONSE:",
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
            "Wallet payment failed."
        );
      }

      return result;
    };

  // ===================================================
  // OTHER PAYMENT METHODS
  // ===================================================

  const handleExternalPayment =
    async (
      method: PaymentMethod,
      token: string
    ) => {
      /*
       * IMPORTANT:
       *
       * Wallet is already connected to your backend.
       *
       * UPI / CARD need payment gateway integration.
       * COD needs order creation with payment_method=COD.
       *
       * Do not fake successful payment here.
       */

      if (method === "upi") {
        Alert.alert(
          "UPI Payment",
          "UPI payment gateway needs to be connected to the backend."
        );

        return null;
      }

      if (method === "card") {
        Alert.alert(
          "Card Payment",
          "Credit/Debit Card gateway needs to be connected to the backend."
        );

        return null;
      }

      if (method === "cod") {
        Alert.alert(
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
        Alert.alert(
          "Payment Error",
          "Product information is missing."
        );

        return;
      }

      if (!qrCode) {
        Alert.alert(
          "Payment Error",
          "QR code is missing."
        );

        return;
      }

      if (productPrice <= 0) {
        Alert.alert(
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
        Alert.alert(
          "Login Required",
          "Please login to make the payment.",
          [
            {
              text: "Login",
              onPress: () =>
                router.replace(
                  "/login"
                ),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );

        return;
      }

      // -----------------------------------------------
      // WALLET BALANCE
      // -----------------------------------------------

      if (
        paymentMethod ===
          "wallet" &&
        walletBalance !== null &&
        walletBalance <
          productPrice
      ) {
        Alert.alert(
          "Insufficient Wallet Balance",
          `Your wallet balance is ${formatMoney(
            walletBalance
          )}.\n\nYou need ${formatMoney(
            productPrice -
              walletBalance
          )} more.`,
          [
            {
              text: "Add Money",
              onPress: () => {
                /*
                 * Change this route to your actual
                 * Add Money screen when available.
                 */
                router.push(
                  "/(home)/wallet"
                );
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );

        return;
      }

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
          "AMOUNT:",
          productPrice
        );

        console.log(
          "REWARD:",
          reward
        );

        console.log(
          "================================"
        );

        let result:
          | PaymentResponse
          | null = null;

        // ---------------------------------------------
        // WALLET
        // ---------------------------------------------

        if (
          paymentMethod ===
          "wallet"
        ) {
          result =
            await payUsingWallet(
              token
            );
        }

        // ---------------------------------------------
        // UPI / CARD / COD
        // ---------------------------------------------

        else {
          result =
            await handleExternalPayment(
              paymentMethod,
              token
            );

          /*
           * At this stage there is no real payment
           * result for external methods.
           *
           * Therefore don't navigate to success.
           */
          if (!result) {
            return;
          }
        }

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Payment failed."
          );
        }

        // ---------------------------------------------
        // BALANCE
        // ---------------------------------------------

        const paymentData =
          result?.data;

        const remainingBalance =
          toNumber(
            paymentData?.remaining_balance ??
              paymentData?.wallet
                ?.balance ??
              paymentData?.balance ??
              paymentData?.transaction
                ?.balance_after ??
              walletBalance ??
              0
          );

        console.log(
          "================================"
        );

        console.log(
          "QR PAYMENT SUCCESS"
        );

        console.log(
          "PAYMENT METHOD:",
          paymentMethod
        );

        console.log(
          "AMOUNT:",
          productPrice
        );

        console.log(
          "REWARD CLAIMED:",
          rewardAdded
        );

        console.log(
          "REMAINING BALANCE:",
          remainingBalance
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
                remainingBalance
              ),

            paymentMethod:
              paymentMethod,

            categoryName:
              String(
                categoryName
              ),

            productImage:
              String(
                productImage || ""
              ),

            unitNumber:
              String(unitNumber),
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

        Alert.alert(
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
          : walletBalance !== null
          ? `Balance ${formatMoney(
              walletBalance
            )}`
          : "VedAmrut Wallet",
      icon: "wallet-outline" as const,
    },

    {
      id: "upi" as PaymentMethod,
      title: "UPI",
      subtitle:
        "Google Pay, PhonePe, Paytm",
      icon: "phone-portrait-outline" as const,
    },

    {
      id: "card" as PaymentMethod,
      title: "Credit / Debit Card",
      subtitle:
        "Visa, Mastercard & more",
      icon: "card-outline" as const,
    },

    {
      id: "cod" as PaymentMethod,
      title: "Cash on Delivery",
      subtitle:
        "Pay when your order arrives",
      icon: "cash-outline" as const,
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
                  setImageError(true);
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
              Amount to Pay
            </Text>

            <Text
              style={
                styles.totalAmount
              }
            >
              {formatMoney(
                productPrice
              )}
            </Text>
          </View>
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
            WALLET BALANCE
        ================================================= */}

        {paymentMethod ===
          "wallet" && (
          <>
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
                  null &&
                walletBalance >=
                  productPrice && (
                  <View
                    style={
                      styles.sufficientBadge
                    }
                  >
                    <Ionicons
                      name="checkmark"
                      size={15}
                      color="#27AE60"
                    />

                    <Text
                      style={
                        styles.sufficientText
                      }
                    >
                      Available
                    </Text>
                  </View>
                )}
            </View>

            {!walletLoading &&
              walletBalance !==
                null &&
              walletBalance <
                productPrice && (
                <View
                  style={
                    styles.insufficientCard
                  }
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={23}
                    color="#E74C3C"
                  />

                  <View
                    style={
                      styles.insufficientInfo
                    }
                  >
                    <Text
                      style={
                        styles.insufficientTitle
                      }
                    >
                      Insufficient Balance
                    </Text>

                    <Text
                      style={
                        styles.insufficientText
                      }
                    >
                      You need{" "}
                      {formatMoney(
                        productPrice -
                          walletBalance
                      )}{" "}
                      more.
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={
                      styles.addMoneySmallButton
                    }
                    onPress={() =>
                      router.push(
                        "/(home)/wallet"
                      )
                    }
                  >
                    <Text
                      style={
                        styles.addMoneySmallText
                      }
                    >
                      ADD
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
          </>
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
              walletBalance !==
                null &&
              walletBalance <
                productPrice &&
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
              walletBalance !==
                null &&
              walletBalance <
                productPrice)
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
                    ? "wallet-outline"
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
                  ? `PLACE COD ORDER`
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
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles =
  StyleSheet.create({
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
      fontWeight: "900",
    },

    paymentSubtitle: {
      marginTop: 5,
      color: "#888888",
      fontSize: 13,
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
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: 0.7,
    },

    productName: {
      marginTop: 4,
      color: "#222222",
      fontSize: 18,
      fontWeight: "900",
    },

    productUnit: {
      marginTop: 5,
      color: "#888888",
      fontSize: 12,
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
      fontWeight: "800",
      letterSpacing: 1,
      textAlign: "center",
    },

    amount: {
      marginTop: 6,
      color: "#9B4DFF",
      fontSize: 34,
      fontWeight: "900",
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
    },

    amountRowValue: {
      color: "#333333",
      fontSize: 14,
      fontWeight: "700",
    },

    rewardNotUsed: {
      color: "#9B4DFF",
      fontSize: 13,
      fontWeight: "800",
    },

    rewardAdded: {
      color: "#27AE60",
      fontSize: 13,
      fontWeight: "800",
    },

    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    totalLabel: {
      color: "#222222",
      fontSize: 16,
      fontWeight: "900",
    },

    totalAmount: {
      color: "#9B4DFF",
      fontSize: 20,
      fontWeight: "900",
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
      fontWeight: "900",
    },

    rewardText: {
      marginTop: 3,
      color: "#777777",
      fontSize: 11,
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
      fontWeight: "900",
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
      fontWeight: "900",
    },

    rewardSuccessText: {
      marginTop: 3,
      color: "#6D8B77",
      fontSize: 11,
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
      fontWeight: "900",
    },

    sectionSubtitle: {
      marginTop: 3,
      color: "#999999",
      fontSize: 11,
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
      fontWeight: "800",
    },

    methodSubtitle: {
      marginTop: 3,
      color: "#999999",
      fontSize: 10,
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
      fontWeight: "800",
      letterSpacing: 0.8,
    },

    walletBalance: {
      marginTop: 3,
      color: "#222222",
      fontSize: 22,
      fontWeight: "900",
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
    },

    sufficientBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#E8F8EE",
      paddingHorizontal: 9,
      paddingVertical: 6,
      borderRadius: 14,
    },

    sufficientText: {
      marginLeft: 3,
      color: "#27AE60",
      fontSize: 10,
      fontWeight: "800",
    },

    // =================================================
    // INSUFFICIENT
    // =================================================

    insufficientCard: {
      marginTop: 12,
      backgroundColor: "#FFF1F0",
      borderRadius: 18,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
    },

    insufficientInfo: {
      flex: 1,
      marginLeft: 11,
    },

    insufficientTitle: {
      color: "#C0392B",
      fontSize: 13,
      fontWeight: "800",
    },

    insufficientText: {
      marginTop: 3,
      color: "#888888",
      fontSize: 11,
    },

    addMoneySmallButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: "#9B4DFF",
      borderRadius: 15,
    },

    addMoneySmallText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "900",
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
      fontWeight: "800",
    },

    securityText: {
      marginTop: 3,
      color: "#888888",
      fontSize: 11,
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
      fontWeight: "900",
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
      fontWeight: "800",
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
      fontWeight: "800",
      letterSpacing: 1,
    },

    qrValue: {
      marginTop: 4,
      color: "#555555",
      fontSize: 11,
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
    },
  });
