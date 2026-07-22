import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SearchBar from '../home/SearchBar';

import Colors from '@/constants/Colors';
import { useAddress } from '@/hooks/useAddress';
import { useAuth } from '@/hooks/useAuth';
import { useLoginPopup } from '@/hooks/useLoginPopup';

export default function Header() {
  const { isLoggedIn, user } = useAuth();
  const { showLoginPopup } = useLoginPopup();
  const { selectedAddress } = useAddress();

  const handleAddressPress = () => {
    if (!isLoggedIn) {
      showLoginPopup();
      return;
    }
    if (!selectedAddress) {
      router.push('/(home)/add-address');
      return;
    }
    router.push('/(home)/saved-addresses');
  };

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
  Hello, {isLoggedIn ? user?.fullName : "Guest"}
</Text>

            <TouchableOpacity
              style={styles.locationRow}
              onPress={handleAddressPress}
            >

              <Ionicons
                name="location-outline"
                size={15}
                color="#5B5B5B"
              />

              <Text style={styles.location} numberOfLines={1}>
                {selectedAddress
                  ? `Delivery to : ${selectedAddress.city} - ${selectedAddress.pincode}`
                  : 'Add delivery address'}
              </Text>

              <Ionicons name="chevron-forward" size={14} color="#5B5B5B" />

            </TouchableOpacity>

          </View>

        </View>

        <View style={styles.rightSection}>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/(home)/wallet')}
          >
            <Image
            source={require('../../assets/images/wallet.png')}
            style={{
              width:22,
              height:22,
            }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/(home)/cart')}
          >
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
  paddingTop: 34,
  paddingHorizontal: 18,
  paddingBottom: 16,
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
    width: 54,
    height: 54,
    borderRadius: 32,
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
  marginTop: 24,
  marginBottom: 10,
  fontSize: 16,
  fontWeight: '600',
  color: '#1F1F1F',
},

searchWrapper: {
  marginTop: 14,
  marginBottom: 0,
},

});