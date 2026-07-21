import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Feather, Ionicons } from '@expo/vector-icons';

export default function SearchBar() {
  return (
    <View style={styles.container}>

      <View style={styles.leftSection}>
        <Feather
          name="search"
          size={20}
          color="#666"
        />

        <TextInput
          placeholder="Search Products"
          placeholderTextColor="#9A9A9A"
          style={styles.input}
        />

        <Text style={styles.suggestion}>
          "Skin Care"
        </Text>
      </View>

      <TouchableOpacity style={styles.cameraButton}>
        <Ionicons
          name="camera"
          size={22}
          color="#555"
        />
      </TouchableOpacity>

    </View>
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#222',
  },

  suggestion: {
    marginRight: 10,
    fontSize: 15,
    color: '#3B3B3B',
  },

  cameraButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },

});