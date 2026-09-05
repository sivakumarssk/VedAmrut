import React, { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import { API_BASE_URL } from '@/constants/api';
import { getToken } from '@/utils/storage';

// =====================================================
// TYPES
// =====================================================

type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: string;
  created_at: string;
  name: string;
  image: string | null;
};

type Order = {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address_line: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  total_amount: string;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
};

// =====================================================
// STATUS STEPS
// =====================================================

const statusSteps = [
  {
    key: 'pending',
    title: 'Order Placed',
    icon: 'receipt-outline' as const,
  },
  {
    key: 'confirmed',
    title: 'Order Confirmed',
    icon: 'checkmark-circle-outline' as const,
  },
  {
    key: 'processing',
    title: 'Processing',
    icon: 'cube-outline' as const,
  },
  {
    key: 'shipped',
    title: 'Shipped',
    icon: 'car-outline' as const,
  },
  {
    key: 'delivered',
    title: 'Delivered',
    icon: 'checkmark-done-circle-outline' as const,
  },
];

// =====================================================
// SCREEN
// =====================================================

export default function OrderDetailsScreen() {
  const { orderId, from, origin } = useLocalSearchParams<{
  orderId?: string;
  from?: string;
  origin?: string;
}>();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');

  // =====================================================
  // FETCH ORDER
  // =====================================================

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');

      if (!orderId) {
        throw new Error('Order ID is missing');
      }

      const token = await getToken();

      if (!token) {
        throw new Error('Please login again');
      }

      const url =
        `${API_BASE_URL}/api/orders/${orderId}`;

      console.log('================================');
      console.log('FETCH ORDER DETAILS');
      console.log('ORDER ID:', orderId);
      console.log('URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(
        'ORDER DETAILS STATUS:',
        response.status
      );

      const result = await response.json();

      console.log(
        'ORDER DETAILS RESPONSE:',
        JSON.stringify(result, null, 2)
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            'Failed to fetch order'
        );
      }

      setOrder(result.data);
    } catch (err) {
      console.error(
        'FETCH ORDER DETAILS ERROR:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch order'
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CANCEL ORDER
  // =====================================================

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancelling(true);
              setError('');

              if (!orderId) {
                throw new Error(
                  'Order ID is missing'
                );
              }

              const token = await getToken();

              if (!token) {
                throw new Error(
                  'Please login again'
                );
              }

              const response = await fetch(
                `${API_BASE_URL}/api/orders/${orderId}/cancel`,
                {
                  method: 'PUT',
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                    'Content-Type':
                      'application/json',
                  },
                }
              );

              const result =
                await response.json();

              console.log(
                'CANCEL ORDER RESPONSE:',
                JSON.stringify(
                  result,
                  null,
                  2
                )
              );

              if (
                !response.ok ||
                !result.success
              ) {
                throw new Error(
                  result.message ||
                    'Failed to cancel order'
                );
              }

              const updatedOrder =
                result.data?.order ||
                result.data;

              if (updatedOrder) {
                setOrder(updatedOrder);
              }

              Alert.alert(
                'Order Cancelled',
                'Your order has been cancelled successfully.'
              );
            } catch (err) {
              console.error(
                'CANCEL ORDER ERROR:',
                err
              );

              Alert.alert(
                'Unable to Cancel',
                err instanceof Error
                  ? err.message
                  : 'Failed to cancel order'
              );
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  // =====================================================
  // LOAD WHEN SCREEN FOCUSES
  // =====================================================

  useFocusEffect(
    useCallback(() => {
      fetchOrder();
    }, [orderId])
  );

  // =====================================================
  // CORRECT BACK NAVIGATION
  // =====================================================

  // const handleBack = () => {
  //   console.log(
  //     'ORDER DETAILS BACK PRESSED'
  //   );

  //   console.log('FROM:', from);
  //   console.log('ORDER ID:', orderId);

  //   // Coming from My Orders
  //   if (from === 'my-orders') {
  //     router.replace('/(home)/my-orders');
  //     return;
  //   }

  //   // Coming directly from Order Success
  //   if (from === 'order-success') {
  //     router.replace('/(home)/order-success');
  //     return;
  //   }

  //   // Coming from Home
  //   if (from === 'home') {
  //     router.replace('/(home)/home');
  //     return;
  //   }

  //   // Default
  //   router.replace('/(home)/my-orders');
  // };
const handleBack = () => {
  console.log('================================');
  console.log('ORDER DETAILS BACK PRESSED');
  console.log('ORDER ID:', orderId);
  console.log('FROM:', from);
  console.log('ORIGIN:', origin);

  // Order Details was opened from My Orders
  // Go back to My Orders and preserve the original source
  if (from === 'my-orders') {
    router.replace({
      pathname: '/(home)/my-orders',
      params: {
        from: origin || 'profile',
      },
    });
    return;
  }

  // Directly opened from Order Success
  if (from === 'order-success') {
    router.replace('/(home)/order-success');
    return;
  }

  // Directly opened from Home
  if (from === 'home') {
    router.replace('/(home)/home');
    return;
  }

  // Directly opened from Profile
  if (from === 'profile') {
    router.replace('/(home)/profile');
    return;
  }

  // Safe default
  router.replace('/(home)/my-orders');
};
  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    dateString: string
  ) => {
    const date = new Date(dateString);

    return date.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  // =====================================================
  // STATUS COLOR
  // =====================================================

  const getStatusColor = (
    status?: string
  ) => {
    switch (
      String(status || '').toLowerCase()
    ) {
      case 'pending':
        return '#F59E0B';

      case 'confirmed':
        return '#2563EB';

      case 'processing':
        return '#7C3AED';

      case 'shipped':
        return '#0891B2';

      case 'delivered':
        return '#1C9C57';

      case 'cancelled':
        return '#DC2626';

      default:
        return '#777777';
    }
  };

  // =====================================================
  // STATUS INDEX
  // =====================================================

  const getStatusIndex = (
    status?: string
  ) => {
    const normalizedStatus =
      String(status || '').toLowerCase();

    const index =
      statusSteps.findIndex(
        step =>
          step.key === normalizedStatus
      );

    return index === -1
      ? 0
      : index;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <View style={styles.container}>
        <Header onBack={handleBack} />

        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#1C9C57"
          />

          <Text style={styles.loadingText}>
            Loading order details...
          </Text>
        </View>
      </View>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !order) {
    return (
      <View style={styles.container}>
        <Header onBack={handleBack} />

        <View style={styles.center}>
          <Ionicons
            name="alert-circle-outline"
            size={60}
            color="#DC2626"
          />

          <Text style={styles.errorTitle}>
            Unable to load order
          </Text>

          <Text style={styles.errorText}>
            {error || 'Order not found'}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchOrder}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // =====================================================
  // STATUS
  // =====================================================

  const statusColor =
    getStatusColor(order.status);

  const currentIndex =
    getStatusIndex(order.status);

  const normalizedStatus =
    String(order.status || '').toLowerCase();

  const canCancelOrder =
    [
      'pending',
      'confirmed',
      'processing',
      'shipped',
    ].includes(normalizedStatus);

  // =====================================================
  // SCREEN
  // =====================================================

  return (
    <View style={styles.container}>
      <Header onBack={handleBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* ORDER HEADER */}

        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderTitle}>
              Order #{order.id}
            </Text>

            <Text style={styles.orderDate}>
              Placed on{' '}
              {formatDate(
                order.created_at
              )}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  `${statusColor}15`,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: statusColor,
                },
              ]}
            >
              {String(order.status || '')
                .charAt(0)
                .toUpperCase() +
                String(order.status || '')
                  .slice(1)}
            </Text>
          </View>
        </View>

        {/* ORDER STATUS */}

        <Text style={styles.sectionTitle}>
          Order Status
        </Text>

        <View style={styles.timelineCard}>
          {normalizedStatus ===
          'cancelled' ? (
            <View
              style={
                styles.cancelledContainer
              }
            >
              <View
                style={
                  styles.cancelledIcon
                }
              >
                <Ionicons
                  name="close-circle-outline"
                  size={28}
                  color="#DC2626"
                />
              </View>

              <View
                style={
                  styles.cancelledDetails
                }
              >
                <Text
                  style={
                    styles.cancelledTitle
                  }
                >
                  Order Cancelled
                </Text>

                <Text
                  style={
                    styles.cancelledSub
                  }
                >
                  This order has been
                  cancelled.
                </Text>
              </View>
            </View>
          ) : (
            statusSteps.map(
              (step, index) => {
                const isCompleted =
                  index <= currentIndex;

                const isCurrent =
                  index === currentIndex;

                const isLast =
                  index ===
                  statusSteps.length - 1;

                return (
                  <View
                    key={step.key}
                    style={
                      styles.timelineRow
                    }
                  >
                    <View
                      style={
                        styles.timelineLeft
                      }
                    >
                      <View
                        style={[
                          styles.timelineCircle,
                          isCompleted &&
                            styles.timelineCircleActive,
                        ]}
                      >
                        <Ionicons
                          name={step.icon}
                          size={18}
                          color={
                            isCompleted
                              ? '#FFFFFF'
                              : '#AAAAAA'
                          }
                        />
                      </View>

                      {!isLast && (
                        <View
                          style={[
                            styles.timelineLine,
                            index <
                              currentIndex &&
                              styles.timelineLineActive,
                          ]}
                        />
                      )}
                    </View>

                    <View
                      style={
                        styles.timelineContent
                      }
                    >
                      <Text
                        style={[
                          styles.timelineTitle,
                          isCompleted &&
                            styles.timelineTitleActive,
                        ]}
                      >
                        {step.title}
                      </Text>

                      {isCurrent && (
                        <Text
                          style={
                            styles.timelineCurrent
                          }
                        >
                          Current Status
                        </Text>
                      )}

                      {!isCurrent &&
                        isCompleted && (
                          <Text
                            style={
                              styles.timelineCompleted
                            }
                          >
                            Completed
                          </Text>
                        )}

                      {!isCompleted && (
                        <Text
                          style={
                            styles.timelineWaiting
                          }
                        >
                          Waiting
                        </Text>
                      )}
                    </View>
                  </View>
                );
              }
            )
          )}
        </View>

        {/* PRODUCTS */}

        <Text style={styles.sectionTitle}>
          Order Items
        </Text>

        <View style={styles.card}>
          {order.items &&
          order.items.length > 0 ? (
            order.items.map(
              (item, index) => {
                const imageSource =
                  item.image
                    ? {
                        uri:
                          `${API_BASE_URL}/uploads/${item.image}`,
                      }
                    : require('@/assets/images/product1.png');

                const itemTotal =
                  Number(item.price) *
                  Number(item.quantity);

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.productRow,
                      index <
                        order.items.length -
                          1 &&
                        styles.productBorder,
                    ]}
                  >
                    <Image
                      source={imageSource}
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
                        {item.name}
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
                          styles.productPrice
                        }
                      >
                        ₹
                        {itemTotal.toFixed(
                          2
                        )}
                      </Text>
                    </View>
                  </View>
                );
              }
            )
          ) : (
            <Text
              style={
                styles.noItemsText
              }
            >
              No order items found.
            </Text>
          )}
        </View>

        {/* DELIVERY ADDRESS */}

        <Text style={styles.sectionTitle}>
          Delivery Address
        </Text>

        <View style={styles.card}>
          <View
            style={
              styles.addressHeader
            }
          >
            <View
              style={
                styles.locationIcon
              }
            >
              <Ionicons
                name="location"
                size={20}
                color="#1C9C57"
              />
            </View>

            <Text
              style={styles.addressName}
            >
              {order.full_name}
            </Text>
          </View>

          <Text
            style={styles.addressText}
          >
            {order.address_line}
          </Text>

          <Text
            style={styles.addressText}
          >
            {order.city},{' '}
            {order.state} -{' '}
            {order.pincode}
          </Text>

          <Text style={styles.phoneText}>
            Phone: {order.phone}
          </Text>
        </View>

        {/* PAYMENT */}

        <Text style={styles.sectionTitle}>
          Payment Information
        </Text>

        <View style={styles.card}>
          <View
            style={styles.paymentRow}
          >
            <View
              style={
                styles.paymentLeft
              }
            >
              <Ionicons
                name="card-outline"
                size={20}
                color="#1C9C57"
              />

              <Text
                style={
                  styles.paymentLabel
                }
              >
                Payment Method
              </Text>
            </View>

            <Text
              style={
                styles.paymentValue
              }
            >
              {order.payment_method}
            </Text>
          </View>
        </View>

        {/* PRICE */}

        <Text style={styles.sectionTitle}>
          Price Details
        </Text>

        <View style={styles.card}>
          <View
            style={styles.priceRow}
          >
            <Text
              style={styles.priceLabel}
            >
              Items Total
            </Text>

            <Text
              style={styles.priceValue}
            >
              ₹
              {Number(
                order.total_amount
              ).toFixed(2)}
            </Text>
          </View>

          <View
            style={styles.priceRow}
          >
            <Text
              style={styles.priceLabel}
            >
              Delivery Charges
            </Text>

            <Text
              style={styles.freeText}
            >
              FREE
            </Text>
          </View>

          <View
            style={styles.divider}
          />

          <View
            style={styles.totalRow}
          >
            <Text
              style={styles.totalLabel}
            >
              Total Amount
            </Text>

            <Text
              style={styles.totalAmount}
            >
              ₹
              {Number(
                order.total_amount
              ).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* CANCEL */}

        {canCancelOrder && (
          <TouchableOpacity
            style={[
              styles.cancelButton,
              cancelling && {
                opacity: 0.6,
              },
            ]}
            onPress={handleCancelOrder}
            activeOpacity={0.8}
            disabled={cancelling}
          >
            {cancelling ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="#DC2626"
                />

                <Text
                  style={
                    styles.cancelButtonText
                  }
                >
                  Cancelling...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="close-circle-outline"
                  size={20}
                  color="#DC2626"
                />

                <Text
                  style={
                    styles.cancelButtonText
                  }
                >
                  Cancel Order
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* BACK TO MY ORDERS */}

        {/* <TouchableOpacity
          style={styles.ordersButton}
          onPress={() => {
            console.log(
              'ORDER DETAILS -> MY ORDERS'
            );

            router.replace(
              '/(home)/my-orders'
            );
          }}
          activeOpacity={0.8}
        >
          <Text
            style={
              styles.ordersButtonText
            }
          >
            View My Orders
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
  style={styles.ordersButton}
  onPress={() => {
    console.log('================================');
    console.log('ORDER DETAILS -> MY ORDERS');
    console.log('ORIGIN:', origin);

    router.replace({
      pathname: '/(home)/my-orders',
      params: {
        from: origin || 'profile',
      },
    });
  }}
  activeOpacity={0.8}
>
  <Text style={styles.ordersButtonText}>
    View My Orders
  </Text>
</TouchableOpacity>

        <View
          style={styles.bottomSpace}
        />
      </ScrollView>
    </View>
  );
}

// =====================================================
// HEADER
// =====================================================

function Header({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <Ionicons
          name="arrow-back"
          size={22}
          color="#222222"
        />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>
        Order Details
      </Text>

      <View style={styles.headerSpacer} />
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

  // =========================
  // HEADER
  // =========================

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
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontFamily: 'InterBold',
    color: '#222222',
    marginLeft:-110
  },

  headerSpacer: {
    width: 38,
  },

  // =========================
  // CONTENT
  // =========================

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  // =========================
  // ORDER HEADER
  // =========================

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  orderTitle: {
    fontSize: 20,
    fontFamily: 'InterBold',
    color: '#222222',
  },

  orderDate: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'InterRegular',
    color: '#777777',
  },

  statusBadge: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontFamily: 'InterBold',
  },

  // =========================
  // SECTION TITLE
  // =========================

  sectionTitle: {
    marginTop: 18,
    marginBottom: 11,
    fontSize: 17,
    fontFamily: 'InterBold',
    color: '#222222',
  },

  // =========================
  // ORDER STATUS TIMELINE
  // =========================

  timelineCard: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },

  timelineRow: {
    flexDirection: 'row',
    minHeight: 76,
  },

  timelineLeft: {
    width: 40,
    alignItems: 'center',
    position: 'relative',
  },

  timelineCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  timelineCircleActive: {
    backgroundColor: '#1C9C57',
  },

  timelineLine: {
    position: 'absolute',
    top: 36,
    bottom: 0,
    width: 2,
    backgroundColor: '#E5E5E5',
  },

  timelineLineActive: {
    backgroundColor: '#1C9C57',
  },

  timelineContent: {
    flex: 1,
    marginLeft: 12,
    paddingTop: 2,
  },

  timelineTitle: {
    fontSize: 14,
    fontFamily: 'InterMedium',
    color: '#999999',
  },

  timelineTitleActive: {
    color: '#222222',
    fontFamily: 'InterBold',
  },

  timelineCurrent: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'InterSemiBold',
    color: '#1C9C57',
  },

  timelineCompleted: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'InterRegular',
    color: '#777777',
  },

  timelineWaiting: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'InterRegular',
    color: '#AAAAAA',
  },

  // =========================
  // CANCELLED
  // =========================

  cancelledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },

  cancelledIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#FEECEC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelledDetails: {
    flex: 1,
    marginLeft: 12,
  },

  cancelledTitle: {
    fontSize: 15,
    fontFamily: 'InterBold',
    color: '#DC2626',
  },

  cancelledSub: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'InterRegular',
    color: '#777777',
  },

  // =========================
  // COMMON CARD
  // =========================

  card: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 14,
    padding: 15,
    backgroundColor: '#FFFFFF',
  },

  // =========================
  // PRODUCTS
  // =========================

  productRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },

  productBorder: {
    paddingBottom: 14,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  productImage: {
    width: 75,
    height: 75,
    borderRadius: 10,
    backgroundColor: '#F7F7F7',
  },

  productDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },

  productName: {
    fontSize: 15,
    fontFamily: 'InterBold',
    color: '#222222',
  },

  quantity: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: 'InterRegular',
    color: '#777777',
  },

  productPrice: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'InterBold',
    color: '#1C9C57',
  },

  noItemsText: {
    fontSize: 13,
    fontFamily: 'InterRegular',
    color: '#777777',
  },

  // =========================
  // DELIVERY ADDRESS
  // =========================

  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  locationIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E9FBF0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addressName: {
    marginLeft: 10,
    fontSize: 15,
    fontFamily: 'InterBold',
    color: '#222222',
  },

  addressText: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: 'InterRegular',
    color: '#555555',
  },

  phoneText: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'InterRegular',
    color: '#777777',
  },

  // =========================
  // PAYMENT
  // =========================

  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  paymentLabel: {
    marginLeft: 9,
    fontSize: 14,
    fontFamily: 'InterRegular',
    color: '#555555',
  },

  paymentValue: {
    fontSize: 14,
    fontFamily: 'InterBold',
    color: '#222222',
  },

  // =========================
  // PRICE DETAILS
  // =========================

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

  // =========================
  // CANCEL ORDER
  // =========================

  cancelButton: {
    marginTop: 24,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#DC2626',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    marginLeft: 8,
    color: '#DC2626',
    fontSize: 15,
    fontFamily: 'InterBold',
  },

  // =========================
  // MY ORDERS BUTTON
  // =========================

  ordersButton: {
    marginTop: 14,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1C9C57',
    justifyContent: 'center',
    alignItems: 'center',
  },

  ordersButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'InterBold',
  },

  // =========================
  // LOADING / ERROR
  // =========================

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'InterRegular',
    color: '#777777',
  },

  errorTitle: {
    marginTop: 15,
    fontSize: 19,
    fontFamily: 'InterBold',
    color: '#222222',
    textAlign: 'center',
  },

  errorText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'InterRegular',
    color: '#777777',
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 20,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#1C9C57',
    justifyContent: 'center',
    alignItems: 'center',
  },

  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'InterBold',
  },

  // =========================
  // BOTTOM SPACE
  // =========================

  bottomSpace: {
    height: 30,
  },
});
