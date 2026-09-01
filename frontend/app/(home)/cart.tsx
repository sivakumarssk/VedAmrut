// import React from 'react';
// import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
// // import { router } from 'expo-router';
// import { router, useLocalSearchParams } from 'expo-router';
// import { useCartContext } from '@/context/CartContext';
// import { API_BASE_URL } from '@/constants/api';
// import { useAuth } from '@/hooks/useAuth';
// import { useAddress } from '@/hooks/useAddress';
// import { useLoginPopup } from '@/hooks/useLoginPopup';
// import { Ionicons } from '@expo/vector-icons';

// export default function CartScreen() {
//   const [removingProductId, setRemovingProductId] =React.useState<string | null>(null);
//   const {cartLines,totalCount, totalPrice,isLoading,updateQuantity,removeFromCart, clearCart, } = useCartContext();
//   const { isLoggedIn } = useAuth();
//   const { selectedAddress } = useAddress();
//   const { showLoginPopup } = useLoginPopup();
//   const { from } = useLocalSearchParams<{
//   from?: string;
// }>();
// const handleBack = () => {
//   router.back();
// };
// const handleCheckout = () => {
//   console.log('================================');
//   console.log('CHECKOUT BUTTON PRESSED');
//   console.log('IS LOGGED IN:', isLoggedIn);
//   console.log('SELECTED ADDRESS:', selectedAddress);
//   console.log('================================');

//   if (!isLoggedIn) {
//     console.log('USER NOT LOGGED IN');
//     showLoginPopup();
//     return;
//   }
//   if (!selectedAddress) {
//     console.log('NO ADDRESS → ADD ADDRESS');
//     router.push('/(home)/add-address');
//     return;
//   }
//   console.log('ADDRESS EXISTS → GOING TO CHECKOUT');
//   router.push('/(home)/checkout');
// };
//   const handleRemove = async (
//     productId: string
//   ) => {
//     if (removingProductId) {
//       return;
//     }
//     try {
//       setRemovingProductId(productId);

//       await removeFromCart(productId);

//     } catch (error) {
//       console.error(
//         'HANDLE REMOVE ERROR:',
//         error
//       );
//     } finally {
//       setRemovingProductId(null);
//     }
//   };
//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (isLoading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator
//           size="large"
//           color="#2E7D32"
//         />

//         <Text style={styles.loadingText}>
//           Loading cart...
//         </Text>
//       </View>
//     );
//   }

//   // =====================================================
//   // EMPTY CART
//   // =====================================================

//   if (cartLines.length === 0) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.emptyTitle}>
//           Your Cart is Empty
//         </Text>

//         <Text style={styles.emptyText}>
//           Add some products to your cart.
//         </Text>

//         <TouchableOpacity
//           style={styles.shopButton}
//           onPress={() =>
//             router.push('/')
//           }
//         >
//           <Text style={styles.shopButtonText}>
//             Continue Shopping
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // =====================================================
//   // CART ITEM
//   // =====================================================

//   const renderCartItem = ({
//     item,
//   }: {
//     item: any;
//   }) => {
//     const product = item.product;

//     // const imageSource = product.image
//     //   ? {
//     //       uri: `${API_BASE_URL}/uploads/${product.image}`,
//     //     }
//     //   : require('@/assets/images/product1.png');
//     const imageSource = product.image
//   ? {
//       uri: `${API_BASE_URL}/uploads/${product.image}?v=${Date.now()}`,
//     }
//   : require('@/assets/images/product1.png');

//     return (
//       <View style={styles.card}>

//         {/* =============================================
//             PRODUCT IMAGE
//         ============================================= */}

//         <Image
//           source={imageSource}
//           style={styles.productImage}
//           resizeMode="contain"
//         />

//         {/* =============================================
//             PRODUCT DETAILS
//         ============================================= */}

//         <View style={styles.details}>

//           <Text
//             style={styles.productName}
//             numberOfLines={2}
//           >
//             {product.name}
//           </Text>

//           <Text style={styles.category}>
//             {product.category_name}
//           </Text>

//           <Text style={styles.price}>
//             ₹
//             {Number(product.price).toFixed(2)}
//           </Text>

//           {/* ===========================================
//               QUANTITY
//           =========================================== */}

//           <View style={styles.quantityRow}>

//             {/* MINUS */}

//             <TouchableOpacity
//               style={styles.quantityButton}
//               onPress={() =>
//                 updateQuantity(
//                   String(product.id),
//                   item.quantity - 1
//                 )
//               }
//             >
//               <Text style={styles.quantityText}>
//                 −
//               </Text>
//             </TouchableOpacity>

//             {/* QUANTITY */}

//             <Text style={styles.quantity}>
//               {item.quantity}
//             </Text>

