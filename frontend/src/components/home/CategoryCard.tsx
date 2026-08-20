import React from 'react';
import {
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
  onPress?: () => void;
};

export default function CategoryCard({
  title,
  image,
  onPress,
}: CategoryCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.card}>
        <Image
          source={image}
          resizeMode="contain"
          style={styles.image}
        />
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '23%',
    marginBottom: 18,
  },

  card: {
    width: 58,
    height: 58,

    borderRadius: 14,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,

    borderColor: '#AEEAC0',

    justifyContent: 'center',

    alignItems: 'center',

    shadowColor: '#000',

    shadowOpacity: 0.05,

    shadowRadius: 4,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  image: {
    width: 38,
    height: 38,
  },

  title: {
    marginTop: 8,

    fontSize: 11,

    textAlign: 'center',

    color: '#222',

    lineHeight: 14,

    fontWeight: '500',
  },
});