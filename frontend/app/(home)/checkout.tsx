// import React, { useMemo, useState } from 'react';
// import {
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// import { router, useLocalSearchParams } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useCartContext } from '@/context/CartContext';
// import { useAddress } from '@/hooks/useAddress';
// import { API_BASE_URL } from '@/constants/api';
// import { getToken } from '@/utils/storage';

// type PaymentMethod =
//   | 'cod'
//   | 'upi'
//   | 'card'
//   | 'netbanking'
//   | 'wallet';

// type BuyNowProduct = {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   image?: string | null;
//   category_name?: string;
// };

// export default function CheckoutScreen() {
//   const params = useLocalSearchParams<{
//     mode?: string | string[];
//     productId?: string | string[];
//     productName?: string | string[];
//     productPrice?: string | string[];
//     productImage?: string | string[];
//     categoryName?: string | string[];
//     quantity?: string | string[];
//   }>();

//   const getParam = (
//     value?: string | string[],
//   ): string => {
//     if (Array.isArray(value)) {
//       return value[0] || '';
//     }

//     return value || '';
//   };

//   // =====================================================
//   // CHECKOUT MODE
//   // =====================================================

//   const mode = getParam(params.mode);

//   const isBuyNow = mode === 'buyNow';

//   // =====================================================
//   // CART
//   // =====================================================

//   const {
//     cartLines,
//     totalCount: cartTotalCount,
//     totalPrice: cartTotalPrice,
//   } = useCartContext();

//   // =====================================================
//   // ADDRESS
//   // =====================================================

//   const { selectedAddress } = useAddress();

//   // =====================================================
//   // PAYMENT
//   // =====================================================

//   const [paymentMethod, setPaymentMethod] =
//     useState<PaymentMethod>('cod');

//   const [errorMessage, setErrorMessage] =
//     useState('');

//   const [placingOrder, setPlacingOrder] =
//     useState(false);

//   // =====================================================
//   // BUY NOW PRODUCT
//   // =====================================================

//   const buyNowProduct: BuyNowProduct | null =
//     useMemo(() => {
//       if (!isBuyNow) {
//         return null;
//       }

//       const id = Number(
//         getParam(params.productId),
//       );

//       const price = Number(
//         getParam(params.productPrice),
//       );

//       const quantity = Number(
//         getParam(params.quantity) || '1',
//       );

//       if (!id || !price) {
//         return null;
//       }

//       return {
//         id,
//         name:
//           getParam(params.productName) ||
//           'Product',
//         price,
//         quantity:
//           quantity > 0 ? quantity : 1,
//         image:
//           getParam(params.productImage) ||
//           null,
//         category_name:
//           getParam(params.categoryName) ||
//           '',
//       };
//     }, [
//       isBuyNow,
//       params.productId,
//       params.productName,
//       params.productPrice,
//       params.productImage,
//       params.categoryName,
//       params.quantity,
//     ]);

//   // =====================================================
//   // PRODUCTS TO DISPLAY
//   // =====================================================

//   const checkoutItems = useMemo(() => {
//     if (isBuyNow) {
//       if (!buyNowProduct) {
//         return [];
//       }

//       return [
//         {
//           productId: buyNowProduct.id,
//           quantity: buyNowProduct.quantity,
//           product: {
//             id: buyNowProduct.id,
//             name: buyNowProduct.name,
//             price: buyNowProduct.price,
//             image: buyNowProduct.image,
//             category_name:
//               buyNowProduct.category_name,
//           },
//         },
//       ];
//     }

//     return cartLines;
//   }, [
//     isBuyNow,
//     buyNowProduct,
//     cartLines,
//   ]);

//   // =====================================================
//   // TOTALS
//   // =====================================================

//   const totalCount = isBuyNow
//     ? buyNowProduct?.quantity || 0
//     : cartTotalCount;

//   const totalPrice = isBuyNow
//     ? (buyNowProduct?.price || 0) *
//       (buyNowProduct?.quantity || 0)
//     : cartTotalPrice;

//   // =====================================================
//   // EMPTY
//   // =====================================================

//   if (checkoutItems.length === 0) {
//     return (
//       <View style={styles.center}>
//         <Ionicons
//           name="cart-outline"
//           size={60}
//           color="#B5B5B5"
//         />

//         <Text style={styles.emptyTitle}>
//           {isBuyNow
//             ? 'Unable to load product'
//             : 'Your Cart is Empty'}
//         </Text>

//         <TouchableOpacity
//           style={styles.shopButton}
//           onPress={() => router.push('/')}
//         >
//           <Text style={styles.shopButtonText}>
//             Continue Shopping
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // =====================================================
//   // PRODUCT IMAGE
//   // =====================================================

//   const getImageSource = (
//     image?: string | null,
//   ) => {
//     if (!image) {
//       return require('@/assets/images/product1.png');
//     }

//     if (
//       image.startsWith('http://') ||
//       image.startsWith('https://')
//     ) {
//       return {
//         uri: image,
//       };
//     }

//     return {
//       uri: `${API_BASE_URL}/uploads/${image}`,
//     };
//   };

//   // =====================================================
//   // PRODUCT ITEM
//   // =====================================================

//   const renderItem = ({
//     item,
//   }: {
//     item: any;
//   }) => {
//     const product = item.product;

