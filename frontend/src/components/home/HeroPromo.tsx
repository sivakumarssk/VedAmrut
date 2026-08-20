import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import { products } from '@/constants/DummyData2';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width - 32;

const slides = [
  {
    id: 's1',
    headline: 'Pure Ayurveda,',
    headlineAccent: 'delivered fast',
    subtext: 'Herbal wellness essentials at up to',
    discount: '50% OFF',
    colors: ['#0F5132', '#0A3B24'] as const,
    productImages: [products[0], products[1], products[2]],
  },
  {
    id: 's2',
    headline: 'Boost Your',
    headlineAccent: 'Immunity Naturally',
    subtext: 'Immunity boosters & herbal juices from',
    discount: '30% OFF',
    colors: ['#1C6FD9', '#0D3E80'] as const,
    productImages: [products[3], products[4], products[5]],
  },
  {
    id: 's3',
    headline: 'Complete',
    headlineAccent: 'Skin & Hair Care',
    subtext: 'Natural skin & hair essentials at flat',
    discount: '25% OFF',
    colors: ['#8E3FC4', '#4E1C73'] as const,
    productImages: [products[1], products[6] ?? products[1], products[2]],
  },
];

export default function HeroPromo() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.wrapper}>
      <Carousel
        width={SLIDE_WIDTH}
        height={190}
        data={slides}
        autoPlay
        autoPlayInterval={4000}
        loop
        pagingEnabled
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <LinearGradient
            colors={item.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
          >
            <View style={styles.ribbon}>
              <View style={styles.liveDot} />
              <Text style={styles.ribbonText}>LIVE</Text>
            </View>

            <View style={styles.contentRow}>
              <View style={styles.textColumn}>
                <Text style={styles.headline}>
                  {item.headline}
                  {'\n'}
                  <Text style={styles.headlineAccent}>
                    {item.headlineAccent}
                  </Text>
                </Text>

                <Text style={styles.subtext}>{item.subtext}</Text>

                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{item.discount}</Text>
                </View>

                <TouchableOpacity
                  style={styles.ctaButton}
                  activeOpacity={0.85}
                  onPress={() => router.push('/(home)/products')}
                >
                  <Text style={styles.ctaText}>Shop Now</Text>
                  <Ionicons name="arrow-forward" size={16} color="#222" />
                </TouchableOpacity>
              </View>

              <View style={styles.imageColumn}>
                {item.productImages.map((product, index) => (
                  <Image
                    key={`${item.id}-${product.id}-${index}`}
                    source={product.image}
                    resizeMode="contain"
                    style={[
                      styles.productImage,
                      index === 1 && styles.productImageMain,
                      index === 2 && styles.productImageBack,
                    ]}
                  />
                ))}
              </View>
            </View>
          </LinearGradient>
        )}
      />

      <View style={styles.pagination}>
        {slides.map((slide, index) => (
          <View
            key={slide.id}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
    alignItems: 'center',
  },

  container: {
    width: SLIDE_WIDTH,
    height: 190,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 22,
    overflow: 'hidden',
  },

  ribbon: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8B84B',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0A3B24',
    marginRight: 5,
  },

  ribbonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0A3B24',
    letterSpacing: 0.5,
  },

  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  textColumn: {
    flex: 1.1,
  },

  headline: {
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 27,
  },

  headlineAccent: {
    color: '#E8F5EC',
  },

  subtext: {
    marginTop: 8,
    fontSize: 12,
    color: '#E3EFE8',
  },

  discountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
  },

  discountText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#E8B84B',
  },

  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 14,
  },

  ctaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    marginRight: 6,
  },

  imageColumn: {
    flex: 0.9,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productImage: {
    position: 'absolute',
    width: 64,
    height: 64,
    opacity: 0.85,
  },

  productImageMain: {
    width: 92,
    height: 92,
    opacity: 1,
    zIndex: 2,
  },

  productImageBack: {
    right: -10,
    top: -10,
    opacity: 0.6,
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
