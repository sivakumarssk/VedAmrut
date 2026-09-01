import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type CategoryCardProps = {
  title: string;
  image: ImageSourcePropType;
  color: string;
  transparent?: boolean;
  onPress?: () => void;
};

export default function CategoryCard({
  title,
  image,
  color,
  transparent,
  onPress,
}: CategoryCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: color,
        },
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        {imageLoading && !imageError && (
          <ActivityIndicator
            size="small"
            color="#1C9C57"
            style={styles.loader}
          />
        )}

        {!imageError ? (
    <Image
  source={image}
  resizeMode="contain"
  style={styles.image}
  onError={(error) => {
    console.log(
      'IMAGE ERROR:',
      title,
      error.nativeEvent
    );
    setImageError(true);
  }}
/>
        ) : (
          <View style={styles.imageError}>
            <Text style={styles.imageErrorText}>
              Image unavailable
            </Text>
          </View>
        )}
      </View>

      <Text
        style={styles.title}
        numberOfLines={2}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// const styles = StyleSheet.create({

//   container: {
//     width: '23%',
//     borderRadius: 14,
//     paddingVertical: 10,
//     paddingHorizontal: 5,
//     alignItems: 'center',
//   },

//   imageContainer: {
//     width: 65,
//     height: 65,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   image: {
//     width: 65,
//     height: 65,
//   },

//   hiddenImage: {
//     opacity: 0,
//   },

//   loader: {
//     position: 'absolute',
//   },

//   imageError: {
//     width: 65,
//     height: 65,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   imageErrorText: {
//     fontSize: 9,
//     color: '#999',
//     textAlign: 'center',
//   },

//   title: {
//     marginTop: 6,
//     fontSize: 11,
//     fontWeight: '600',
//     color: '#222',
//     textAlign: 'center',
//   },
// });

const styles = StyleSheet.create({
  container: {
    width: '23%',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',

    // Box shadow
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    // Android
    elevation: 4,

    marginBottom: 4,
  },

  imageContainer: {
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 65,
    height: 65,
  },

  hiddenImage: {
    opacity: 0,
  },

  loader: {
    position: 'absolute',
  },

  imageError: {
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageErrorText: {
    fontSize: 9,
    color: '#999',
    textAlign: 'center',
  },

  title: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },
});