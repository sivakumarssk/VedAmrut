import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TAB_BAR_BOTTOM_MARGIN,
  TAB_BAR_HEIGHT,
} from '../../src/constants/Layout';
import { useAuth } from '../../src/hooks/useAuth';
import { useLoginPopup } from '../../src/hooks/useLoginPopup';

const TAB_ICONS: Record<string, any> = {
  home: require('../../src/assets/icons/home.png'),
  scanner: require('../../src/assets/icons/scanner.png'),
  cart: require('../../src/assets/icons/cart.png'),
  profile: require('../../src/assets/icons/profile.png'),
};

const TAB_LABELS: Record<string, string> = {
  home: 'Home',
  scanner: 'Scanner',
  cart: 'Cart',
  profile: 'Profile',
};

const GATED_TABS = new Set(['scanner', 'profile']);

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { showLoginPopup } = useLoginPopup();
  const { isLoggedIn } = useAuth();

  const visibleRoutes = state.routes.filter((route) => route.name in TAB_ICONS);
  const activeRouteName = state.routes[state.index]?.name;
  const SHOW_ON_ROUTES = new Set(['home', 'cart', 'profile']);

  if (!SHOW_ON_ROUTES.has(activeRouteName)) {
    return null;
  }

  return (
    <View
      style={[styles.tabBar, { bottom: insets.bottom + TAB_BAR_BOTTOM_MARGIN }]}
    >
      {visibleRoutes.map((route) => {
        const index = state.routes.findIndex((r) => r.key === route.key);
        const focused = state.index === index;

        const onPress = () => {
          if (GATED_TABS.has(route.name) && !isLoggedIn) {
            showLoginPopup();
            return;
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={onPress}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: focused ? '#1C9C57' : 'transparent',
                overflow: 'hidden',
              }}
            >
              <Image
                source={TAB_ICONS[route.name]}
                style={[
                  styles.iconImage,
                  { tintColor: focused ? '#FFFFFF' : '#6E6E6E' },
                ]}
                resizeMode="contain"
              />
            </View>

            <Text
              style={[styles.labelText, focused && styles.labelTextActive]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {TAB_LABELS[route.name]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function HomeLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="scanner" options={{ title: 'Scanner' }} />
      <Tabs.Screen name="cart" options={{ title: 'Cart' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />

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

      <Tabs.Screen
        name="saved-addresses"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="add-address"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="edit-profile"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 20,
    right: 20,

    flexDirection: 'row',

    height: TAB_BAR_HEIGHT,
    paddingHorizontal: 8,

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
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
  },
  iconImage: {
    width: 22,
    height: 22,
  },
  labelText: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: '#6E6E6E',
  },
  labelTextActive: {
    color: '#1C9C57',
  },
});
