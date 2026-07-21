import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import CategoryCard from './CategoryCard';
import { categories } from '@/constants/DummyData';

export default function CategoryGrid() {
  return (
    <View style={styles.container}>
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
            onPress={() => console.log(item.title)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});