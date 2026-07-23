import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CountdownTimer from '../../src/components/auth/CountdownTimer';
import OTPInput from '../../src/components/auth/OTPInput';
import OtpVerifiedPopup from '../../src/components/common/OtpVerifiedPopup';

export default function OtpScreen() {
    const [otp, setOtp] = useState([
  '',
  '',
  '',
  '',
]);
const { mobile } = useLocalSearchParams(); 
const [showSuccessPopup,setShowSuccessPopup] = useState(false);
useEffect(() => {
  if (!showSuccessPopup) return;

  const timer = setTimeout(() => {
    setShowSuccessPopup(false);
    router.replace({
      pathname: '/(auth)/register',
      params: { mobile },
    });
  }, 2000);

  return () => clearTimeout(timer);
}, [showSuccessPopup]);
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
  style={styles.flex}
  behavior={
    Platform.OS === 'ios'
      ? 'padding'
      : 'height'
  }
  keyboardVerticalOffset={80}
>
        <ScrollView
  contentContainerStyle={styles.scrollContent}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
>
          {/* Back Button */}
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
            Verification Email
          </Text>

          {/* Subtitle */}
          <Text style={styles.subTitle}>
            we have sent a verification code{"\n"}
            to +91 {mobile}
          </Text>

          {/* OTP Boxes (Temporary) */}
          <OTPInput
          otp={otp}
          setOtp={setOtp}
          />

          {/* Timer */}
          {/* <View style={styles.timerRow}>
            <Text style={styles.timerText}>
              Auto Verification is enabled
            </Text>

            <Text style={styles.timerText}>
              70 Sec
            </Text>
          </View> */}

          {/* Resend */}
          {/* <TouchableOpacity>
            <Text style={styles.resendText}>
              Didn't receive OTP ?
            </Text>
          </TouchableOpacity> */}
          <CountdownTimer
      onResend={() => {
        console.log('Resend OTP');
      }}
    />

          {/* Confirm Button */}
         <TouchableOpacity
         onPress={() => {
      setShowSuccessPopup(true);
    }}
      style={[
        styles.confirmButton,
        {
          backgroundColor:
            otp.every(item => item !== '')
              ? '#1C9C57'
              : '#B5B5B5',
        },
      ]}

      disabled={!otp.every(item => item !== '')}

    >
      <Text style={styles.confirmText}>
        Confirm
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

  otpContainer: {
    marginTop: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  otpBox: {
    width: 56,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#92F0C2',
    borderRadius: 14,
  },

  timerRow: {
    marginTop: 34,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  timerText: {
    fontSize: 15,
    color: '#3A3A3A',
    marginHorizontal: 8,
  },

  resendText: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },

  confirmButton: {
    marginTop: 40,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#8B8B8B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },

});