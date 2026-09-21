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
  imageBgColor?: string;
  transparent?: boolean;
  onPress?: () => void;
};

export default function CategoryCard({
  title,
  image,
  color,
  imageBgColor,
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
      {/* Image Section - fills the whole top of the card */}
      <View
        style={[
          styles.imageSection,
          imageBgColor && imageBgColor !== 'transparent'
            ? { backgroundColor: imageBgColor }
            : null,
        ]}
      >
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

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
  flex: 1,
  marginHorizontal: 4,
  borderRadius: 14,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
    marginBottom: 4,
  },

  // Top of the card - fully filled with the
  // category's background color.
  imageSection: {
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 56,
    height: 56,
  },

  hiddenImage: {
    opacity: 0,
  },

  loader: {
    position: 'absolute',
  },

  imageError: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageErrorText: {
    fontSize: 9,
    fontFamily: 'InterRegular',
    color: '#999999',
    textAlign: 'center',
  },

  // Bottom of the card - category name.
  titleSection: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    alignItems: 'center',
  },

  title: {
    fontSize: 11,
    fontFamily: 'InterSemiBold',
    color: '#222222',
    textAlign: 'center',
  },
});