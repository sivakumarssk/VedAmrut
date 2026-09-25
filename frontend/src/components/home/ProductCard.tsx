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
  bgColor?: string;
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
  bgColor,
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
      {/* Image Section - fills the whole top half of the card */}
      <View
        style={[
          styles.imageSection,
          bgColor && bgColor !== 'transparent'
            ? { backgroundColor: bgColor }
            : null,
        ]}
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

        <Image
          source={image}
          resizeMode="contain"
          style={styles.image}
        />
      </View>

      {/* Details Section */}
      <View style={styles.detailsSection}>
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
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

container: {
  width: 150,
  backgroundColor: '#FFFFFF',
  borderRadius: 18,
  marginRight: 14,
  overflow: 'hidden',

  borderWidth: 1,
  borderColor: '#E7F3EA',
},

  // Top half of the card - fully filled with the
  // product's background color.
  imageSection: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },

  topRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
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
    width: 80,
    height: 80,
  },

  // Bottom half of the card - name, price, rating.
  detailsSection: {
    padding: 12,
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
