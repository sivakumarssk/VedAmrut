import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import { banners } from '../../constants/DummyData1';

const { width } = Dimensions.get('window');

export default function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      <Carousel
        width={width - 32}
        height={145}
        data={banners}
        autoPlay
        autoPlayInterval={3000}
        loop
        pagingEnabled
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <Image
            source={item.image}
            style={styles.banner}
            resizeMode="cover"
          />
        )}
      />

      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'center',
  },

  banner: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },

  pagination: {
    flexDirection: 'row',
    marginTop: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },

  activeDot: {
    width: 18,
    backgroundColor: '#5B5B5B',
  },
});