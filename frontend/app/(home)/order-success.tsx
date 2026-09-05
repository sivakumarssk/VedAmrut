import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

export default function OrderSuccessScreen() {
  const {
    orderId,
    totalAmount,
    paymentMethod,
  } = useLocalSearchParams<{
    orderId?: string;
    totalAmount?: string;
    paymentMethod?: string;
  }>();

  // =====================================================
  // VIEW MY ORDERS
  // =====================================================

 const handleViewMyOrders = () => {
  console.log('ORDER SUCCESS -> MY ORDERS');

  router.push({
    pathname: '/(home)/my-orders',
    params: {
      from: 'order-success',
      orderId: String(orderId || ''),
    },
  });
};
  // =====================================================
  // BACK BUTTON
  // =====================================================
const handleBack = () => {
  router.replace('/(home)/product-details');
};
 

  // =====================================================
  // CONTINUE SHOPPING
  // =====================================================

  const handleContinueShopping = () => {
    console.log(
      'ORDER SUCCESS -> HOME'
    );

    router.push('/(home)/home');
  };

  return (
    <View style={styles.container}>
      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
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
          Order Success
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* =================================================
          SUCCESS CONTENT
      ================================================= */}

      <View style={styles.content}>
        {/* SUCCESS ICON */}

        <View style={styles.successCircle}>
          <Ionicons
            name="checkmark"
            size={55}
            color="#FFFFFF"
          />
        </View>

        {/* TITLE */}

        <Text style={styles.title}>
          Order Placed Successfully!
        </Text>

        <Text style={styles.subtitle}>
          Thank you for your order.
        </Text>

        {/* ORDER DETAILS */}

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>
              Order ID
            </Text>

            <Text style={styles.value}>
              #{orderId || ''}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>
              Total Amount
            </Text>

            <Text style={styles.amount}>
              ₹
              {Number(
                totalAmount || 0
              ).toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>
              Payment Method
            </Text>

            <Text style={styles.value}>
              {paymentMethod || ''}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>
              Status
            </Text>

            <Text style={styles.pending}>
              Pending
            </Text>
          </View>
        </View>

        {/* =================================================
            MESSAGE
        ================================================= */}

        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#1C9C57"
          />

          <Text style={styles.infoText}>
            Your order has been received and will
            be processed shortly.
          </Text>
        </View>

        {/* =================================================
            VIEW MY ORDERS
        ================================================= */}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleViewMyOrders}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>
            View My Orders
          </Text>
        </TouchableOpacity>

        {/* =================================================
            CONTINUE SHOPPING
        ================================================= */}

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleContinueShopping}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>
            Continue Shopping
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

  // =====================================================
  // HEADER
  // =====================================================

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

  // =====================================================
  // CONTENT
  // =====================================================

  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  // =====================================================
  // SUCCESS
  // =====================================================

  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1C9C57',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },

  title: {
    fontSize: 24,
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

  // =====================================================
  // CARD
  // =====================================================

  card: {
    width: '100%',
    marginTop: 30,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 32,
  },

  label: {
    fontSize: 14,
    fontFamily: 'InterRegular',
    color: '#666666',
  },

  value: {
    fontSize: 14,
    fontFamily: 'InterBold',
    color: '#222222',
  },

  amount: {
    fontSize: 17,
    fontFamily: 'InterBold',
    color: '#1C9C57',
  },

  pending: {
    fontSize: 14,
    fontFamily: 'InterBold',
    color: '#E68A00',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 8,
  },

  // =====================================================
  // INFO
  // =====================================================

  infoBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F3FFF7',
  },

  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'InterRegular',
    color: '#555555',
  },

  // =====================================================
  // PRIMARY BUTTON
  // =====================================================

  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1C9C57',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'InterBold',
  },

  // =====================================================
  // SECONDARY BUTTON
  // =====================================================

  secondaryButton: {
    marginTop: 15,
    paddingVertical: 12,
  },

  secondaryButtonText: {
    color: '#1C9C57',
    fontSize: 15,
    fontFamily: 'InterSemiBold',
  },
});