//     const itemTotal =
//       Number(product.price) *
//       Number(item.quantity);

//     return (
//       <View style={styles.productCard}>
//         <Image
//           source={getImageSource(
//             product.image,
//           )}
//           style={styles.productImage}
//           resizeMode="contain"
//         />

//         <View style={styles.productDetails}>
//           <Text
//             style={styles.productName}
//             numberOfLines={2}
//           >
//             {product.name}
//           </Text>

//           <Text style={styles.category}>
//             {product.category_name ||
//               'Product'}
//           </Text>

//           <Text style={styles.quantity}>
//             Quantity: {item.quantity}
//           </Text>

//           <Text style={styles.itemPrice}>
//             ₹{itemTotal.toFixed(2)}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   // =====================================================
//   // ADDRESS TEXT
//   // =====================================================

//   const addressText = selectedAddress
//     ? [
//         selectedAddress.addressLine,
//         selectedAddress.area,
//         selectedAddress.city,
//         selectedAddress.state,
//         selectedAddress.pincode,
//       ]
//         .filter(Boolean)
//         .join(', ')
//     : '';

//   // =====================================================
//   // PAYMENT METHOD
//   // =====================================================

//   const renderPaymentMethod = (
//     method: PaymentMethod,
//     icon: keyof typeof Ionicons.glyphMap,
//     title: string,
//     subtitle: string,
//   ) => {
//     const isSelected =
//       paymentMethod === method;

//     return (
//       <TouchableOpacity
//         activeOpacity={0.8}
//         style={[
//           styles.paymentCard,
//           isSelected &&
//             styles.paymentCardSelected,
//         ]}
//         onPress={() =>
//           setPaymentMethod(method)
//         }
//       >
//         <View
//           style={[
//             styles.paymentIcon,
//             isSelected &&
//               styles.paymentIconSelected,
//           ]}
//         >
//           <Ionicons
//             name={icon}
//             size={23}
//             color="#1C9C57"
//           />
//         </View>

//         <View style={styles.paymentDetails}>
//           <Text style={styles.paymentTitle}>
//             {title}
//           </Text>

//           <Text style={styles.paymentSubtitle}>
//             {subtitle}
//           </Text>
//         </View>

//         <View
//           style={[
//             styles.radioOuter,
//             isSelected &&
//               styles.radioOuterSelected,
//           ]}
//         >
//           {isSelected && (
//             <View style={styles.radioInner} />
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   // =====================================================
//   // PLACE ORDER
//   // =====================================================

//   const handlePlaceOrder = async () => {
//     if (placingOrder) {
//       return;
//     }

//     try {
//       setErrorMessage('');
//       setPlacingOrder(true);

//       // -----------------------------------------------
//       // ADDRESS
//       // -----------------------------------------------

//       if (!selectedAddress?.id) {
//         setErrorMessage(
//           'Please select a delivery address.',
//         );

//         return;
//       }

//       // -----------------------------------------------
//       // TOKEN
//       // -----------------------------------------------

//       const token = await getToken();

//       if (!token) {
//         setErrorMessage(
//           'Please login again to continue.',
//         );

//         return;
//       }

//       console.log(
//         '================================',
//       );

//       console.log(
//         'PLACING ORDER',
//       );

//       console.log(
//         'CHECKOUT MODE:',
//         isBuyNow
//           ? 'BUY NOW'
//           : 'CART',
//       );

//       console.log(
//         'ADDRESS ID:',
//         selectedAddress.id,
//       );

//       console.log(
//         'PAYMENT:',
//         paymentMethod,
//       );

//       console.log(
//         'TOTAL:',
//         totalPrice,
//       );

//       // -----------------------------------------------
//       // NORMAL CART ORDER
//       // -----------------------------------------------

//       if (!isBuyNow) {
//         console.log(
//           'ORDER SOURCE: CART',
//         );

//         // const response = await fetch( `${API_BASE_URL}/api/orders`,
//         //   {
//         //     method: 'POST',

//         //     headers: {
//         //       'Content-Type':
//         //         'application/json',

//         //       Authorization:
//         //         `Bearer ${token}`,
//         //     },

//         //     body: JSON.stringify({
//         //       addressId:
//         //         selectedAddress.id,

//         //       paymentMethod:
//         //         paymentMethod === 'cod'
//         //           ? 'COD'
//         //           : paymentMethod.toUpperCase(),

                  
//         //     }),
//         //   },
//         // );
// const response = await fetch(
//   `${API_BASE_URL}/api/orders`,
//   {
//     method: 'POST',

//     headers: {
//       'Content-Type':
//         'application/json',

//       Authorization:
//         `Bearer ${token}`,
//     },

//     body: JSON.stringify({
//       addressId: selectedAddress.id,

//       paymentMethod:
//         paymentMethod === 'cod'
//           ? 'COD'
//           : paymentMethod.toUpperCase(),

//       buyNowProductId: buyNowProduct!.id,

//       buyNowQuantity: buyNowProduct!.quantity,
//     }),
//   },
// );
//         const result =
//           await response.json();

//         console.log(
//           'CART ORDER STATUS:',
//           response.status,
//         );

//         console.log(
//           'CART ORDER RESPONSE:',
//           result,
//         );

//         if (
//           !response.ok ||
//           !result.success
//         ) {
//           setErrorMessage(
//             result.message ||
//               'Failed to place order.',
//           );

