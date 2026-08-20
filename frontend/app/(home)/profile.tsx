import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '@/components/common/ScreenHeader';
import { SCREEN_BOTTOM_PADDING } from '@/constants/Layout';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(home)/home');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently remove your account data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(home)/home');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Profile" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={30} color="#555" />
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {user?.fullName ?? 'Guest User'}
              </Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => router.push('/(home)/edit-profile')}
              >
                <Ionicons name="pencil" size={12} color="#FFFFFF" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.phoneRow}>
              <Ionicons name="call-outline" size={14} color="#666" />
              <Text style={styles.phone}>
                +91 {user?.mobile ?? '0000000000'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Account Overview</Text>

          <MenuRow
            iconBg="#EDE9FE"
            icon={
              <MaterialCommunityIcons
                name="shield-outline"
                size={20}
                color="#7C3AED"
              />
            }
            title="Orders"
            subtitle="Check all your orders"
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
              <Ionicons name="trash-outline" size={20} color="#E53935" />
            }
            title="Delete Account"
            subtitle="Permanently remove your account data"
            onPress={handleDeleteAccount}
          />

          <MenuRow
            iconBg="#DCE8FE"
            icon={<Ionicons name="log-out-outline" size={20} color="#1C6FD9" />}
            title="Logout"
            subtitle="Change your password"
            onPress={handleLogout}
            isLast
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Support & Information</Text>

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
            icon={<Ionicons name="location-outline" size={20} color="#E53935" />}
            title="Saved Addresses"
            onPress={() => router.push('/(home)/saved-addresses')}
          />

          <MenuRow
            iconBg="#FDEBD3"
            icon={
              <Ionicons name="document-text-outline" size={20} color="#D97706" />
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
            subtitle="Our refund procedures"
            isLast
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.followHeading}>Follow Us</Text>

          <MenuRow
            iconBg="#FDF1E7"
            icon={
              <Ionicons name="logo-instagram" size={20} color="#E4405F" />
            }
            title="Instagram"
          />

          <MenuRow
            iconBg="#DDF7E8"
            icon={<Ionicons name="logo-whatsapp" size={20} color="#25D366" />}
            title="Whatsapp"
          />

          <MenuRow
            iconBg="#DCE8FE"
            icon={<Ionicons name="logo-facebook" size={20} color="#1877F2" />}
            title="Facebook"
            isLast
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
      style={[styles.menuRow, !isLast && styles.menuRowBorder]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.menuIcon, { backgroundColor: iconBg }]}>
        {icon}
      </View>

      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
}

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
