import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import RatingBadge from './RatingBadge';

type ProductCardProps = {
  image: ImageSourcePropType;
  name: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  discount?: number;
  style?: any;
  onPress?: () => void;
};

export default function ProductCard({
  image,
  name,
  price,
  oldPrice,
  rating,
  reviews,
  discount,
  onPress,
  style,
}: ProductCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {/* Discount */}
      {discount !== undefined && (
        <View style={styles.topRow}>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{discount}%
            </Text>
          </View>
        </View>
      )}

      {/* Product Image */}
      <Image
        source={image}
        resizeMode="contain"
        style={styles.image}
      />

      {/* Product Name */}
      <Text
        numberOfLines={2}
        style={styles.name}
      >
        {name}
      </Text>

      {/* Price */}
      <Text style={styles.price}>
        ₹{price.toFixed(2)}
      </Text>

      {/* Old Price */}
      {oldPrice !== undefined && (
        <Text style={styles.oldPrice}>
          ₹{oldPrice.toFixed(2)}
        </Text>
      )}

      {/* Rating */}
      {(rating !== undefined || reviews !== undefined) && (
        <RatingBadge
          rating={rating ?? 0}
          reviews={reviews ?? 0}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

container: {
  width: 150,
  backgroundColor: '#FFFFFF',
  borderRadius: 18,
  padding: 12,
  marginRight: 14,

  borderWidth: 1,
  borderColor: '#E7F3EA',
},

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  discountBadge: {
    backgroundColor: '#1C9C57',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'InterSemiBold',
  },

  image: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginVertical: 12,
  },

  name: {
    fontSize: 10,
    fontFamily: 'InterRegular',
    color: '#222222',
    lineHeight: 18,
    minHeight: 38,
  },

  price: {
    // marginTop: 2,
    fontSize: 16,
    fontFamily: 'InterBold',
    color: '#222222',
  },

  oldPrice: {
    marginTop: 2,
    fontSize: 13,
    fontFamily: 'InterRegular',
    color: '#888888',
    textDecorationLine: 'line-through',
  },
});