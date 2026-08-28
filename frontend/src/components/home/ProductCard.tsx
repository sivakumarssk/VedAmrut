// import React from 'react';
// import {
//   Image,
//   ImageSourcePropType,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// import RatingBadge from './RatingBadge';

// type ProductCardProps = {
//   image: ImageSourcePropType;
//   name: string;
//   price: number;
//   oldPrice?: number;
//   rating?: number;
//   reviews?: number;
//   discount?: number;
//   style?: any;
//   onPress?: () => void;
// };

// export default function ProductCard({
//   image,
//   name,
//   price,
//   oldPrice,
//   rating,
//   reviews,
//   discount,
//   onPress,
//   style,
// }: ProductCardProps) {
//   return (
//     <TouchableOpacity
//       style={[styles.container, style]}
//       activeOpacity={0.85}
//       onPress={onPress}
//     >
//       {/* Top Row */}
//       <View style={styles.topRow}>
//        {discount !== undefined && (
//   <View style={styles.discountBadge}>
//     <Text style={styles.discountText}>
//       -{discount}%
//     </Text>
//   </View>
// )}
//       </View>

//       {/* Product Image */}
//     <Image
//   source={
//     image || require('../../assets/images/product1.png')
//   }
//   resizeMode="contain"
//   style={styles.image}
// />

//       {/* Product Name */}
//       <Text
//         numberOfLines={2}
//         style={styles.name}
//       >
//         {name}
//       </Text>

//       {/* Price */}
//       <Text style={styles.price}>
//         ₹{price.toFixed(2)}
//       </Text>

//       {/* Old Price */}
//      {oldPrice !== undefined && (
//   <Text style={styles.oldPrice}>
//     ₹{oldPrice.toFixed(2)}
//   </Text>
// )}
//       {/* Rating */}
//       <RatingBadge
//        rating={rating ?? 0}
// reviews={reviews ?? 0}
//       />
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     width: 150,
//     backgroundColor: '#FFFFFF',

//     borderRadius: 18,

//     padding: 12,

//     marginRight: 14,

//     // shadowColor: '#000',
//     // shadowOpacity: 0.06,
//     // shadowRadius: 8,
//     // shadowOffset: {
//     //   width: 0,
//     //   height: 2,
//     // },

   
//   },

//   topRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   discountBadge: {
//     backgroundColor: '#1C9C57',

//     borderRadius: 12,

//     paddingHorizontal: 12,
//     paddingVertical: 4,
//   },

//   discountText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },

//   image: {
//     width: 90,
//     height: 90,
//     alignSelf: 'center',
//     marginVertical: 12,
//   },

//   name: {
//     fontSize: 14,
//     color: '#222',
//     lineHeight: 18,
//     minHeight: 38,
//   },

//   price: {
//     marginTop: 6,
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#222',
//   },

//   oldPrice: {
//     marginTop: 2,
//     fontSize: 13,
//     color: '#888',
//     textDecorationLine: 'line-through',
//   },
// });

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
    fontWeight: '600',
  },

  image: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginVertical: 12,
  },

  name: {
    fontSize: 14,
    color: '#222',
    lineHeight: 18,
    minHeight: 38,
  },

  price: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  oldPrice: {
    marginTop: 2,
    fontSize: 13,
    color: '#888',
    textDecorationLine: 'line-through',
  },
});