//           return;
//         }

//         console.log(
//           'CART ORDER SUCCESS',
//         );

//         router.push({
//           pathname:
//             '/(home)/order-success',

//           params: {
//             orderId: String(
//               result.data.order.id,
//             ),

//             totalAmount: String(
//               result.data.order.total_amount,
//             ),

//             paymentMethod:
//               result.data.order.payment_method,

//             mode: 'cart',
//           },
//         });

//         return;
//       }

//       // -----------------------------------------------
//       // BUY NOW ORDER
//       // -----------------------------------------------

//       if (!buyNowProduct) {
//         setErrorMessage(
//           'Buy Now product information is missing.',
//         );

//         return;
//       }

//       console.log(
//         'ORDER SOURCE: BUY NOW',
//       );

//       console.log(
//         'BUY NOW PRODUCT ID:',
//         buyNowProduct.id,
//       );

//       console.log(
//         'BUY NOW QUANTITY:',
//         buyNowProduct.quantity,
//       );

//       /*
//        * IMPORTANT
//        *
//        * BUY NOW DOES NOT ADD THE PRODUCT
//        * TO CART.
//        *
//        * It is sent directly to the order API.
//        */

//       const response = await fetch(
//         `${API_BASE_URL}/api/orders`,
//         {
//           method: 'POST',

//           headers: {
//             'Content-Type':
//               'application/json',

//             Authorization:
//               `Bearer ${token}`,
//           },

//           body: JSON.stringify({
//             addressId:
//               selectedAddress.id,

//             paymentMethod:
//               paymentMethod === 'cod'
//                 ? 'COD'
//                 : paymentMethod.toUpperCase(),

//             // IMPORTANT
//             // Tell backend this is Buy Now
//             checkoutType: 'BUY_NOW',

//             productId:
//               buyNowProduct.id,

//             quantity:
//               buyNowProduct.quantity,
//           }),
//         },
//       );

//       const result =
//         await response.json();

//       console.log(
//         'BUY NOW ORDER STATUS:',
//         response.status,
//       );

//       console.log(
//         'BUY NOW ORDER RESPONSE:',
//         result,
//       );

//       if (
//         !response.ok ||
//         !result.success
//       ) {
//         setErrorMessage(
//           result.message ||
//             'Failed to place order.',
//         );

//         return;
//       }

//       console.log(
//         'BUY NOW ORDER SUCCESS',
//       );

//       /*
//        * VERY IMPORTANT:
//        *
//        * We do NOT call removeFromCart().
//        *
//        * We do NOT clear the cart.
//        *
//        * Therefore the existing cart stays
//        * exactly as it was.
//        */

//       router.push({
//         pathname:
//           '/(home)/order-success',

//         params: {
//           orderId: String(
//             result.data.order.id,
//           ),

//           totalAmount: String(
//             result.data.order.total_amount,
//           ),

//           paymentMethod:
//             result.data.order.payment_method,

//           mode: 'buyNow',
//         },
//       });
//     } catch (error) {
//       console.error(
//         'PLACE ORDER ERROR:',
//         error,
//       );

//       setErrorMessage(
//         error instanceof Error
//           ? error.message
//           : 'Something went wrong. Please try again.',
//       );
//     } finally {
//       setPlacingOrder(false);
//     }
//   };

//   // =====================================================
//   // SCREEN
//   // =====================================================

//   return (
//     <View style={styles.container}>
//       {/* HEADER */}

//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <Ionicons
//             name="arrow-back"
//             size={22}
//             color="#222222"
//           />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>
//           Checkout
//         </Text>

//         <View style={styles.headerSpacer} />
//       </View>

//       {/* CONTENT */}

//       <FlatList
//         data={checkoutItems}
//         keyExtractor={(item) =>
//           `${item.productId}`
//         }
//         renderItem={renderItem}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={
//           styles.listContent
//         }
//         ListHeaderComponent={
//           <>
//             {/* BUY NOW INDICATOR */}

//             {isBuyNow && (
//               <View
//                 style={
//                   styles.buyNowBanner
//                 }
//               >
//                 <Ionicons
//                   name="flash"
//                   size={20}
//                   color="#9B4DFF"
//                 />

//                 <Text
//                   style={
//                     styles.buyNowBannerText
//                   }
//                 >
//                   Buy Now — this purchase
//                   will not change your cart
//                 </Text>
//               </View>
//             )}

//             {/* ADDRESS */}

//             <Text style={styles.sectionTitle}>
//               Delivery Address
//             </Text>

//             {selectedAddress ? (
//               <View style={styles.addressCard}>
//                 <View style={styles.addressIcon}>
//                   <Ionicons
//                     name="location"
//                     size={20}
//                     color="#1C9C57"
//                   />
//                 </View>

//                 <View
//                   style={styles.addressDetails}
//                 >
//                   <Text
//                     style={styles.addressName}
//                   >
//                     {selectedAddress.fullName}
//                   </Text>

//                   <Text
//                     style={styles.addressText}
//                   >
//                     {addressText}
//                   </Text>

//                   <Text
//                     style={styles.phoneText}
//                   >
//                     {selectedAddress.phone}
//                   </Text>
//                 </View>

