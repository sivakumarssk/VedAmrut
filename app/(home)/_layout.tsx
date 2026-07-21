import { Tabs } from 'expo-router';
import {Image} from 'react-native';
import {useLoginPopup } from '../../src/hooks/useLoginPopup'

export default function HomeLayout() {
const { showLoginPopup } = useLoginPopup();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

      

        tabBarShowLabel: true,

        tabBarStyle: {
          position: 'absolute',
          marginLeft: 20,
          marginRight: 20,
          bottom: 20,

          height: 74,

          borderRadius: 22,

          backgroundColor: '#FFFFFF',

          elevation: 8,

          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowOffset: {
            width: 0,
            height: 3,
          },
        },

        tabBarActiveTintColor: '#1C9C57',

        tabBarInactiveTintColor: '#6E6E6E',

        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({focused, color, size }) => (
           <Image
            source={require('../../src/assets/icons/home.png')}
            style={{
              width:22,
              height:17,
              tintColor: focused ? '#1C9C57' : '#6E6E6E',
            }}
            />
          ),
        }}
      />

      <Tabs.Screen
  name="scanner"
  listeners={{
    tabPress: (e) => {
      const isLoggedIn = false;

      if (!isLoggedIn) {
        e.preventDefault();
        showLoginPopup();
      }
    },
  }}
  options={{
    title: 'Scanner',
    tabBarIcon: ({ focused }) => (
      <Image
        source={require('../../src/assets/icons/scanner.png')}
        style={{
          width: 22,
          height: 17,
          tintColor: focused ? '#1C9C57' : '#6E6E6E',
        }}
      />
    ),
  }}
/>

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({focused, color, size }) => (
            <Image
            source={require('../../src/assets/icons/cart.png')}
            style={{
              width:22,
              height:17,
              tintColor: focused ? '#1C9C57' : '#6E6E6E',
            }}
            />
          ),
        }}
      />

      <Tabs.Screen
  name="profile"
  listeners={{
    tabPress: (e) => {
      const isLoggedIn = false;

      if (!isLoggedIn) {
        e.preventDefault();
        showLoginPopup();
      }
    },
  }}
  options={{
    title: 'Profile',
    tabBarIcon: ({ focused }) => (
      <Image
        source={require('../../src/assets/icons/profile.png')}
        style={{
          width: 22,
          height: 18,
          tintColor: focused ? '#1C9C57' : '#6E6E6E',
        }}
      />
    ),
  }}
/>

      {/* Hide these from the tab bar */}
      <Tabs.Screen
        name="products"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="product-details"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}