//             {/* PLUS */}

//             <TouchableOpacity
//               style={styles.quantityButton}
//               onPress={() =>
//                 updateQuantity(
//                   String(product.id),
//                   item.quantity + 1
//                 )
//               }
//             >
//               <Text style={styles.quantityText}>
//                 +
//               </Text>
//             </TouchableOpacity>

//           </View>
//         </View>

//         {/* =============================================
//             REMOVE
//         ============================================= */}
// {/* <TouchableOpacity
//   style={styles.removeButton}
//   disabled={
//     removingProductId === String(product.id)
//   }
//   onPress={() =>
//     handleRemove(
//       String(product.id)
//     )
//   }
// >
//   <Text style={styles.removeText}>
//     {removingProductId === String(product.id)
//       ? 'Removing...'
//       : 'Remove'}
//   </Text>
// </TouchableOpacity> */}

// <TouchableOpacity
//   style={styles.removeButton}
//   disabled={
//     removingProductId === String(product.id)
//   }
//   onPress={() =>
//     handleRemove(String(product.id))
//   }
// >
//   {removingProductId === String(product.id) ? (
//     <ActivityIndicator
//       size="small"
//       color="#D32F2F"
//     />
//   ) : (
//     <Ionicons
//       name="trash-outline"
//       size={22}
//       color="#D32F2F"
//     />
//   )}
// </TouchableOpacity>
//       </View>
//     );
//   };

//   // =====================================================
//   // SCREEN
//   // =====================================================

//   return (
//     <View style={styles.container}>

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       {/* <View style={styles.header}>

//         <Text style={styles.title}>
//           My Cart
//         </Text>

//         <Text style={styles.itemCount}>
//           {totalCount} item
//           {totalCount !== 1 ? 's' : ''}
//         </Text>

//       </View> */}
// <View style={styles.header}>

//   <TouchableOpacity
//     style={styles.backButton}
//     onPress={() => router.back()}
//   >
//     <Ionicons
//       name="arrow-back"
//       size={22}
//       color="#222222"
//     />
//   </TouchableOpacity>

//   <Text style={styles.title}>
//     My Cart
//   </Text>

//   <Text style={styles.itemCount}>
//     {totalCount} item
//     {totalCount !== 1 ? 's' : ''}
//   </Text>

// </View>
//       {/* =================================================
//           CART LIST
//       ================================================= */}

//   <FlatList
//   data={cartLines}
//   keyExtractor={(item) =>
//     String(item.productId)
//   }
//   renderItem={renderCartItem}
//   contentContainerStyle={[
//     styles.list,
//     {
//       paddingBottom: 220,
//     },
//   ]}
//   showsVerticalScrollIndicator={false}
// />

//       {/* =================================================
//           CART SUMMARY
//       ================================================= */}

//       <View style={styles.bottomContainer}>

//         {/* ===============================================
//             TOTAL
//         =============================================== */}

//         <View style={styles.summaryRow}>

//           <Text style={styles.summaryLabel}>
//             Total
//           </Text>

//           <Text style={styles.totalPrice}>
//             ₹
//             {totalPrice.toFixed(2)}
//           </Text>

//         </View>

//         {/* ===============================================
//             CLEAR CART
//         =============================================== */}

//         <TouchableOpacity
//           style={styles.clearButton}
//           onPress={clearCart}
//         >
//           <Text style={styles.clearText}>
//             Clear Cart
//           </Text>
//         </TouchableOpacity>

//         {/* ===============================================
//             CHECKOUT
//         =============================================== */}

//   <TouchableOpacity
//   style={styles.checkoutButton}
//   onPress={handleCheckout}
// >
//   <Text style={styles.checkoutText}>
//     Proceed to Checkout
//   </Text>
// </TouchableOpacity>

//       </View>
//     </View>
//   );
// }

