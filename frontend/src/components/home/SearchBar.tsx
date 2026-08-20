import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { Feather } from '@expo/vector-icons';

export default function SearchBar() {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => router.push('/(home)/search')}
    >
      <View style={styles.leftSection}>
        <Feather name="search" size={20} color="#666" />

        <Text style={styles.placeholder}>Search Products</Text>
      </View>

      <Text style={styles.suggestion}>"Skin Care"</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 16,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  placeholder: {
    marginLeft: 10,
    fontSize: 15,
    color: '#9A9A9A',
  },

  suggestion: {
    marginLeft: 10,
    fontSize: 15,
    color: '#3B3B3B',
  },
});
