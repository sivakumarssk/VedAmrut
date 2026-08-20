import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    SafeAreaView,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';

import ScreenHeader from '../../src/components/common/ScreenHeader';
import { TAB_BAR_BOTTOM_MARGIN, TAB_BAR_HEIGHT } from '../../src/constants/Layout';
import { useAddress } from '../../src/hooks/useAddress';
import { useAuth } from '../../src/hooks/useAuth';
import { useCart } from '../../src/hooks/useCart';
import { useLoginPopup } from '../../src/hooks/useLoginPopup';

const DELIVERY_FEE = 0;
const FOOTER_HEIGHT = 100;
const FOOTER_GAP_ABOVE_TAB_BAR = 16;

export default function CartScreen() {
  const { cartLines, totalPrice, updateQuantity, removeFromCart } = useCart();
  const { selectedAddress } = useAddress();
  const { isLoggedIn } = useAuth();
  const { showLoginPopup } = useLoginPopup();
  const insets = useSafeAreaInsets();
  const tabBarClearance = insets.bottom + TAB_BAR_BOTTOM_MARGIN + TAB_BAR_HEIGHT;

  const handleDeliveryPress = () => {
    if (!isLoggedIn) {
      showLoginPopup();
      return;
    }
    router.push('/(home)/saved-addresses');
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      showLoginPopup();
      return;
    }
    if (!selectedAddress) {
      router.push('/(home)/add-address');
      return;
    }
    // proceed to checkout
  };

  const itemCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const totalPayment = totalPrice + DELIVERY_FEE;

  const deliveryLabel = selectedAddress
    ? `Delivary to : ${selectedAddress.city} - ${selectedAddress.pincode}`
    : 'Add a delivery address';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="My Cart" titleStyle={styles.title} />

      {cartLines.length === 0 ? (
        <View
          style={[styles.emptyContainer, { paddingBottom: tabBarClearance }]}
        >
          <Ionicons name="cart-outline" size={56} color="#B5B5B5" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push('/(home)/home')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cartLines}
          keyExtractor={(line) => line.productId}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom:
                tabBarClearance + FOOTER_GAP_ABOVE_TAB_BAR + FOOTER_HEIGHT,
            },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <TouchableOpacity
                style={styles.deliveryRow}
                onPress={handleDeliveryPress}
              >
                <Text style={styles.deliveryText} numberOfLines={1}>
                  {deliveryLabel}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#222" />
                <View style={styles.changeButton}>
                  <Text style={styles.changeText}>
                    {selectedAddress ? 'Change' : 'Add'}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.summaryCard}>
                <View style={styles.summaryHeaderRow}>
                  <Text style={styles.summaryHeading}>Order Summary</Text>
                  <View style={styles.itemCountBadge}>
                    <Text style={styles.itemCountText}>
                      {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                    </Text>
                  </View>
                </View>
                <View style={styles.summaryDivider} />
              </View>
            </>
          }
          renderItem={({ item }) => (
            <View style={styles.cartRow}>
              <Image
                source={item.product.image}
                resizeMode="contain"
                style={styles.image}
              />

              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.product.name.replace('\n', ' ')}
                </Text>
                <Text style={styles.price}>
                  ₹{item.product.price.toFixed(2)}
                </Text>

                <View style={styles.quantityRow}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                  >
                    <Ionicons name="remove" size={16} color="#222" />
                  </TouchableOpacity>

                  <Text style={styles.qtyText}>{item.quantity}</Text>

                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    <Ionicons name="add" size={16} color="#222" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => removeFromCart(item.productId)}
                style={styles.removeButton}
              >
                <Ionicons name="trash-outline" size={18} color="#E36B1E" />
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.summaryCardFooter}>
              <View style={styles.summaryLineRow}>
                <Text style={styles.summaryLineLabel}>Subtotal</Text>
                <Text style={styles.summaryLineValue}>
                  ₹{totalPrice.toFixed(2)}
                </Text>
              </View>

              <View style={styles.summaryLineRow}>
                <Text style={styles.summaryLineLabel}>Delivery fee</Text>
                <Text style={styles.summaryLineValue}>
                  {DELIVERY_FEE.toFixed(2)}
                </Text>
              </View>

              <View style={styles.dashedDivider} />

              <View style={styles.summaryLineRow}>
                <Text style={styles.totalLabel}>Total Payment</Text>
                <Text style={styles.totalValue}>
                  ₹{totalPayment.toFixed(2)}
                </Text>
              </View>
            </View>
          }
        />
      )}

      {cartLines.length > 0 && (
        <View
          style={[
            styles.footer,
            { bottom: tabBarClearance + FOOTER_GAP_ABOVE_TAB_BAR },
          ]}
        >
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 26,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 12,
  },
  shopButton: {
    marginTop: 20,
    backgroundColor: '#1C9C57',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  deliveryText: {
    flex: 1,
    fontSize: 14,
    color: '#222',
  },
  changeButton: {
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#1C6FD9',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  changeText: {
    color: '#1C6FD9',
    fontWeight: '600',
    fontSize: 13,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  summaryHeading: {
    fontSize: 19,
    fontWeight: '700',
    color: '#222',
  },
  itemCountBadge: {
    backgroundColor: '#EDEDED',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  itemCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginTop: 16,
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  image: {
    width: 64,
    height: 64,
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E37A1E',
    marginTop: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    marginHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FBE3D1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCardFooter: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  summaryLineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLineLabel: {
    fontSize: 15,
    color: '#444',
  },
  summaryLineValue: {
    fontSize: 15,
    color: '#222',
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: '#DDD',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#E37A1E',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  checkoutButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E37A1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
