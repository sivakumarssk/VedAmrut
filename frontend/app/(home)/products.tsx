
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '@/components/common/ScreenHeader';
import ProductCard from '@/components/home/ProductCard';
import { API_BASE_URL } from '@/constants/api';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string | null;
  stock: number;
  category_id: number;
  category_name: string;
};

export default function ProductsScreen() {
  const params = useLocalSearchParams<{
    categoryId?: string;
    categoryName?: string;
  }>();

  const categoryId = params.categoryId;
  const categoryName = params.categoryName;

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    if (!categoryId) {
      console.log('No categoryId received');
      return;
    }

    fetchProducts();
  }, [categoryId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      console.log('================================');
      console.log('PRODUCTS SCREEN');
      console.log('CATEGORY ID:', categoryId);
      console.log('CATEGORY NAME:', categoryName);
      console.log('================================');

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
        // ------------------------------------------
        // STORE ALL PRODUCTS
        // ------------------------------------------

        const allProducts: Product[] =
          result.data;

        setProducts(allProducts);

        console.log(
          'TOTAL PRODUCTS:',
          allProducts.length
        );

        // ------------------------------------------
        // FILTER USING FRESH API DATA
        // ------------------------------------------

        const filtered = allProducts.filter(
          (item: Product) =>
            Number(item.category_id) ===
            Number(categoryId)
        );

        console.log(
          'FILTERED PRODUCTS:',
          filtered.length
        );

        console.log(
          'FILTERED PRODUCT DATA:',
          filtered
        );

        setFilteredProducts(filtered);
      } else {
        console.log(
          'Invalid product API response'
        );

        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error(
        'Product API Error:',
        error
      );

      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);

      console.log(
        'Product loading finished'
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.safeArea}
      >
        <ScreenHeader
          title={
            categoryName || 'Products'
          }
        />

        <View
          style={
            styles.loaderContainer
          }
        >
          <ActivityIndicator
            size="large"
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
      </SafeAreaView>
    );
  }

  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ScreenHeader
        title={
          categoryName || 'Products'
        }
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) =>
          String(item.id)
        }
        numColumns={2}
        columnWrapperStyle={
          styles.row
        }
        contentContainerStyle={
          styles.listContent
        }
        showsVerticalScrollIndicator={
          false
        }
        ListEmptyComponent={
          <View
            style={
              styles.emptyContainer
            }
          >
            <Text
              style={
                styles.emptyTitle
              }
            >
              No products found
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              No products found in{' '}
              {categoryName
                ? `"${categoryName}"`
                : 'this category'}{' '}
              yet.
            </Text>
          </View>
        }
      //   renderItem={({  item,}) => (
      //     <View style={ styles.cardWrapper}>
      //       <ProductCard
      //         image={
      //           item.image
      //             ? {
      //                 uri: `${API_BASE_URL}/uploads/${item.image}`,
      //               }
      //             : require('@/assets/images/product1.png')
      //         }
      //         name={item.name}
      //         price={Number(
      //           item.price
      //         )}
      //         style={
      //           styles.highlightedCard
      //         }
      //         onPress={() =>
      //           router.push({
      //             pathname:
      //               '/(home)/product-details',
      //             params: {
      //               id: String(
      //                 item.id
      //               ),
      //             },
      //           })
      //         } />
      //     </View>
       
      // )}
//       renderItem={({ item }) => {
//   console.log('PRODUCT NAME:', item.name);
//   console.log('PRODUCT IMAGE:', item.image);
//   console.log(
//     'PRODUCT IMAGE URL:',
//     item.image
//       ? `${API_BASE_URL}/uploads/${item.image}`
//       : 'NO IMAGE'
//   );

//   return (
//     <View style={styles.cardWrapper}>
//       <ProductCard
//         image={
//           item.image
//             ? {
//                 uri: `${API_BASE_URL}/uploads/${item.image}`,
//               }
//             : require('@/assets/images/product1.png')
//         }
//         name={item.name}
//         price={Number(item.price)}
//         style={styles.highlightedCard}
//         onPress={() =>
//           router.push({
//             pathname: '/(home)/product-details',
//             params: {
//               id: String(item.id),
//             },
//           })
//         }
//       />
//     </View>
//   );
// }}
renderItem={({ item }) => {
  console.log('PRODUCT NAME:', item.name);
  console.log('PRODUCT IMAGE:', item.image);
  console.log(
    'PRODUCT IMAGE URL:',
    item.image
      ? `${API_BASE_URL}/uploads/${item.image}?v=${Date.now()}`
      : 'NO IMAGE'
  );

  return (
    <View style={styles.cardWrapper}>
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
        style={styles.highlightedCard}
        onPress={() =>
          router.push({
            pathname: '/(home)/product-details',
            params: {
              id: String(item.id),
            },
          })
        }
      />
    </View>
  );
}}
      />
    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    flexGrow: 1,
  },

  row: {
    justifyContent: 'space-between',
  },

  cardWrapper: {
    width: '48%',
    marginBottom: 16,
  },

  highlightedCard: {
    width: '100%',
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'InterRegular',
    color: '#777777',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: 32,
  },

  emptyTitle: {
    fontSize: 18,
    fontFamily: 'InterBold',
    color: '#222222',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    fontFamily: 'InterRegular',
    color: '#888888',
    textAlign: 'center',
    lineHeight: 21,
  },
});