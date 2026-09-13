import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
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
  // SCROLLING PRODUCT NAME TICKER
  //
  // Continuous upward-scrolling ticker: every product
  // name is stacked in one tall column and the column
  // keeps translating up, one row at a time, instead of
  // instantly swapping text. The first name is duplicated
  // at the end of the list so the loop can jump back to
  // the top instantly once it scrolls past the duplicate
  // — both rows look identical, so the reset is invisible.
  // ==========================================

  const TICKER_ROW_HEIGHT = 16;

  const baseNames =
    products.length > 0
      ? products.map((product) => product.name)
      : ['Skin Care', 'Herbal Juice', 'Ayurvedic Products'];

  const tickerNames = [...baseNames, baseNames[0]];

  const scrollAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (baseNames.length <= 1) {
      return;
    }

    let currentStep = 0;
    let isCancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const scrollToNextName = () => {
      if (isCancelled) {
        return;
      }

      currentStep += 1;

      Animated.timing(scrollAnim, {
        toValue: -(currentStep * TICKER_ROW_HEIGHT),
        duration: 550,
        useNativeDriver: true,
      }).start(() => {
        if (isCancelled) {
          return;
        }

        if (currentStep >= baseNames.length) {
          currentStep = 0;
          scrollAnim.setValue(0);
        }

        timeoutId = setTimeout(scrollToNextName, 3000);
      });
    };

    timeoutId = setTimeout(scrollToNextName, 3000);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
      scrollAnim.stopAnimation();
      scrollAnim.setValue(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length]);

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

      <View style={styles.suggestionWrapper}>
        <Animated.View
          style={{
            width: '100%',
            transform: [
              {
                translateY: scrollAnim,
              },
            ],
          }}
        >
          {tickerNames.map((name, index) => (
            <View
              key={`${name}-${index}`}
              style={styles.suggestionRow}
            >
              <Text
                style={styles.suggestion}
                numberOfLines={1}
              >
                "{name}"
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>
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

  suggestionWrapper: {
    marginLeft: 10,
    height: 16,
    width: 130,
    overflow: 'hidden',
  },

  suggestionRow: {
    height: 16,
    width: 130,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  suggestion: {
    fontSize: 10,
    fontFamily: 'InterMedium',
    color: '#3B3B3B',
    textAlign: 'right',
  },
});