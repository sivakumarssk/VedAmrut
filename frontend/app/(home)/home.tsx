import React, { useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../src/components/home/Header';
import CategoryGrid from '../../src/components/home/CategoryGrid';
import HeroPromo from '../../src/components/home/HeroPromo';
import ProductSection, {
  ProductSectionHandle,
} from '../../src/components/home/ProductSection';
import { API_BASE_URL } from '@/constants/api';
import { TAB_BAR_BOTTOM_MARGIN, TAB_BAR_HEIGHT } from '../../src/constants/Layout';



export default function HomeScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const productSectionRef = useRef<ProductSectionHandle>(null);

  const insets = useSafeAreaInsets();

  const tabBarClearance =
    insets.bottom + TAB_BAR_BOTTOM_MARGIN + TAB_BAR_HEIGHT;

  useEffect(() => {
    fetchCategories();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    await Promise.all([
      fetchCategories({ silent: true }),
      productSectionRef.current?.refresh(),
    ]);

    setRefreshing(false);
  };

  const fetchCategories = async (
    options: { silent?: boolean } = {}
  ) => {
    try {
      if (!options.silent) {
        setLoading(true);
      }

      setError('');

    const response = await fetch(`${API_BASE_URL}/api/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      console.log('Categories API response:', result);

      if (result.success) {
        setCategories(result.data);
      } else {
        setError('Failed to load categories');
      }
    } catch (error) {
      console.error('Categories API error:', error);
      setError('Unable to load categories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
      }}
    >
      <ScrollView
  style={{
    backgroundColor: '#FFFFFF',
  }}
        contentContainerStyle={{
          paddingBottom: tabBarClearance + 60,
          backgroundColor: '#FFFFFF',
        }}
        showsVerticalScrollIndicator={false}
         nestedScrollEnabled
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1C9C57']}
            tintColor="#1C9C57"
          />
        }
      >
        <Header />

        {loading ? (
          <View
            style={{
              paddingVertical: 30,
              alignItems: 'center',
            }}
          >
            <Text>Loading categories...</Text>
          </View>
        ) : error ? (
          <View
            style={{
              paddingVertical: 30,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'red' }}>{error}</Text>
          </View>
        ) : (
          <CategoryGrid categories={categories} />
        )}

        <HeroPromo />

        <ProductSection ref={productSectionRef} />
      </ScrollView>
    </SafeAreaView>
  );
}