//                 <TouchableOpacity
//                   onPress={() =>
//                     router.push(
//                       '/(home)/saved-addresses',
//                     )
//                   }
//                 >
//                   <Text
//                     style={styles.changeText}
//                   >
//                     Change
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity
//                 style={
//                   styles.addAddressCard
//                 }
//                 onPress={() =>
//                   router.push(
//                     '/(home)/add-address',
//                   )
//                 }
//               >
//                 <Ionicons
//                   name="add-circle-outline"
//                   size={22}
//                   color="#1C9C57"
//                 />

//                 <Text
//                   style={
//                     styles.addAddressText
//                   }
//                 >
//                   Add Delivery Address
//                 </Text>
//               </TouchableOpacity>
//             )}

//             <Text style={styles.sectionTitle}>
//               {isBuyNow
//                 ? 'Product'
//                 : 'Order Summary'}
//             </Text>
//           </>
//         }
//         ListFooterComponent={
//           <>
//             {/* PRICE */}

//             <Text style={styles.sectionTitle}>
//               Price Details
//             </Text>

//             <View style={styles.priceCard}>
//               <View style={styles.priceRow}>
//                 <Text
//                   style={styles.priceLabel}
//                 >
//                   Items ({totalCount})
//                 </Text>

//                 <Text
//                   style={styles.priceValue}
//                 >
//                   ₹{totalPrice.toFixed(2)}
//                 </Text>
//               </View>

//               <View style={styles.priceRow}>
//                 <Text
//                   style={styles.priceLabel}
//                 >
//                   Delivery Charges
//                 </Text>

//                 <Text style={styles.freeText}>
//                   FREE
//                 </Text>
//               </View>

//               <View style={styles.divider} />

//               <View style={styles.totalRow}>
//                 <Text
//                   style={styles.totalLabel}
//                 >
//                   Total Amount
//                 </Text>

//                 <Text
//                   style={styles.totalAmount}
//                 >
//                   ₹{totalPrice.toFixed(2)}
//                 </Text>
//               </View>
//             </View>

//             {/* PAYMENT */}

//             <Text style={styles.sectionTitle}>
//               Payment Method
//             </Text>

//             <View
//               style={
//                 styles.paymentContainer
//               }
//             >
//               {renderPaymentMethod(
//                 'cod',
//                 'cash-outline',
//                 'Cash on Delivery',
//                 'Pay when your order is delivered',
//               )}

//               {renderPaymentMethod(
//                 'upi',
//                 'phone-portrait-outline',
//                 'UPI',
//                 'Pay securely using UPI',
//               )}

//               {renderPaymentMethod(
//                 'card',
//                 'card-outline',
//                 'Credit / Debit Card',
//                 'Pay securely using your card',
//               )}

//               {renderPaymentMethod(
//                 'netbanking',
//                 'business-outline',
//                 'Net Banking',
//                 'Pay using your bank account',
//               )}

//               {renderPaymentMethod(
//                 'wallet',
//                 'wallet-outline',
//                 'Wallet',
//                 'Pay using your wallet balance',
//               )}
//             </View>

//             {/* SELECTED PAYMENT */}

//             <View
//               style={
//                 styles.selectedPaymentBox
//               }
//             >
//               <Ionicons
//                 name="shield-checkmark-outline"
//                 size={18}
//                 color="#1C9C57"
//               />

//               <Text
//                 style={
//                   styles.selectedPaymentText
//                 }
//               >
//                 {paymentMethod === 'cod' &&
//                   'Cash on Delivery selected'}

//                 {paymentMethod === 'upi' &&
//                   'UPI payment selected'}

//                 {paymentMethod === 'card' &&
//                   'Credit / Debit Card selected'}

//                 {paymentMethod ===
//                   'netbanking' &&
//                   'Net Banking selected'}

//                 {paymentMethod === 'wallet' &&
//                   'Wallet payment selected'}
//               </Text>
//             </View>

//             {/* ERROR */}

//             {errorMessage ? (
//               <View
//                 style={styles.errorBox}
//               >
//                 <Ionicons
//                   name="alert-circle-outline"
//                   size={21}
//                   color="#D32F2F"
//                 />

//                 <Text
//                   style={styles.errorText}
//                 >
//                   {errorMessage}
//                 </Text>
//               </View>
//             ) : null}

//             {/* PLACE ORDER */}

//             <TouchableOpacity
//               style={[
//                 styles.placeOrderButton,

//                 !selectedAddress &&
//                   styles.placeOrderDisabled,

//                 placingOrder &&
//                   styles.placeOrderDisabled,
//               ]}
//               disabled={
//                 !selectedAddress ||
//                 placingOrder
//               }
//               onPress={
//                 handlePlaceOrder
//               }
//             >
//               {placingOrder ? (
//                 <Text
//                   style={
//                     styles.placeOrderText
//                   }
//                 >
//                   Placing Order...
//                 </Text>
//               ) : (
//                 <Text
//                   style={
//                     styles.placeOrderText
//                   }
//                 >
//                   {selectedAddress
//                     ? `Place Order • ₹${totalPrice.toFixed(
//                         2,
//                       )}`
//                     : 'Add Address to Continue'}
//                 </Text>
//               )}
//             </TouchableOpacity>

//             <View
//               style={styles.bottomSpace}
//             />
//           </>
//         }
//       />
//     </View>
//   );
// }

// // =====================================================
// // STYLES
// // =====================================================

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },

//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//   },

