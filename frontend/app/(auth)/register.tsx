import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/useAuth';

export default function RegisterScreen() {
  const { mobile } = useLocalSearchParams<{ mobile?: string }>();
  const { register } = useAuth();
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(mobile ?? '');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form validation
  const isFormValid =
    fullName.trim().length > 0 &&
    /^\S+@\S+\.\S+$/.test(email.trim()) &&
    phone.length === 10 &&
    address.trim().length > 0 &&
    password.length >= 6 &&
    password === confirmPassword;

  // Create account
  const handleCreateAccount = async () => {
    if (!isFormValid || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await register(
        fullName.trim(),
        email.trim(),
        phone,
        password,
        address.trim()
      );

      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(home)/home');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Registration error:', error);

      Alert.alert(
        'Registration Failed',
        error?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: 120 + insets.bottom,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={28}
              color="#222"
            />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>
            Register
          </Text>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Full Name */}
            <Text style={styles.label}>
              Full name
            </Text>

            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              autoCapitalize="words"
              autoCorrect={false}
            />

            {/* Email */}
            <Text style={styles.label}>
              Email
            </Text>

            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Phone */}
            <Text style={styles.label}>
              Phone Number
            </Text>

            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.flagEmoji}>
                  🇮🇳
                </Text>

                <Text style={styles.countryText}>
                  +91
                </Text>

                <Ionicons
                  name="chevron-down"
                  size={16}
                  color="#666"
                />
              </View>

              <View style={styles.divider} />

              <TextInput
                placeholder="Enter 10 digit mobile number"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={(text) =>
                  setPhone(
                    text
                      .replace(/[^0-9]/g, '')
                      .slice(0, 10)
                  )
                }
                style={styles.phoneInput}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>

            {/* Address */}
            <Text style={styles.label}>
              Address
            </Text>

            <TextInput
              placeholder="Enter your complete address"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
              multiline={false}
            />

            {/* Password */}
            <Text style={styles.label}>
              Password
            </Text>

            <View style={styles.passwordRow}>
              <TextInput
                placeholder="Create password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                onPress={() =>
                  setShowPassword(!showPassword)
                }
                activeOpacity={0.7}
              >
                <Ionicons
                  name={
                    showPassword
                      ? 'eye-outline'
                      : 'eye-off-outline'
                  }
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <Text style={styles.label}>
              Confirm Password
            </Text>

            <View style={styles.passwordRow}>
              <TextInput
                placeholder="Confirm password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.passwordInput}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                onPress={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                activeOpacity={0.7}
              >
                <Ionicons
                  name={
                    showConfirmPassword
                      ? 'eye-outline'
                      : 'eye-off-outline'
                  }
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Password Hint */}
            {password.length > 0 &&
              password.length < 6 && (
                <Text style={styles.errorText}>
                  Password must be at least 6 characters
                </Text>
              )}

            {confirmPassword.length > 0 &&
              password !== confirmPassword && (
                <Text style={styles.errorText}>
                  Passwords do not match
                </Text>
              )}
          </View>

          {/* Create Account Button */}
          <TouchableOpacity
            style={[
              styles.createButton,
              {
                backgroundColor: isFormValid
                  ? '#1C9C57'
                  : '#B5B5B5',
              },
            ]}
            disabled={!isFormValid || submitting}
            onPress={handleCreateAccount}
            activeOpacity={0.8}
          >
            <Text style={styles.createButtonText}>
              {submitting
                ? 'Creating...'
                : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  backButton: {
    marginTop: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },

  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    marginTop: 8,
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 26,
    paddingHorizontal: 18,
    fontSize: 15,
    color: '#222',
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
  },

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 26,
    paddingHorizontal: 14,
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
  },

  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  flagEmoji: {
    fontSize: 18,
    marginRight: 5,
  },

  countryText: {
    fontSize: 14,
    color: '#333',
    marginRight: 4,
  },

  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#DDD',
    marginHorizontal: 12,
  },

  phoneInput: {
    flex: 1,
    fontSize: 15,
    color: '#222',
  },

  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 26,
    paddingHorizontal: 18,
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
  },

  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: '#222',
  },

  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 12,
    marginLeft: 4,
  },

  createButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },

  createButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});