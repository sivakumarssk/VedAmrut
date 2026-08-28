
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import CountdownTimer from '../../src/components/auth/CountdownTimer';
import OTPInput from '../../src/components/auth/OTPInput';
import OtpVerifiedPopup from '../../src/components/common/OtpVerifiedPopup';
import { API_BASE_URL } from '@/constants/api';
import { saveToken } from '@/utils/storage';

export default function OtpScreen() {
  const [otp, setOtp] = useState(['', '', '', '', ]);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const { mobile } = useLocalSearchParams();

  const phone = Array.isArray(mobile) ? mobile[0] : mobile;
const { login } = useAuth();
  useEffect(() => {
    if (!showSuccessPopup) return;

    const timer = setTimeout(() => {
      setShowSuccessPopup(false);

      router.replace('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [showSuccessPopup]);

  const handleVerifyOTP = async () => {
    const enteredOTP = otp.join('');

    if (enteredOTP.length !== 4) {
  Alert.alert('Invalid OTP', 'Please enter 4 digit OTP');
  return;
}

    if (!phone) {
      Alert.alert('Error', 'Mobile number not found');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
         `${API_BASE_URL}/api/mobile-auth/verify-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone,
            otp: enteredOTP,
          }),
        }
      );

      const data = await response.json();

      console.log('OTP Verify Response:', data);

      if (!response.ok) {
        Alert.alert(
          'OTP Failed',
          data.message || 'Invalid OTP'
        );
        return;
      }

      // Existing user
      if (data.isNewUser === false) {
      await login(
  {
    id: data.user.id,
    fullName: data.user.name,
    email: data.user.email,
    mobile: data.user.phone,
    address: '',
    role: data.user.role,
  },
  data.token
);

        setShowSuccessPopup(true);

        return;
      }

      // New user
      if (data.isNewUser === true) {
        router.replace({
          pathname: '/(auth)/register',
          params: {
            mobile: phone,
          },
        });
      }

    } catch (error) {
      console.error('OTP verification error:', error);

      Alert.alert(
        'Connection Error',
        'Cannot connect to backend. Make sure your backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={28}
              color="#222"
            />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>
            Verification
          </Text>

          {/* Subtitle */}
          <Text style={styles.subTitle}>
            We have sent a verification code{'\n'}
            to +91 {phone}
          </Text>

          {/* OTP */}
          <OTPInput
            otp={otp}
            setOtp={setOtp}
          />

          {/* Timer */}
          <CountdownTimer
            onResend={() => {
              console.log('Resend OTP');
            }}
          />

          {/* Confirm */}
          <TouchableOpacity
            onPress={handleVerifyOTP}
            disabled={
              otp.some(item => item === '') || loading
            }
            style={[
              styles.confirmButton,
              {
                backgroundColor:
                  otp.every(item => item !== '') && !loading
                    ? '#1C9C57'
                    : '#B5B5B5',
              },
            ]}
          >
            <Text style={styles.confirmText}>
              {loading ? 'Verifying...' : 'Confirm'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <OtpVerifiedPopup
        visible={showSuccessPopup}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  backButton: {
    marginTop: 12,
    width: 40,
  },

  title: {
    marginTop: 55,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
    color: '#222',
  },

  subTitle: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
    color: '#6E6E6E',
    lineHeight: 22,
  },

  confirmButton: {
    marginTop: 40,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});