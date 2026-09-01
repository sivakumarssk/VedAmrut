
import {Ionicons,MaterialCommunityIcons,} from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert,  ScrollView,StyleSheet, Text, TouchableOpacity,View,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '@/constants/api';
import ScreenHeader from '@/components/common/ScreenHeader';
import { SCREEN_BOTTOM_PADDING } from '@/constants/Layout';
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/utils/storage';

type ProfileUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
};

export default function ProfileScreen() {
  const {
  user,
  logout,
  updateUser,
} = useAuth();
  const [profile, setProfile] =
    useState<ProfileUser | null>(null);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH PROFILE FROM BACKEND
  // =====================================================

  const fetchProfile = async () => {
    try {
      const token = await getToken();

      if (!token) {
        console.log('No token found');
        setLoading(false);
        return;
      }

      const response = await fetch(
       `${API_BASE_URL}/api/users/profile`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      console.log('Profile Response:', data);

      if (!response.ok) {
        Alert.alert(
          'Profile Error',
          data.message || 'Unable to fetch profile'
        );
        return;
      }

      if (data.success && data.user) {
        setProfile(data.user);

await updateUser({
  id: data.user.id,
  fullName: data.user.name,
  email: data.user.email,
  mobile: data.user.phone,
  address: data.user.address ?? '',
  dob: data.user.dob ?? '',
  role: data.user.role,
});
      }
    } catch (error) {
      console.error('Profile Error:', error);

      Alert.alert(
        'Connection Error',
        'Cannot connect to backend. Make sure your backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REFRESH PROFILE EVERY TIME SCREEN OPENS
  // =====================================================

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchProfile();
    }, [])
  );

  // =====================================================
  // IMPORTANT:
  // AUTH CONTEXT USER HAS PRIORITY
  // =====================================================

  const displayName =
    user?.fullName ||
    profile?.name ||
    'Guest User';

  const displayPhone =
    user?.mobile ||
    profile?.phone ||
    '0000000000';

  const displayEmail =
    user?.email ||
    profile?.email ||
    '';

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();

            router.replace('/(home)/home');
          },
        },
      ]
    );
  };

  // =====================================================
  // DELETE ACCOUNT
  // =====================================================

 
const handleDeleteAccount = () => {
  Alert.alert(
    'Delete Account',
    'This will permanently remove your account data. This action cannot be undone.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);

            const token = await getToken();

            if (!token) {
              Alert.alert(
                'Session Expired',
                'Please login again.'
              );
              return;
            }

            const response = await fetch(
              `${API_BASE_URL}/api/users/profile`,
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            const data = await response.json();

            console.log(
              'Delete Account Response:',
              data
            );

            if (!response.ok) {
              Alert.alert(
                'Delete Failed',
                data.message ||
                  'Unable to delete account.'
              );
              return;
            }

           if (data.success) {
  console.log('ACCOUNT DELETED SUCCESSFULLY');

  // Clear login/session data
  await logout();

  // Go to Home screen just like Logout
  router.replace('/(home)/home');

  return;
}
          } catch (error) {
            console.error(
              'Delete Account Error:',
              error
            );

            Alert.alert(
              'Connection Error',
              'Cannot connect to backend. Please try again.'
            );
          } finally {
            setLoading(false);
          }
        },
      },
    ]
  );
};
  // =====================================================
  // UI
  // =====================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Profile" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* =================================================
            PROFILE CARD
        ================================================= */}

        <View style={styles.profileCard}>

          <View style={styles.avatarContainer}>

            <Ionicons
              name="person"
              size={30}
              color="#555"
            />

            <View style={styles.verifiedBadge}>
              <Ionicons
                name="checkmark"
                size={12}
                color="#FFFFFF"
              />
            </View>

          </View>

          <View style={styles.profileInfo}>

            <View style={styles.nameRow}>

              <Text
                style={styles.name}
                numberOfLines={1}
              >
                {loading
                  ? 'Loading...'
                  : displayName}
              </Text>

            <TouchableOpacity
  style={styles.editButton}
  onPress={() =>
    router.push({
      pathname: '/(home)/edit-profile',
      params: {
        from: 'profile',
      },
    })
  }
