
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { API_BASE_URL } from '@/constants/api';
import {
  getSearchHistory,
  saveSearchHistory,
} from '@/utils/storage';

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

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const insets = useSafeAreaInsets();

  // =====================================================
  // LOAD SEARCH HISTORY
  // =====================================================

  useEffect(() => {
    const loadHistory = async () => {
      const stored = await getSearchHistory();
      setHistory(stored);
    };

    loadHistory();
  }, []);

  // =====================================================
  // SEARCH BACKEND
  // =====================================================

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      searchProducts(trimmedQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // =====================================================
  // SEARCH PRODUCTS API
  // =====================================================

  const searchProducts = async (searchQuery: string) => {
    try {
      setLoading(true);

      console.log('================================');
      console.log('SEARCHING PRODUCTS');
      console.log('QUERY:', searchQuery);

      const url =
        `${API_BASE_URL}/api/products/search?query=` +
        encodeURIComponent(searchQuery);

      console.log('SEARCH URL:', url);

      const response = await fetch(url);

      console.log(
        'SEARCH STATUS:',
        response.status
      );

      const result = await response.json();

      console.log(
        'SEARCH RESPONSE:',
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            'Failed to search products'
        );
      }

      setResults(result.data || []);

    } catch (error) {
      console.error(
        'SEARCH PRODUCTS ERROR:',
        error
      );

      setResults([]);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SAVE SEARCH
  // =====================================================

  const commitSearch = async (term: string) => {
    const trimmed = term.trim();

    if (!trimmed) return;

    const next = [
      trimmed,
      ...history.filter(
        (item) => item !== trimmed
      ),
    ].slice(0, 10);

    setHistory(next);

    await saveSearchHistory(next);
  };

  // =====================================================
  // REMOVE HISTORY ITEM
  // =====================================================

  const removeHistoryItem = async (
    term: string
  ) => {
    const next = history.filter(
      (item) => item !== term
    );

    setHistory(next);

    await saveSearchHistory(next);
  };

  // =====================================================
  // CLEAR HISTORY
  // =====================================================

  const clearHistory = async () => {
    setHistory([]);

    await saveSearchHistory([]);
  };

  // =====================================================
  // PRODUCT IMAGE
  // =====================================================

  const getProductImage = (
    image: string | null
  ) => {
    if (!image) {
      return require('@/assets/images/product1.png');
    }

    return {
      uri: `${API_BASE_URL}/uploads/${image}`,
    };
  };

  // =====================================================
  // RENDER PRODUCT
  // =====================================================

  const renderProduct = ({
    item,
  }: {
    item: Product;
  }) => {
    return (
      <TouchableOpacity
        style={styles.resultRow}
        onPress={async () => {
          await commitSearch(query);

          router.push({
            pathname: '/(home)/product-details',
            params: {
              id: String(item.id),
            },
          });
        }}
      >
        <Image
          source={getProductImage(item.image)}
          resizeMode="contain"
          style={styles.resultImage}
        />

        <View style={styles.resultInfo}>
          <Text
            style={styles.resultName}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          <Text style={styles.categoryName}>
            {item.category_name}
          </Text>

          <Text style={styles.resultPrice}>
            ₹{Number(item.price).toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // =====================================================
  // SCREEN
  // =====================================================

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      {/* =================================================
          SEARCH BAR
      ================================================= */}

      <View style={styles.searchRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#222"
          />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <Feather
            name="search"
            size={18}
            color="#666"
          />

          <TextInput
            autoFocus
            placeholder="Search Products"
            placeholderTextColor="#9A9A9A"
            value={query}
            onChangeText={setQuery}
            style={styles.input}
            returnKeyType="search"
            onSubmitEditing={() =>
              commitSearch(query)
            }
          />

          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery('')}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color="#B5B5B5"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* =================================================
          RECENT SEARCHES
      ================================================= */}

      {query.trim().length === 0 ? (
        <View style={styles.historySection}>
          <View style={styles.historyHeaderRow}>
            <Text style={styles.historyHeading}>
              Recent Searches
            </Text>

            {history.length > 0 && (
              <TouchableOpacity
                onPress={clearHistory}
              >
                <Text style={styles.clearAllText}>
                  Clear All
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {history.length === 0 ? (
            <Text style={styles.emptyHistoryText}>
              No recent searches
            </Text>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => item}
              contentContainerStyle={{
                paddingBottom:
                  24 + insets.bottom,
              }}
              renderItem={({ item }) => (
                <View style={styles.historyRow}>
                  <TouchableOpacity
                    style={
                      styles.historyItemLeft
                    }
                    onPress={() =>
                      setQuery(item)
                    }
                  >
                    <Ionicons
                      name="time-outline"
                      size={18}
                      color="#888"
                    />

                    <Text
                      style={styles.historyText}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      removeHistoryItem(item)
                    }
                    hitSlop={{
                      top: 8,
                      bottom: 8,
                      left: 8,
                      right: 8,
                    }}
                  >
                    <Ionicons
                      name="close"
                      size={18}
                      color="#B5B5B5"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      ) : (
        /* =================================================
           SEARCH RESULTS
        ================================================= */

        <FlatList
          data={results}
          keyExtractor={(item) =>
            String(item.id)
          }
          contentContainerStyle={[
            styles.resultsContent,
            {
              paddingBottom:
                24 + insets.bottom,
            },
          ]}
      ListEmptyComponent={
  loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator
        size="small"
        color="#1C9C57"
      />

      <Text style={styles.loadingText}>
        Searching products...
      </Text>
    </View>
  ) : (
    <Text style={styles.emptyHistoryText}>
      No products found for "{query}"
    </Text>
  )
}
          renderItem={renderProduct}
        />
      )}
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#F2F2F2',
    borderRadius: 14,
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#222',
  },

  historySection: {
    flex: 1,
    paddingHorizontal: 20,
  },

  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  historyHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },

  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E53935',
  },

  emptyHistoryText: {
    fontSize: 14,
    color: '#888',
    marginTop: 12,
  },

  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },

  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  historyText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#333',
  },

  resultsContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },

  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },

  resultImage: {
    width: 50,
    height: 50,
    marginRight: 14,
  },

  resultInfo: {
    flex: 1,
  },

  resultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },

  categoryName: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },

  resultPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C9C57',
    marginTop: 4,
  },

  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
  },

  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#777',
  },
});