import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(home)/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.tagline}>
        "Pure Ayurveda, Trusted Wellness"
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  logo: {
    width: 170,
    height: 170,
  },

  tagline: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2D2D',
    textAlign: 'center',
  },
});