import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../home/SearchBar';

import Colors from '@/constants/Colors';

export default function Header() {
  return (
    <LinearGradient
   colors={['#B8FAD8', '#B8FAD8']}
      style={styles.container}
    >
      <View style={styles.topRow}>

        <View style={styles.leftSection}>

          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
          />

          <View>

            <Text style={styles.greeting}>
              Hello, Diva
            </Text>

            <View style={styles.locationRow}>

              <Ionicons
                name="location-outline"
                size={15}
                color="#5B5B5B"
              />

              <Text style={styles.location}>
                Delivery to Hyderabad - 500001
              </Text>

            </View>

          </View>

        </View>

        <View style={styles.rightSection}>

          <TouchableOpacity style={styles.iconButton}>
            <Image
            source={require('../../assets/images/wallet.png')}
            style={{
              width:22,
              height:22,
            }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Image
            source={require("../../assets/images/cart.png")}
            style={{
              width:22,
              height:22,
            }}
            />
          </TouchableOpacity>

        </View>

      </View>

      <Text style={styles.title}>
  What are you looking for today?
</Text>

<View style={styles.searchWrapper}>
  <SearchBar />
</View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({

 container: {
  paddingTop: 60,
  paddingHorizontal: 18,
  paddingBottom: 24,
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
},

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
  },

  greeting: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.black,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  location: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 4,
  },

  rightSection: {
    flexDirection: 'row',
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  title: {
  marginTop: 22,
  marginBottom: 12,
  fontSize: 16,
  fontWeight: '600',
  color: '#1F1F1F',
},

searchWrapper: {
  marginBottom: 4,
},

});