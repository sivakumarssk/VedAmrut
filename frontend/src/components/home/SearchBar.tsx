import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { API_BASE_URL } from '@/constants/api';

type Product = {
  id: number | string;
  name: string;
};

export default function SearchBar() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ==========================================
  // FETCH PRODUCT NAMES
  // ==========================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products`
        );

        const result = await response.json();

        console.log(
          'SEARCH BAR PRODUCTS:',
          result
        );

        if (
          response.ok &&
          result.success &&
          Array.isArray(result.data)
        ) {
          // Only keep products that have a name
          const productNames = result.data
            .filter(
              (item: Product) =>
                item.name &&
                item.name.trim() !== ''
            )
            .map((item: Product) => ({
              id: item.id,
              name: item.name,
            }));

          setProducts(productNames);
        }
      } catch (error) {
        console.error(
          'Search bar product error:',
          error
        );
      }
    };

    fetchProducts();
  }, []);

  // ==========================================
  // CHANGE PRODUCT NAME
  // ==========================================

  useEffect(() => {
    if (products.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((previousIndex) => {
        return (
          (previousIndex + 1) %
          products.length
        );
      });
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [products]);

  // ==========================================
  // CURRENT PRODUCT
  // ==========================================

  const currentProduct =
    products.length > 0
      ? products[currentIndex]?.name
      : 'Skin Care';

  // ==========================================
  // UI
  // ==========================================

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() =>
        router.push('/(home)/search')
      }
    >
      <View style={styles.leftSection}>
        <Feather
          name="search"
          size={20}
          color="#666"
        />

        <Text style={styles.placeholder}>
          Search Products
        </Text>
      </View>

      <Text
        style={styles.suggestion}
        numberOfLines={1}
      >
        "{currentProduct}"
      </Text>
    </TouchableOpacity>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 16,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },

  placeholder: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'InterRegular',
    color: '#9A9A9A',
  },

  suggestion: {
    marginLeft: 10,
    fontSize: 10,
    fontFamily: 'InterMedium',
    color: '#3B3B3B',
    flexShrink: 1,
  },
});