import { Ionicons } from '@expo/vector-icons';
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

  // const handleAddressPress = () => {
  //   if (!isLoggedIn) {
  //     showLoginPopup();
  //     return;
  //   }
  //   if (!selectedAddress) {
  //     router.push('/(home)/add-address');
  //     return;
  //   }
  //   router.push('/(home)/saved-addresses');
  // };

   const handleAddressPress = () => {
  if (!isLoggedIn) {
    showLoginPopup();
    return;
  }

  if (!selectedAddress) {
    router.push('/(home)/add-address');
    return;
  }

  router.push({
    pathname: '/(home)/saved-addresses',
    params: {
      returnTo: 'home',
    },
  });
};

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>

        <View style={styles.leftSection}>

          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
          />

          <View style={{ flex: 1, minWidth: 0 }}>

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
                color="#1F5C3D"
              />


<Text style={styles.location} numberOfLines={1}>
  {selectedAddress
    ? `Delivery to : ${
        selectedAddress.city &&
        selectedAddress.pincode
          ? `${selectedAddress.city} - ${selectedAddress.pincode}`
          : selectedAddress.addressLine
      }`
    : user?.address
      ? `Delivery to : ${user.address}`
      : 'Add delivery address'}
</Text>
              <Ionicons name="chevron-forward" size={14} color="#1F5C3D" />

            </TouchableOpacity>

          </View>

        </View>

     

        <View style={styles.rightSection}>

  {/* WALLET ICON */}
  <TouchableOpacity
    style={styles.iconButton}
    onPress={() => router.push('/(home)/wallet')}
  >
    <Ionicons
      name="wallet-outline"
      size={23}
      color="#1F5C3D"
    />
  </TouchableOpacity>

  {/* CART ICON */}
  <TouchableOpacity
    style={styles.iconButton}
    onPress={() => router.push('/(home)/cart')}
  >
    <Image
      source={require('../../assets/images/cart.png')}
      style={{
        width: 22,
        height: 22,
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8DF0B4',
    paddingTop: 34,
    paddingHorizontal: 18,
    paddingBottom: 38,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },

  logo: {
    width: 54,
    height: 54,
    borderRadius: 32,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },

  greeting: {
    fontSize: 17,
    fontFamily: 'InterBold',
    color: '#0F3D26',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  location: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'InterRegular',
    color: '#1F5C3D',
    marginLeft: 3,
    marginRight: 2,
  },

  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,

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
    fontFamily: 'InterSemiBold',
    color: '#0F3D26',
  },

  searchWrapper: {
    marginTop: 14,
    marginBottom: 0,
  },
});