//   emptyTitle: {
//     marginTop: 15,
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#222222',
//   },

//   shopButton: {
//     marginTop: 20,
//     backgroundColor: '#1C9C57',
//     paddingHorizontal: 24,
//     paddingVertical: 13,
//     borderRadius: 24,
//   },

//   shopButtonText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '600',
//   },

//   header: {
//     height: 60,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#EEEEEE',
//   },

//   backButton: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#222222',
//   },

//   headerSpacer: {
//     width: 38,
//   },

//   listContent: {
//     padding: 16,
//     paddingBottom: 30,
//   },

//   buyNowBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F3EAFF',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//   },

//   buyNowBannerText: {
//     flex: 1,
//     marginLeft: 8,
//     color: '#7A35D0',
//     fontSize: 13,
//     fontWeight: '600',
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#222222',
//     marginTop: 8,
//     marginBottom: 12,
//   },

//   addressCard: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     borderWidth: 1,
//     borderColor: '#E5E5E5',
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 20,
//     backgroundColor: '#FFFFFF',
//   },

//   addressIcon: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: '#E9FBF0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   addressDetails: {
//     flex: 1,
//     marginLeft: 10,
//     marginRight: 8,
//   },

//   addressName: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#222222',
//     marginBottom: 4,
//   },

//   addressText: {
//     fontSize: 13,
//     color: '#555555',
//     lineHeight: 19,
//   },

//   phoneText: {
//     marginTop: 5,
//     fontSize: 12,
//     color: '#777777',
//   },

//   changeText: {
//     color: '#1C6FD9',
//     fontSize: 13,
//     fontWeight: '600',
//   },

//   addAddressCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#1C9C57',
//     borderRadius: 14,
//     padding: 15,
//     marginBottom: 20,
//     backgroundColor: '#F3FFF7',
//   },

//   addAddressText: {
//     marginLeft: 9,
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1C9C57',
//   },

//   productCard: {
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: '#EEEEEE',
//     borderRadius: 14,
//     padding: 12,
//     marginBottom: 10,
//     backgroundColor: '#FFFFFF',
//   },

//   productImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 10,
//     backgroundColor: '#F7F7F7',
//   },

//   productDetails: {
//     flex: 1,
//     marginLeft: 12,
//   },

//   productName: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#222222',
//   },

//   category: {
//     marginTop: 3,
//     fontSize: 12,
//     color: '#888888',
//   },

//   quantity: {
//     marginTop: 5,
//     fontSize: 12,
//     color: '#666666',
//   },

//   itemPrice: {
//     marginTop: 5,
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#1C9C57',
//   },

//   priceCard: {
//     borderWidth: 1,
//     borderColor: '#EEEEEE',
//     borderRadius: 14,
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//   },

//   priceRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },

//   priceLabel: {
//     fontSize: 14,
//     color: '#555555',
//   },

//   priceValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#222222',
//   },

//   freeText: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#1C9C57',
//   },

//   divider: {
//     height: 1,
//     backgroundColor: '#EEEEEE',
//     marginVertical: 5,
//   },

//   totalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 10,
//   },

//   totalLabel: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#222222',
//   },

//   totalAmount: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1C9C57',
//   },

//   paymentContainer: {
//     gap: 10,
//   },

//   paymentCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     minHeight: 76,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     borderWidth: 1,
//     borderColor: '#E5E5E5',
//     borderRadius: 14,
//     backgroundColor: '#FFFFFF',
//   },

//   paymentCardSelected: {
//     borderColor: '#1C9C57',
//     backgroundColor: '#F3FFF7',
//   },

//   paymentIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F2F2F2',
//   },

//   paymentIconSelected: {
//     backgroundColor: '#E3F8EC',
//   },

//   paymentDetails: {
//     flex: 1,
//     marginLeft: 12,
//     marginRight: 10,
//   },

//   paymentTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#222222',
//   },

//   paymentSubtitle: {
//     marginTop: 4,
//     fontSize: 12,
//     color: '#777777',
//   },

//   radioOuter: {
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     borderWidth: 2,
//     borderColor: '#CFCFCF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   radioOuterSelected: {
//     borderColor: '#1C9C57',
//   },

//   radioInner: {
//     width: 11,
//     height: 11,
//     borderRadius: 6,
//     backgroundColor: '#1C9C57',
//   },

//   selectedPaymentBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//     backgroundColor: '#F3FFF7',
//   },

//   selectedPaymentText: {
//     marginLeft: 7,
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#1C9C57',
//   },

//   errorBox: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginTop: 14,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     borderRadius: 10,
//     backgroundColor: '#FFF1F1',
//     borderWidth: 1,
//     borderColor: '#F5C2C2',
//   },

//   errorText: {
//     flex: 1,
//     marginLeft: 8,
//     fontSize: 13,
//     lineHeight: 19,
//     fontWeight: '600',
//     color: '#D32F2F',
//   },

//   placeOrderButton: {
//     marginTop: 24,
//     height: 54,
//     borderRadius: 27,
//     backgroundColor: '#1C9C57',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   placeOrderDisabled: {
//     backgroundColor: '#B5B5B5',
//   },

//   placeOrderText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '700',
//   },

//   bottomSpace: {
//     height: 30,
//   },
// });

