import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  router,
  useLocalSearchParams,
} from 'expo-router';

export default function CartSuccessScreen() {
  const params = useLocalSearchParams<{
    productName?: string;
    productId?: string;
    returnTo?: string;
  }>();

  const productName = params.productName;
  const productId = params.productId;
  const returnTo = params.returnTo;

  // =====================================================
  // BACK BUTTON
  // =====================================================

  const handleBack = () => {
    console.log('================================');
    console.log('CART SUCCESS → BACK PRESSED');
    console.log('PRODUCT ID:', productId);
    console.log('RETURN TO:', returnTo);
    console.log('================================');

    if (productId) {
      console.log(
        'GOING TO PRODUCT DETAILS:',
        productId
      );

      router.replace({
        pathname: '/(home)/product-details',
        params: {
          id: String(productId),
        },
      });

      return;
    }

    console.log(
      'PRODUCT ID NOT FOUND → USING NORMAL BACK'
    );

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  // =====================================================
  // GO TO CART
  // =====================================================

  const handleGoToCart = () => {
    console.log('CART SUCCESS → GO TO CART');

    router.push({
      pathname: '/(home)/cart',
      params: {
        from: 'cart-success',
      },
    });
  };

  // =====================================================
  // CONTINUE SHOPPING
  // =====================================================

  const handleContinueShopping = () => {
    console.log(
      'CART SUCCESS → CONTINUE SHOPPING'
    );

    router.replace('/');
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
          activeOpacity={0.8}
          onPress={handleBack}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#222222"
          />
        </TouchableOpacity>

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
          Product Added to Cart
        </Text>

        {/* MESSAGE */}

        <Text style={styles.message}>
          {productName
            ? `${productName} has been successfully added to your cart.`
            : 'The product has been successfully added to your cart.'}
        </Text>

        {/* =================================================
            GO TO CART
        ================================================= */}

        <TouchableOpacity
          style={styles.goToCartButton}
          activeOpacity={0.8}
          onPress={handleGoToCart}
        >
          <Ionicons
            name="cart-outline"
            size={22}
            color="#FFFFFF"
          />

          <Text style={styles.goToCartText}>
            Go to Cart
          </Text>
        </TouchableOpacity>

        {/* =================================================
            CONTINUE SHOPPING
        ================================================= */}

        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.8}
          onPress={handleContinueShopping}
        >
          <Text style={styles.continueText}>
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
  // =====================================================
  // CONTAINER
  // =====================================================

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // =====================================================
  // HEADER
  // =====================================================

  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // =====================================================
  // CONTENT
  // =====================================================

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingBottom: 80,
  },

  // =====================================================
  // SUCCESS ICON
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

  // =====================================================
  // TITLE
  // =====================================================

  title: {
    fontSize: 25,
    fontFamily: 'InterBold',
    color: '#222222',
    textAlign: 'center',
  },

  // =====================================================
  // MESSAGE
  // =====================================================

  message: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'InterRegular',
    color: '#777777',
    textAlign: 'center',
    maxWidth: 330,
  },

  // =====================================================
  // GO TO CART BUTTON
  // =====================================================

  goToCartButton: {
    width: '90%',
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1C9C57',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
  },

  goToCartText: {
    marginLeft: 9,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'InterBold',
  },

  // =====================================================
  // CONTINUE SHOPPING
  // =====================================================

  continueButton: {
    width: '90%',
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: '#1C9C57',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },

  continueText: {
    color: '#1C9C57',
    fontSize: 16,
    fontFamily: 'InterBold',
  },
});