>
                <Ionicons
                  name="pencil"
                  size={12}
                  color="#FFFFFF"
                />

                <Text style={styles.editButtonText}>
                  Edit
                </Text>
              </TouchableOpacity>

            </View>

            <View style={styles.phoneRow}>

              <Ionicons
                name="call-outline"
                size={14}
                color="#666"
              />

              <Text style={styles.phone}>
                +91 {displayPhone}
              </Text>

            </View>

            {(profile?.address || user?.address) && (
  <View style={styles.addressRow}>
    <Ionicons
      name="location-outline"
      size={14}
      color="#666"
    />

    {/* <Text style={styles.address}>
      {profile?.address || user?.address}
    </Text> */}
    <Text>
  {String(user?.address || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ")}
</Text>
  </View>
)}

            {displayEmail ? (
              <View style={styles.phoneRow}>

                <Ionicons
                  name="mail-outline"
                  size={14}
                  color="#666"
                />

                <Text
                  style={styles.phone}
                  numberOfLines={1}
                >
                  {displayEmail}
                </Text>

              </View>
            ) : null}

          </View>

        </View>

        {/* =================================================
            ACCOUNT OVERVIEW
        ================================================= */}

        <View style={styles.sectionCard}>

          <Text style={styles.sectionHeading}>
            Account Overview
          </Text>

       <MenuRow
  iconBg="#EDE9FE"
  icon={
    <MaterialCommunityIcons
      name="shopping-outline"
      size={20}
      color="#7C3AED"
    />
  }
  title="Orders"
  subtitle="Check all your orders"
 onPress={() =>
  // router.push({
  //   pathname: '/(home)/my-orders',
  //   params: {
  //     returnTo: 'profile',
  //   },
  // })
  router.push({
  pathname: '/(home)/my-orders',
  params: {
    from: 'profile',
  },
})
}
/>

          <MenuRow
            iconBg="#DDF7E8"
            icon={
              <MaterialCommunityIcons
                name="account-group-outline"
                size={20}
                color="#1C9C57"
              />
            }
            title="Refer & Earn"
            subtitle="Invite friends and earn rewards"
          />

          <MenuRow
            iconBg="#EDE9FE"
            icon={
              <MaterialCommunityIcons
                name="shield-outline"
                size={20}
                color="#7C3AED"
              />
            }
            title="Security"
            subtitle="Change your password"
          />

          <MenuRow
            iconBg="#FBE3E3"
            icon={
              <Ionicons
                name="trash-outline"
                size={20}
                color="#E53935"
              />
            }
            title="Delete Account"
            subtitle="Permanently remove your account data"
            onPress={handleDeleteAccount}
          />

          <MenuRow
            iconBg="#DCE8FE"
            icon={
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#1C6FD9"
              />
            }
            title="Logout"
            subtitle="Logout from your account"
            onPress={handleLogout}
            isLast
          />

        </View>

        {/* =================================================
            SUPPORT & INFORMATION
        ================================================= */}

        <View style={styles.sectionCard}>

          <Text style={styles.sectionHeading}>
            Support & Information
          </Text>

          <MenuRow
            iconBg="#EDE9FE"
            icon={
              <Ionicons
                name="help-circle-outline"
                size={20}
                color="#7C3AED"
              />
            }
            title="Help Center"
            subtitle="Get help and support"
          />

          <MenuRow
            iconBg="#FBE3E3"
            icon={
              <Ionicons
                name="location-outline"
                size={20}
                color="#E53935"
              />
            }
            title="Saved Addresses"
           onPress={() =>
  router.push({
    pathname: '/(home)/saved-addresses',
    params: {
      returnTo: 'profile',
    },
  })
}
          />

          <MenuRow
            iconBg="#FDEBD3"
            icon={
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#D97706"
              />
            }
            title="Terms & Conditions"
            subtitle="Read our terms of service"
          />

          <MenuRow
            iconBg="#E5E7EB"
            icon={
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={20}
                color="#4B5563"
              />
            }
            title="Privacy Policy"
            subtitle="Our privacy procedures"
            isLast
          />

        </View>

        {/* =================================================
            FOLLOW US
        ================================================= */}

        <View style={styles.sectionCard}>

          <Text style={styles.followHeading}>
            Follow Us
          </Text>

          <MenuRow
            iconBg="#FDF1E7"
            icon={
              <Ionicons
                name="logo-instagram"
                size={20}
                color="#E4405F"
              />
            }
            title="Instagram"
          />

          <MenuRow
            iconBg="#DDF7E8"
            icon={
              <Ionicons
                name="logo-whatsapp"
                size={20}
                color="#25D366"
              />
            }
            title="Whatsapp"
          />

          <MenuRow
            iconBg="#DCE8FE"
            icon={
              <Ionicons
                name="logo-facebook"
                size={20}
                color="#1877F2"
              />
            }
            title="Facebook"
            isLast
          />

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// =====================================================
// MENU ROW
// =====================================================

type MenuRowProps = {
  iconBg: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  isLast?: boolean;
};

function MenuRow({
  iconBg,
  icon,
  title,
  subtitle,
  onPress,
  isLast,
}: MenuRowProps) {
  return (
    <TouchableOpacity
      style={[
        styles.menuRow,
        !isLast && styles.menuRowBorder,
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >

      <View
        style={[
          styles.menuIcon,
          {
            backgroundColor: iconBg,
          },
        ]}
      >
        {icon}
      </View>

      <View style={styles.menuTextContainer}>

        <Text style={styles.menuTitle}>
          {title}
        </Text>

        {subtitle && (
          <Text style={styles.menuSubtitle}>
            {subtitle}
          </Text>
        )}

      </View>

    </TouchableOpacity>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: SCREEN_BOTTOM_PADDING,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },

  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#1C9C57',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1C9C57',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginRight: 10,
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C6FD9',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  editButtonText: {
    marginLeft: 4,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  phone: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
    flexShrink: 1,
  },
  addressRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginTop: 6,
},

address: {
  marginLeft: 6,
  fontSize: 14,
  color: '#666',
  flex: 1,
},

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },

  sectionHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#222',
    marginBottom: 12,
  },

  followHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },

  menuRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
  },

  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  menuTextContainer: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },

  menuSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
    lineHeight: 19,
  },
});
