
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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
const [alertVisible, setAlertVisible] = useState(false);
const [alertTitle, setAlertTitle] = useState('');
const [alertMessage, setAlertMessage] = useState('');
const [alertAction, setAlertAction] = useState<
  (() => void | Promise<void>) | null
>(null);
  const { mobile } = useLocalSearchParams();

  const phone = Array.isArray(mobile) ? mobile[0] : mobile;
const { login } = useAuth();
  useEffect(() => {
    if (!showSuccessPopup) return;

    const timer = setTimeout(() => {
      setShowSuccessPopup(false);

      router.replace('/(home)/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [showSuccessPopup]);
const showCustomAlert = (
  title: string,
  message: string,
  action?: () => void | Promise<void>
) => {
  setAlertTitle(title);
  setAlertMessage(message);
  setAlertAction(() => action || null);
  setAlertVisible(true);
};

const handleVerifyOTP = async () => {
  const enteredOTP = otp.join('');

  if (enteredOTP.length !== 4) {
    showCustomAlert(
      'Invalid OTP',
      'Please enter 4 digit OTP'
    );
    return;
  }

  if (!phone) {
    showCustomAlert(
      'Error',
      'Mobile number not found'
    );
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
      showCustomAlert(
        'OTP Failed',
        data.message || 'Invalid OTP'
      );
      return;
    }

    // Existing user: login and go to Home
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

    // New user: go to Register screen
    if (data.isNewUser === true) {
      router.replace({
        pathname: '/(auth)/register',
        params: {
          mobile: phone,
        },
      });
      return;
    }

    showCustomAlert(
      'Login Error',
      'Unable to determine user account status.'
    );

  } catch (error) {
    console.error('OTP verification error:', error);

    showCustomAlert(
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
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
      <Modal
  visible={alertVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setAlertVisible(false)}
>
  <View style={styles.alertOverlay}>
    <View style={styles.alertBox}>
      <Text style={styles.alertTitle}>
        {alertTitle}
      </Text>

      <Text style={styles.alertMessage}>
        {alertMessage}
      </Text>

      <TouchableOpacity
        style={styles.alertButton}
        onPress={async () => {
          setAlertVisible(false);

          if (alertAction) {
            await alertAction();
          }
        }}
      >
        <Text style={styles.alertButtonText}>
          OK
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
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
  marginTop: 20,
  textAlign: 'center',
  fontSize: 32,
  fontFamily: 'InterBold',
  color: '#222',
},

subTitle: {
  marginTop: 12,
  textAlign: 'center',
  fontSize: 14,
  fontFamily: 'InterRegular',
  color: '#6E6E6E',
  lineHeight: 22,
},

confirmText: {
  fontSize: 17,
  fontFamily: 'InterSemiBold',
  color: '#FFFFFF',
},
 
  confirmButton: {
    marginTop: 40,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // =========================
  // CUSTOM ALERT
  // =========================

  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  alertBox: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  alertTitle: {
    fontSize: 20,
    fontFamily: 'InterBold',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 10,
  },

  alertMessage: {
    fontSize: 14,
    fontFamily: 'InterRegular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },

  alertButton: {
    height: 45,
    borderRadius: 22,
    backgroundColor: '#1C9C57',
    justifyContent: 'center',
    alignItems: 'center',
  },

  alertButtonText: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#FFFFFF',
  },

});