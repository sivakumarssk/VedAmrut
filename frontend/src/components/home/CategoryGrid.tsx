import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import CategoryCard from './CategoryCard';
import { API_BASE_URL } from '@/constants/api';

type Category = {
  id: number;
  name: string;
  description?: string;
  image: string;
};

type CategoryGridProps = {
  categories: Category[];
};

export default function CategoryGrid({
  categories,
}: CategoryGridProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Shop by Category</Text>

     <FlatList
  data={categories}
  keyExtractor={(item) => String(item.id)}
  numColumns={4}
  scrollEnabled={false}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingTop: 8 }}
  columnWrapperStyle={styles.row}
  renderItem={({ item }) => {
    console.log('CATEGORY:', item.name);
    console.log('IMAGE NAME:', item.image);
    console.log(
      'FULL IMAGE URL:',
      `${API_BASE_URL}/uploads/categories/${item.image}`
    );

    return (
      <CategoryCard
        title={item.name}
        image={{
          uri: `${API_BASE_URL}/uploads/categories/${item.image}?v=2`,
        }}
        color="#FFFFFF"
        onPress={() => {
          router.push({
            pathname: '/(home)/products',
            params: {
              categoryId: String(item.id),
              categoryName: item.name,
            },
          });
        }}
      />
    );
  }}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    paddingHorizontal: 16,
    paddingTop: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  heading: {
    fontSize: 18,
    fontFamily: 'InterBold',
    color: '#222222',
    marginBottom: 14,
  },

  row: {
  justifyContent: 'space-between',
  marginBottom: 10,
},
});