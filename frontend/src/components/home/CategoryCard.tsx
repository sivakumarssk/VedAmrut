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
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={onPress}
    >
      <View style={[styles.card, { backgroundColor: color }]}>
        <Image
          source={image}
          resizeMode={transparent ? 'contain' : 'cover'}
          style={[styles.image, transparent && styles.imageContained]}
        />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '23%',
    marginBottom: 20,
  },

  card: {
    width: 68,
    height: 68,

    borderRadius: 18,

    overflow: 'hidden',

    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  imageContained: {
    width: '82%',
    height: '82%',
    alignSelf: 'center',
    marginTop: '9%',
  },

  title: {
    marginTop: 8,

    fontSize: 11.5,

    textAlign: 'center',

    color: '#222',

    lineHeight: 14,

    fontWeight: '600',
  },
});
