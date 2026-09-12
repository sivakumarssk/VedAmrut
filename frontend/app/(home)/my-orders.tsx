import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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

type Order = {
  id: number;
  total_amount: string;
  payment_method: string;
  status: string;
  created_at: string;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
};

export default function MyOrdersScreen() {
  // const { from } = useLocalSearchParams<{
  //   from?: string;
  // }>();
  const {
  from,
  orderSource,
  productId,
} = useLocalSearchParams<{
  from?: string;
  orderSource?: string;
  productId?: string;
}>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const token = await getToken();

      if (!token) {
        setError('Please login again.');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/orders/my-orders`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Failed to fetch orders'
        );
      }

      setOrders(result.data || []);
    } catch (err) {
      console.error('FETCH ORDERS ERROR:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch orders'
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REFRESH WHEN SCREEN FOCUSES
  // =====================================================

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  // =====================================================
  // CORRECT BACK NAVIGATION
  // =====================================================
// const handleBack = () => {
//   console.log('MY ORDERS BACK PRESSED');
//   console.log('FROM:', from);

//   if (from === 'order-success') {
//     router.replace('/(home)/order-success');
//     return;
//   }

//   if (from === 'profile') {
//     router.replace('/(home)/profile');
//     return;
//   }

//   // Default fallback
//   router.replace('/(home)/profile');
// };
const handleBack = () => {
  console.log('MY ORDERS BACK PRESSED');
  console.log('FROM:', from);
  console.log('ORDER SOURCE:', orderSource);
  console.log('PRODUCT ID:', productId);

  if (from === 'order-success') {
    router.replace({
      pathname: '/(home)/order-success',
      params: {
        from: orderSource || '',
        productId: productId || '',
      },
    });

    return;
  }

  if (from === 'profile') {
    router.replace('/(home)/profile');
    return;
  }

  router.replace('/(home)/profile');
};
  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // =====================================================
  // STATUS COLOR
  // =====================================================

  const getStatusColor = (status: string) => {
    switch (String(status || '').toLowerCase()) {
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
  // OPEN ORDER DETAILS
  // =====================================================

  // const openOrderDetails = (order: Order) => {
  //   console.log('OPENING ORDER DETAILS:', order.id);

  //   router.push({
  //     pathname: '/(home)/order-details',
  //     params: {
  //       orderId: String(order.id),
  //       from: 'my-orders',
  //     },
  //   });
  // };
const openOrderDetails = (order: Order) => {
  console.log('================================');
  console.log('OPENING ORDER DETAILS');
  console.log('ORDER ID:', order.id);
  console.log('MY ORDERS FROM:', from);

  router.push({
    pathname: '/(home)/order-details',
    params: {
      orderId: String(order.id),
      from: 'my-orders',
      origin: from || 'profile',
    },
  });
};
  // =====================================================
  // ORDER CARD
  // =====================================================

  const renderOrder = ({ item }: { item: Order }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.orderCard}
        onPress={() => openOrderDetails(item)}
      >
        <View style={styles.topRow}>
          <View>
            <Text style={styles.orderLabel}>
              Order #{item.id}
            </Text>

            <Text style={styles.date}>
              {formatDate(item.created_at)}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: `${statusColor}15`,
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
              {String(item.status || '')
                .charAt(0)
                .toUpperCase() +
                String(item.status || '').slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons
              name="cash-outline"
              size={18}
              color="#1C9C57"
            />

            <View>
              <Text style={styles.infoLabel}>
                Total
              </Text>

              <Text style={styles.infoValue}>
                ₹{Number(item.total_amount).toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons
              name="card-outline"
              size={18}
              color="#1C9C57"
            />

            <View>
              <Text style={styles.infoLabel}>
                Payment
              </Text>

              <Text style={styles.infoValue}>
                {item.payment_method}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.addressRow}>
          <Ionicons
            name="location-outline"
            size={18}
            color="#777777"
          />

          {/* <Text
            style={styles.address}
            numberOfLines={2}
          >
            {item.address_line}, {item.city},{' '}
            {item.state} - {item.pincode}
          </Text> */}
          <Text
  style={styles.address}
  numberOfLines={2}
>
  {[item.address_line, item.city, item.state, item.pincode]
    .filter((value) => value && value.trim())
    .join(', ')}
</Text>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.viewDetails}>
            View Order Details
          </Text>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#1C9C57"
          />
        </View>
      </TouchableOpacity>
    );
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
            Loading your orders...
          </Text>
        </View>
      </View>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <View style={styles.container}>
        <Header onBack={handleBack} />

        <View style={styles.center}>
          <Ionicons
            name="alert-circle-outline"
            size={60}
            color="#DC2626"
          />

          <Text style={styles.title}>
            Something went wrong
          </Text>

          <Text style={styles.subtitle}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchOrders}
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
  // EMPTY
  // =====================================================

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <Header onBack={handleBack} />

        <View style={styles.center}>
          <Ionicons
            name="bag-outline"
            size={70}
            color="#B5B5B5"
          />

          <Text style={styles.title}>
            No Orders Yet
          </Text>

          <Text style={styles.subtitle}>
            Your placed orders will appear here.
          </Text>

          <TouchableOpacity
            style={styles.shopButton}
            onPress={() =>
              router.replace('/(home)/home')
            }
          >
            <Text style={styles.shopButtonText}>
              Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // =====================================================
  // SCREEN
  // =====================================================

  return (
    <View style={styles.container}>
      <Header onBack={handleBack} />

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderOrder}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
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
          color="#222"
        />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>
        My Orders
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
    // borderBottomWidth: 1,
    // borderBottomColor: '#EEEEEE',
    marginTop:30
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
    marginLeft:-120
  },

  headerSpacer: {
    width: 38,
  },

  // =========================
  // ORDER LIST
  // =========================

  listContent: {
    padding: 16,
    paddingBottom: 30,
  },

  orderCard: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  orderLabel: {
    fontSize: 16,
    fontFamily: 'InterBold',
    color: '#222222',
  },

  date: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'InterRegular',
    color: '#888888',
  },

  // =========================
  // STATUS
  // =========================

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontFamily: 'InterBold',
  },

  // =========================
  // DIVIDER
  // =========================

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 14,
  },

  // =========================
  // ORDER INFO
  // =========================

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },

  infoLabel: {
    fontSize: 11,
    fontFamily: 'InterRegular',
    color: '#888888',
  },

  infoValue: {
    marginTop: 2,
    fontSize: 14,
    fontFamily: 'InterBold',
    color: '#222222',
  },

  // =========================
  // ADDRESS
  // =========================

  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },

  address: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'InterRegular',
    color: '#666666',
  },

  // =========================
  // VIEW DETAILS
  // =========================

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  viewDetails: {
    fontSize: 13,
    fontFamily: 'InterBold',
    color: '#1C9C57',
    marginRight: 4,
  },

  // =========================
  // CENTER STATES
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

  title: {
    marginTop: 15,
    fontSize: 20,
    fontFamily: 'InterBold',
    color: '#222222',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'InterRegular',
    color: '#777777',
    textAlign: 'center',
  },

  // =========================
  // RETRY BUTTON
  // =========================

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
  // SHOP BUTTON
  // =========================

  shopButton: {
    marginTop: 20,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#1C9C57',
    justifyContent: 'center',
    alignItems: 'center',
  },

  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'InterBold',
  },
});

