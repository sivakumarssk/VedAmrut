import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ProductCard from './ProductCard';
import { products } from '../../constants/DummyData2';

export default function ProductSection() {
  return (
    <View style={styles.container}>

      <Text style={styles.heading}>
        Best Selling Product
      </Text>

      <Text style={styles.subHeading}>
        Pick your favorite products from best selling products
      </Text>

<View>
      <FlatList
  data={products}
  horizontal
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <ProductCard
      image={item.image}
      name={item.name}
      price={item.price}
      oldPrice={item.oldPrice}
      rating={item.rating}
      reviews={item.reviews}
      discount={item.discount}
    />
  )}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.list}
  style={styles.flatList}
/>
</View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
  marginTop: 24,
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

  list: {
    paddingLeft: 16,
    paddingRight: 16,
  },
 flatList: {
  flexGrow: 0,
  marginBottom:40,
},

});