import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
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

  const params = useLocalSearchParams<{
    mode?: string | string[];
    productId?: string | string[];
    productName?: string | string[];
    productPrice?: string | string[];
    productImage?: string | string[];
    categoryName?: string | string[];
    quantity?: string | string[];
  }>();

  const getParam = (
    value?: string | string[],
  ): string => {
    if (Array.isArray(value)) {
      return value[0] || '';
    }

    return value || '';
  };

  // =====================================================
  // CHECKOUT MODE
  // =====================================================

  const mode = getParam(params.mode);

  const isBuyNow = mode === 'buyNow';

  console.log('================================');
  console.log('CHECKOUT SCREEN');
  console.log('MODE:', mode);
  console.log('IS BUY NOW:', isBuyNow);
  console.log('PRODUCT ID PARAM:', getParam(params.productId));
  console.log('PRODUCT NAME PARAM:', getParam(params.productName));
  console.log('PRODUCT PRICE PARAM:', getParam(params.productPrice));
  console.log('QUANTITY PARAM:', getParam(params.quantity));
  console.log('================================');

  // =====================================================
  // CART
  // =====================================================

  const {
    cartLines,
    totalCount: cartTotalCount,
    totalPrice: cartTotalPrice,
  } = useCartContext();

  // =====================================================
  // ADDRESS
  // =====================================================

  const { selectedAddress } = useAddress();

  // =====================================================
  // PAYMENT
  // =====================================================

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('cod');

  const [errorMessage, setErrorMessage] =
    useState('');

  const [placingOrder, setPlacingOrder] =
    useState(false);

  // =====================================================
  // BUY NOW PRODUCT
  // =====================================================

  const buyNowProduct: BuyNowProduct | null =
    useMemo(() => {
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

      console.log('================================');
      console.log('BUILDING BUY NOW PRODUCT');
      console.log('ID:', id);
      console.log('PRICE:', price);
      console.log('QUANTITY:', quantity);
      console.log('================================');

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
          quantity > 0 ? quantity : 1,
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
  // PRODUCTS TO DISPLAY
  // =====================================================

  const checkoutItems = useMemo(() => {
    // ---------------------------------------------------
    // BUY NOW
    // ---------------------------------------------------

    if (isBuyNow) {
      if (!buyNowProduct) {
        return [];
      }

      return [
        {
          productId: buyNowProduct.id,
          quantity: buyNowProduct.quantity,
          product: {
            id: buyNowProduct.id,
            name: buyNowProduct.name,
            price: buyNowProduct.price,
            image: buyNowProduct.image,
            category_name:
              buyNowProduct.category_name,
          },
        },
      ];
    }

    // ---------------------------------------------------
    // NORMAL CART
    // ---------------------------------------------------

    return cartLines;
  }, [
    isBuyNow,
    buyNowProduct,
    cartLines,
  ]);

  // =====================================================
  // TOTALS
  // =====================================================

  const totalCount = isBuyNow
    ? buyNowProduct?.quantity || 0
    : cartTotalCount;

  const totalPrice = isBuyNow
    ? (buyNowProduct?.price || 0) *
      (buyNowProduct?.quantity || 0)
    : cartTotalPrice;

  // =====================================================
  // EMPTY
  // =====================================================

  if (checkoutItems.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="cart-outline"
          size={60}
          color="#B5B5B5"
        />

        <Text style={styles.emptyTitle}>
          {isBuyNow
            ? 'Unable to load product'
            : 'Your Cart is Empty'}
        </Text>

        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.shopButtonText}>
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // =====================================================
  // PRODUCT IMAGE
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
      uri: `${API_BASE_URL}/uploads/${image}`,
    };
  };

  // =====================================================
  // PRODUCT ITEM
  // =====================================================

  const renderItem = ({
    item,
  }: {
    item: any;
  }) => {
    const product = item.product;

    const itemTotal =
      Number(product.price) *
      Number(item.quantity);

    return (
      <View style={styles.productCard}>
        <Image
          source={getImageSource(
            product.image,
          )}
          style={styles.productImage}
          resizeMode="contain"
        />

        <View style={styles.productDetails}>
          <Text
            style={styles.productName}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          <Text style={styles.category}>
            {product.category_name ||
              'Product'}
          </Text>

          <Text style={styles.quantity}>
            Quantity: {item.quantity}
          </Text>

          <Text style={styles.itemPrice}>
            ₹{itemTotal.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  // =====================================================
  // ADDRESS TEXT
  // =====================================================

  const addressText = selectedAddress
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

  const renderPaymentMethod = (
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
        onPress={() =>
          setPaymentMethod(method)
        }
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

        <View style={styles.paymentDetails}>
          <Text style={styles.paymentTitle}>
            {title}
          </Text>

          <Text style={styles.paymentSubtitle}>
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
            <View style={styles.radioInner} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = async () => {
    if (placingOrder) {
      return;
    }

    try {
      setErrorMessage('');
      setPlacingOrder(true);

      // =================================================
      // ADDRESS CHECK
      // =================================================

      if (!selectedAddress?.id) {
        setErrorMessage(
          'Please select a delivery address.',
        );

        return;
      }

      // =================================================
      // TOKEN
      // =================================================

      const token = await getToken();

      if (!token) {
        setErrorMessage(
          'Please login again to continue.',
        );

        return;
      }

      // =================================================
      // COMMON LOGS
      // =================================================

      console.log('================================');
      console.log('PLACING ORDER');
      console.log(
        'CHECKOUT MODE:',
        isBuyNow
          ? 'BUY NOW'
          : 'CART',
      );
      console.log(
        'ADDRESS ID:',
        selectedAddress.id,
      );
      console.log(
        'PAYMENT:',
        paymentMethod,
      );
      console.log(
        'TOTAL:',
        totalPrice,
      );
      console.log('================================');

      // =================================================
      // NORMAL CART ORDER
      // =================================================

      if (!isBuyNow) {
        console.log('ORDER SOURCE: CART');

        // ------------------------------------------------
        // IMPORTANT:
        //
        // For CART checkout, do NOT send:
        //
        // buyNowProductId
        // buyNowQuantity
        //
        // Backend will automatically read cart.
        // ------------------------------------------------

        const requestBody = {
          addressId: selectedAddress.id,

          paymentMethod:
            paymentMethod === 'cod'
              ? 'COD'
              : paymentMethod.toUpperCase(),
        };

        console.log(
          'CART REQUEST BODY:',
          JSON.stringify(
            requestBody,
            null,
            2,
          ),
        );

        const response = await fetch(
          `${API_BASE_URL}/api/orders`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify(
              requestBody,
            ),
          },
        );

        const result =
          await response.json();

        console.log(
          'CART ORDER STATUS:',
          response.status,
        );

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

        console.log(
          'CART ORDER SUCCESS',
        );

        router.push({
          pathname:
            '/(home)/order-success',

          params: {
            orderId: String(
              result.data.order.id,
            ),

            totalAmount: String(
              result.data.order
                .total_amount,
            ),

            paymentMethod:
              result.data.order
                .payment_method,

            mode: 'cart',
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
      // BUY NOW ORDER
      // =================================================

      console.log(
        'ORDER SOURCE: BUY NOW',
      );

      console.log(
        'BUY NOW PRODUCT ID:',
        buyNowProduct.id,
      );

      console.log(
        'BUY NOW PRODUCT ID TYPE:',
        typeof buyNowProduct.id,
      );

      console.log(
        'BUY NOW QUANTITY:',
        buyNowProduct.quantity,
      );

      console.log(
        'BUY NOW PRICE:',
        buyNowProduct.price,
      );

      // =================================================
      // ⭐ IMPORTANT FIX
      // =================================================
      //
      // YOUR BACKEND EXPECTS:
      //
      // buyNowProductId
      // buyNowQuantity
      //
      // NOT:
      //
      // checkoutType
      // productId
      // quantity
      //
      // =================================================

      const requestBody = {
        addressId: selectedAddress.id,

        paymentMethod:
          paymentMethod === 'cod'
            ? 'COD'
            : paymentMethod.toUpperCase(),

        // ⭐ CORRECT BACKEND FIELD
        buyNowProductId:
          buyNowProduct.id,

        // ⭐ CORRECT BACKEND FIELD
        buyNowQuantity:
          buyNowProduct.quantity,
      };

      console.log(
        '================================',
      );

      console.log(
        'BUY NOW REQUEST BODY:',
      );

      console.log(
        JSON.stringify(
          requestBody,
          null,
          2,
        ),
      );

      console.log(
        '================================',
      );

      // =================================================
      // SEND BUY NOW ORDER
      // =================================================

      const response = await fetch(
        `${API_BASE_URL}/api/orders`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            requestBody,
          ),
        },
      );

      const result =
        await response.json();

      // =================================================
      // RESPONSE LOGS
      // =================================================

      console.log(
        'BUY NOW ORDER STATUS:',
        response.status,
      );

      console.log(
        'BUY NOW ORDER RESPONSE:',
        result,
      );

      // =================================================
      // ERROR
      // =================================================

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

      console.log(
        '================================',
      );

      console.log(
        'BUY NOW ORDER SUCCESS',
      );

      console.log(
        'ORDER ID:',
        result.data.order.id,
      );

      console.log(
        'CART WILL REMAIN UNCHANGED',
      );

      console.log(
        '================================',
      );

      // =================================================
      // IMPORTANT:
      //
      // DO NOT:
      //
      // removeFromCart()
      // clearCart()
      // addToCart()
      //
      // Buy Now should NOT modify cart.
      // =================================================

      router.push({
        pathname:
          '/(home)/order-success',

        params: {
          orderId: String(
            result.data.order.id,
          ),

          totalAmount: String(
            result.data.order
              .total_amount,
          ),

          paymentMethod:
            result.data.order
              .payment_method,

          mode: 'buyNow',
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
    <View style={styles.container}>
      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#222222"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Checkout
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* =================================================
          CONTENT
      ================================================= */}

      <FlatList
        data={checkoutItems}
        keyExtractor={(item) =>
          `${item.productId}`
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.listContent
        }

        // =================================================
        // HEADER
        // =================================================

        ListHeaderComponent={
          <>
            {/* BUY NOW BANNER */}

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
                  Buy Now — this purchase
                  will not change your cart
                </Text>
              </View>
            )}

            {/* ADDRESS */}

            <Text style={styles.sectionTitle}>
              Delivery Address
            </Text>

            {selectedAddress ? (
              <View style={styles.addressCard}>
                <View style={styles.addressIcon}>
                  <Ionicons
                    name="location"
                    size={20}
                    color="#1C9C57"
                  />
                </View>

                <View
                  style={styles.addressDetails}
                >
                  <Text
                    style={styles.addressName}
                  >
                    {selectedAddress.fullName}
                  </Text>

                  <Text
                    style={styles.addressText}
                  >
                    {addressText}
                  </Text>

                  <Text
                    style={styles.phoneText}
                  >
                    {selectedAddress.phone}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    router.push(
                      '/(home)/saved-addresses',
                    )
                  }
                >
                  <Text
                    style={styles.changeText}
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
                onPress={() =>
                  router.push(
                    '/(home)/add-address',
                  )
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
                  Add Delivery Address
                </Text>
              </TouchableOpacity>
            )}

            <Text style={styles.sectionTitle}>
              {isBuyNow
                ? 'Product'
                : 'Order Summary'}
            </Text>
          </>
        }

        // =================================================
        // FOOTER
        // =================================================

        ListFooterComponent={
          <>
            {/* PRICE DETAILS */}

            <Text style={styles.sectionTitle}>
              Price Details
            </Text>

            <View style={styles.priceCard}>
              <View style={styles.priceRow}>
                <Text
                  style={styles.priceLabel}
                >
                  Items ({totalCount})
                </Text>

                <Text
                  style={styles.priceValue}
                >
                  ₹{totalPrice.toFixed(2)}
                </Text>
              </View>

              <View style={styles.priceRow}>
                <Text
                  style={styles.priceLabel}
                >
                  Delivery Charges
                </Text>

                <Text style={styles.freeText}>
                  FREE
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text
                  style={styles.totalLabel}
                >
                  Total Amount
                </Text>

                <Text
                  style={styles.totalAmount}
                >
                  ₹{totalPrice.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* PAYMENT */}

            <Text style={styles.sectionTitle}>
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
                'UPI',
                'Pay securely using UPI',
              )}

              {renderPaymentMethod(
                'card',
                'card-outline',
                'Credit / Debit Card',
                'Pay securely using your card',
              )}

              {renderPaymentMethod(
                'netbanking',
                'business-outline',
                'Net Banking',
                'Pay using your bank account',
              )}

              {renderPaymentMethod(
                'wallet',
                'wallet-outline',
                'Wallet',
                'Pay using your wallet balance',
              )}
            </View>

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
                {paymentMethod === 'cod' &&
                  'Cash on Delivery selected'}

                {paymentMethod === 'upi' &&
                  'UPI payment selected'}

                {paymentMethod === 'card' &&
                  'Credit / Debit Card selected'}

                {paymentMethod ===
                  'netbanking' &&
                  'Net Banking selected'}

                {paymentMethod === 'wallet' &&
                  'Wallet payment selected'}
              </Text>
            </View>

            {/* ERROR */}

            {errorMessage ? (
              <View
                style={styles.errorBox}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={21}
                  color="#D32F2F"
                />

                <Text
                  style={styles.errorText}
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
              ]}
              disabled={
                !selectedAddress ||
                placingOrder
              }
              onPress={
                handlePlaceOrder
              }
            >
              {placingOrder ? (
                <Text
                  style={
                    styles.placeOrderText
                  }
                >
                  Placing Order...
                </Text>
              ) : (
                <Text
                  style={
                    styles.placeOrderText
                  }
                >
                  {selectedAddress
                    ? `Place Order • ₹${totalPrice.toFixed(
                        2,
                      )}`
                    : 'Add Address to Continue'}
                </Text>
              )}
            </TouchableOpacity>

            <View
              style={styles.bottomSpace}
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
    fontWeight: '700',
    color: '#222222',
  },

  shopButton: {
    marginTop: 20,
    backgroundColor: '#1C9C57',
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 24,
  },

  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
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
    fontWeight: '700',
    color: '#222222',
  },

  headerSpacer: {
    width: 38,
  },

  listContent: {
    padding: 16,
    paddingBottom: 30,
  },

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
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
    marginTop: 8,
    marginBottom: 12,
  },

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
    fontWeight: '700',
    color: '#222222',
    marginBottom: 4,
  },

  addressText: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 19,
  },

  phoneText: {
    marginTop: 5,
    fontSize: 12,
    color: '#777777',
  },

  changeText: {
    color: '#1C6FD9',
    fontSize: 13,
    fontWeight: '600',
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
    fontWeight: '600',
    color: '#1C9C57',
  },

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
    fontWeight: '600',
    color: '#222222',
  },

  category: {
    marginTop: 3,
    fontSize: 12,
    color: '#888888',
  },

  quantity: {
    marginTop: 5,
    fontSize: 12,
    color: '#666666',
  },

  itemPrice: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: '700',
    color: '#1C9C57',
  },

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
    color: '#555555',
  },

  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
  },

  freeText: {
    fontSize: 13,
    fontWeight: '700',
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
    fontWeight: '700',
    color: '#222222',
  },

  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C9C57',
  },

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
    fontWeight: '700',
    color: '#222222',
  },

  paymentSubtitle: {
    marginTop: 4,
    fontSize: 12,
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
    marginLeft: 7,
    fontSize: 12,
    fontWeight: '600',
    color: '#1C9C57',
  },

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
    fontWeight: '600',
    color: '#D32F2F',
  },

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
    fontWeight: '700',
  },

  bottomSpace: {
    height: 30,
  },
});