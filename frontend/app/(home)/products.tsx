import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '@/components/common/ScreenHeader';
import ProductCard from '@/components/home/ProductCard';
import { products } from '@/constants/DummyData2';

export default function ProductsScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();

  const categoryLabel = (category ?? '').replace('\n', ' ');
  const filteredProducts = products.filter(
    (item) => item.category.replace('\n', ' ') === categoryLabel
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title={categoryLabel || 'Products'} />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No products found in this category yet
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCard
              image={item.image}
              name={item.name}
              price={item.price}
              oldPrice={item.oldPrice}
              rating={item.rating}
              reviews={item.reviews}
              discount={item.discount}
              style={styles.highlightedCard}
              onPress={() =>
                router.push({
                  pathname: '/(home)/product-details',
                  params: { id: item.id },
                })
              }
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
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
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