// // ===========// STYLES// =============

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#FFFFFF',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 15,
//     color: '#777777',
//   },
//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#222222',
//   },
//   emptyText: {
//     marginTop: 8,
//     fontSize: 15,
//     color: '#777777',
//     textAlign: 'center',
//   },
//   shopButton: {
//     marginTop: 20,
//     backgroundColor: '#2E7D32',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 24,
//   },
//   shopButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 10,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#222222',
//   },
//   itemCount: {
//     marginTop: 5,
//     color: '#777777',
//     fontSize: 14,
//   },
//   list: {
//     padding: 15,
//     paddingBottom: 20,
//   },
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#EEEEEE',
//     elevation: 2,
//     shadowColor: '#000000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.08,
//     shadowRadius: 3,
//   },
//   productImage: {
//     width: 90,
//     height: 90,
//     borderRadius: 10,
//     backgroundColor: '#F7F7F7',
//   },
//   details: {
//     flex: 1,
//     marginLeft: 12,
//     paddingRight: 40,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#222222',
//   },
//   category: {
//     marginTop: 4,
//     fontSize: 13,
//     color: '#777777',
//   },
//   price: {
//     marginTop: 6,
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1C9C57',
//   },
//   quantityRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   quantityButton: {
//     width: 30,
//     height: 30,
//     borderWidth: 1,
//     borderColor: '#DDDDDD',
//     borderRadius: 6,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//   },
//   quantityText: {
//     fontSize: 20,
//     color: '#222222',
//     lineHeight: 22,
//   },
//   quantity: {
//     width: 35,
//     textAlign: 'center',
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#222222',
//   },
//  removeButton: {
//   position: 'absolute',
//   right: 12,
//   top: 12,
//   width: 36,
//   height: 36,
//   borderRadius: 18,
//   justifyContent: 'center',
//   alignItems: 'center',
//   backgroundColor: '#FFF1F1',
// },
//  bottomContainer: {
//   position: 'absolute',
//   left: 0,
//   right: 0,
//   bottom: 85,
//   borderTopWidth: 1,
//   borderTopColor: '#EEEEEE',
//   paddingHorizontal: 16,
//   paddingTop: 12,
//   paddingBottom: 12,
//   backgroundColor: '#FFFFFF',
// },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   summaryLabel: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#222222',
//   },
//   totalPrice: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1C9C57',
//   },
//   clearButton: {
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   clearText: {
//     color: '#D32F2F',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   checkoutButton: {
//     backgroundColor: '#2E7D32',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   checkoutText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '700',
//   },
// backButton: {
//   width: 40,
//   height: 40,
//   borderRadius: 20,
//   justifyContent: 'center',
//   alignItems: 'center',
//   marginRight: 10,
// },

// headerText: {
//   flex: 1,
// },
// });
import React from 'react';
import {
  ActivityIndicator,
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
import { API_BASE_URL } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useAddress } from '@/hooks/useAddress';
import { useLoginPopup } from '@/hooks/useLoginPopup';

export default function CartScreen() {
  const [removingProductId, setRemovingProductId] =
    React.useState<string | null>(null);

  const {
    cartLines,
    totalCount,
    totalPrice,
    isLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCartContext();

  const { isLoggedIn } = useAuth();
  const { selectedAddress } = useAddress();
  const { showLoginPopup } = useLoginPopup();

  // =====================================================
  // ROUTE PARAMS
  // =====================================================

  const params = useLocalSearchParams<{
    from?: string;
    productName?: string;
  }>();

  const from = params.from;

  // =====================================================
  // BACK NAVIGATION
  // =====================================================

  const handleBack = () => {
    console.log('================================');
    console.log('CART BACK PRESSED');
    console.log('FROM:', from);
    console.log('================================');

    /*
      If Cart was opened from Cart Success:

      Product Details
          ↓
      Cart Success
          ↓
      Cart
          ↓
      Back
          ↓
      Cart Success
    */

    if (from === 'cart-success') {
      router.replace({
        pathname: '/(home)/cart-success',
        params: {
          productName: params.productName || '',
        },
      });

      return;
    }

    /*
      If there is a previous screen, go back.
      Otherwise go safely to Home.
    */

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  // =====================================================
  // CHECKOUT
  // =====================================================

  const handleCheckout = () => {
    console.log('================================');
    console.log('CHECKOUT BUTTON PRESSED');
    console.log('IS LOGGED IN:', isLoggedIn);
    console.log('SELECTED ADDRESS:', selectedAddress);
    console.log('================================');

    if (!isLoggedIn) {
      console.log('USER NOT LOGGED IN');
      showLoginPopup();
      return;
    }

    if (!selectedAddress) {
      console.log('NO ADDRESS → ADD ADDRESS');

      router.push({
        pathname: '/(home)/add-address',
        params: {
          returnTo: 'cart',
        },
      });

      return;
    }

    console.log('ADDRESS EXISTS → GOING TO CHECKOUT');

    router.push({
      pathname: '/(home)/checkout',
      params: {
        from: 'cart',
      },
    });
  };

  // =====================================================
  // REMOVE PRODUCT
  // =====================================================

  const handleRemove = async (productId: string) => {
    if (removingProductId) {
      return;
    }

    try {
      setRemovingProductId(productId);

      await removeFromCart(productId);
    } catch (error) {
      console.error('HANDLE REMOVE ERROR:', error);
    } finally {
      setRemovingProductId(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#2E7D32"
        />

        <Text style={styles.loadingText}>
          Loading cart...
        </Text>
      </View>
    );
  }

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (cartLines.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>
          Your Cart is Empty
        </Text>

        <Text style={styles.emptyText}>
          Add some products to your cart.
        </Text>

        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.shopButtonText}>
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // =====================================================
  // CART ITEM
  // =====================================================

  const renderCartItem = ({
    item,
  }: {
    item: any;
  }) => {
    const product = item.product;

    const imageSource = product.image
      ? {
          uri: `${API_BASE_URL}/uploads/${product.image}?v=${Date.now()}`,
        }
      : require('@/assets/images/product1.png');

    return (
      <View style={styles.card}>
        {/* PRODUCT IMAGE */}

        <Image
          source={imageSource}
          style={styles.productImage}
          resizeMode="contain"
        />

        {/* PRODUCT DETAILS */}

        <View style={styles.details}>
          <Text
            style={styles.productName}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          <Text style={styles.category}>
            {product.category_name}
          </Text>

          <Text style={styles.price}>
            ₹{Number(product.price).toFixed(2)}
          </Text>

          {/* QUANTITY */}

          <View style={styles.quantityRow}>
            {/* MINUS */}

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() =>
                updateQuantity(
                  String(product.id),
                  item.quantity - 1
                )
              }
            >
              <Text style={styles.quantityText}>
                −
              </Text>
            </TouchableOpacity>

            {/* QUANTITY */}

            <Text style={styles.quantity}>
              {item.quantity}
            </Text>

            {/* PLUS */}

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() =>
                updateQuantity(
                  String(product.id),
                  item.quantity + 1
                )
              }
            >
              <Text style={styles.quantityText}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* REMOVE */}

        <TouchableOpacity
          style={styles.removeButton}
          disabled={
            removingProductId === String(product.id)
          }
          onPress={() =>
            handleRemove(String(product.id))
          }
        >
          {removingProductId === String(product.id) ? (
            <ActivityIndicator
              size="small"
              color="#D32F2F"
            />
          ) : (
            <Ionicons
              name="trash-outline"
              size={22}
              color="#D32F2F"
            />
          )}
        </TouchableOpacity>
      </View>
    );
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
        {/* BACK BUTTON */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#222222"
          />
        </TouchableOpacity>

        {/* TITLE */}

        <View style={styles.headerText}>
          <Text style={styles.title}>
            My Cart
          </Text>

          <Text style={styles.itemCount}>
            {totalCount} item
            {totalCount !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* =================================================
          CART LIST
      ================================================= */}

      <FlatList
        data={cartLines}
        keyExtractor={(item) =>
          String(item.productId)
        }
        renderItem={renderCartItem}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom: 220,
          },
        ]}
        showsVerticalScrollIndicator={false}
      />

      {/* =================================================
          CART SUMMARY
      ================================================= */}

      <View style={styles.bottomContainer}>
        {/* TOTAL */}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Total
          </Text>

          <Text style={styles.totalPrice}>
            ₹{totalPrice.toFixed(2)}
          </Text>
        </View>

        {/* CLEAR CART */}

        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearCart}
        >
          <Text style={styles.clearText}>
            Clear Cart
          </Text>
        </TouchableOpacity>

        {/* CHECKOUT */}

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutText}>
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
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
    padding: 20,
    backgroundColor: '#FFFFFF',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: '#777777',
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222222',
  },

  emptyText: {
    marginTop: 8,
    fontSize: 15,
    color: '#777777',
    textAlign: 'center',
  },

  shopButton: {
    marginTop: 20,
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },

  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // ===================================================
  // HEADER
  // ===================================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222222',
  },

  itemCount: {
    marginTop: 5,
    color: '#777777',
    fontSize: 14,
  },

  // ===================================================
  // LIST
  // ===================================================

  list: {
    padding: 15,
  },

  // ===================================================
  // CART CARD
  // ===================================================

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',

    elevation: 2,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },

  productImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: '#F7F7F7',
  },

  details: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 40,
  },

  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
  },

  category: {
    marginTop: 4,
    fontSize: 13,
    color: '#777777',
  },

  price: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '700',
    color: '#1C9C57',
  },

  // ===================================================
  // QUANTITY
  // ===================================================

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  quantityButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  quantityText: {
    fontSize: 20,
    color: '#222222',
    lineHeight: 22,
  },

  quantity: {
    width: 35,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
  },

  // ===================================================
  // REMOVE
  // ===================================================

  removeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF1F1',
  },

  // ===================================================
  // BOTTOM
  // ===================================================

  bottomContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 85,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  summaryLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222222',
  },

  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C9C57',
  },

  clearButton: {
    alignItems: 'center',
    marginBottom: 10,
  },

  clearText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '500',
  },

  checkoutButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  checkoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});