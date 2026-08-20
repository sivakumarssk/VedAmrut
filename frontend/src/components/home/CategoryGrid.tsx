import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import CategoryCard from './CategoryCard';
import { categories } from '@/constants/DummyData';

export default function CategoryGrid() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Shop by Category</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={4}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <CategoryCard
            title={item.title}
            image={item.image}
            color={item.color}
            transparent={item.transparent}
            onPress={() =>
              router.push({
                pathname: '/(home)/products',
                params: { category: item.title },
              })
            }
          />
        )}
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
    fontWeight: '700',
    color: '#222',
    marginBottom: 14,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});