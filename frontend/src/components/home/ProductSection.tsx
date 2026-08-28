import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';

import ProductCard from './ProductCard';
import { API_BASE_URL } from '@/constants/api';

// type Product = {
//   id: number | string;
//   name: string;
//   price: number | string;
//   oldPrice?: number | string;
//   rating?: number | string;
//   reviews?: number | string;
//   discount?: number | string;
//   image?: string | null;
// };
type Product = {
  id: number | string;
  name: string;
  price: number | string;

  // Backend fields
  old_price?: number | string | null;
  rating?: number | string | null;
  reviews?: number | string | null;
  review_count?: number | string | null;

  image?: string | null;
};
export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      console.log('========== PRODUCT API ==========');
      console.log(
        'URL:',
        `${API_BASE_URL}/api/products`
      );

      const response = await fetch(
        `${API_BASE_URL}/api/products`
      );

      console.log(
        'Product API STATUS:',
        response.status
      );

      const result = await response.json();

      console.log(
        'Product API DATA:',
        result
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
            'Failed to fetch products'
        );
      }

      if (
        result.success &&
        Array.isArray(result.data)
      ) {
        setProducts(result.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error(
        'PRODUCT API ERROR:',
        error
      );

      setProducts([]);
    } finally {
      setLoading(false);

      console.log(
        'Product loading finished'
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================
  // OPEN PRODUCT DETAILS
  // ==========================================

  const handleProductPress = (
    productId: number | string
  ) => {
    router.push({
      pathname:
        '/(home)/product-details',
      params: {
        id: String(productId),
      },
    });
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <View style={styles.container}>
      {/* HEADING */}

      <Text style={styles.heading}>
        Best Selling Products
      </Text>

      <Text style={styles.subHeading}>
        Pick your favorite products from
        best selling products
      </Text>

      {/* LOADING */}

      {loading ? (
        <View
          style={
            styles.loaderContainer
          }
        >
          <ActivityIndicator
            size="small"
            color="#1C9C57"
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading products...
          </Text>
        </View>
      ) : products.length === 0 ? (
        /* EMPTY */

        <View
          style={
            styles.emptyContainer
          }
        >
          <Text
            style={
              styles.emptyText
            }
          >
            No products available
          </Text>
        </View>
      ) : (
        /* PRODUCTS */

        <FlatList
          data={products}
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          nestedScrollEnabled={true}
          directionalLockEnabled={true}
          bounces={true}
          decelerationRate="fast"
          keyExtractor={(item) =>
            String(item.id)
          }
          contentContainerStyle={
            styles.list
          }
          style={styles.flatList}
          renderItem={({
            item,
          }) => (
            <View
              style={
                styles.cardContainer
              }
            >
              {/* <ProductCard image={
    item.image
      ? {
          uri: `${API_BASE_URL}/uploads/${item.image}?v=${Date.now()}`,
        }
      : require('@/assets/images/product1.png')
  }
                name={item.name}
                price={Number(
                  item.price
                )}
                style={
                  styles.highlightedCard
                }
                onPress={() =>
                  handleProductPress(
                    item.id
                  )
                }
              /> */}
              <ProductCard
  image={
    item.image
      ? {
          uri: `${API_BASE_URL}/uploads/${item.image}?v=${Date.now()}`,
        }
      : require('@/assets/images/product1.png')
  }

  name={item.name}

  price={Number(item.price)}

oldPrice={
  Number(item.old_price) > Number(item.price)
    ? Number(item.old_price)
    : Number(item.price) + (Number(item.price) >= 300 ? 50 : 40)
}

  rating={
  item.rating !== null &&
  item.rating !== undefined
    ? Number(item.rating)
    : 0
}

reviews={
  item.review_count !== null &&
  item.review_count !== undefined
    ? Number(item.review_count)
    : item.reviews !== null &&
      item.reviews !== undefined
    ? Number(item.reviews)
    : 0
}
discount={
  Number(item.old_price) > Number(item.price)
    ? Math.round(
        ((Number(item.old_price) - Number(item.price)) /
          Number(item.old_price)) *
          100
      )
    : undefined
}

  style={styles.highlightedCard}

  onPress={() =>
    handleProductPress(item.id)
  }
/>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
  },

  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginHorizontal: 16,
  },

  subHeading: {
    fontSize: 13,
    color: '#777',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 18,
  },

  flatList: {
    flexGrow: 0,
  },

  list: {
    paddingLeft: 16,
    paddingRight: 16,
  },

  cardContainer: {
    width: 150,
    marginRight: 14,
  },

  highlightedCard: {
    width: 150,
    marginRight: 0,

    borderWidth: 1,
    borderColor: '#E7F3EA',

    shadowColor: '#1C9C57',
    shadowOpacity: 0.12,
    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  loaderContainer: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 8,
    fontSize: 13,
    color: '#777',
  },

  emptyContainer: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#777',
  },
});