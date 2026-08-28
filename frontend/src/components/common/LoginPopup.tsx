
import { router } from 'expo-router';
import React, { useState } from 'react';
import {Alert,Image,KeyboardAvoidingView,Modal,Platform,Pressable,StyleSheet,Text,TextInput,TouchableOpacity,} from 'react-native';
import { API_BASE_URL } from '@/constants/api';
type LoginPopupProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function LoginPopup({
  visible,
  onClose,
}: LoginPopupProps) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (mobileNumber.length !== 10 || loading) {
      return;
    }

    setLoading(true);

    try {
      // Call backend to send OTP
      const response = await fetch(
        `${API_BASE_URL}/api/mobile-auth/send-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: mobileNumber,
          }),
        }
      );

  const responseText = await response.text();

console.log('STATUS:', response.status);
console.log('RESPONSE:', responseText);

let data;

try {
  data = JSON.parse(responseText);
} catch (error) {
  console.log('NOT JSON:', responseText);

  Alert.alert(
    'Backend Error',
    `Server returned ${response.status}. Check console.`
  );

  return;
}

if (!response.ok) {
  Alert.alert(
    'Login Failed',
    data.message || 'Unable to send OTP'
  );
  return;
}

      // Backend successfully created OTP
      Alert.alert(
        'OTP Sent',
        'Testing OTP is 1234'
      );

      // Close popup
      onClose();

      // Open OTP screen
      router.push({
        pathname: '/(auth)/otp',
        params: {
          mobile: mobileNumber,
        },
      });

    } catch (error) {
      console.error('Send OTP Error:', error);

      Alert.alert(
        'Connection Error',
        'Cannot connect to backend. Make sure the backend is running and your IP address is correct.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        {/* Background */}
        <Pressable
          style={styles.overlay}
          onPress={onClose}
        >
          {/* Popup */}
          <Pressable
            style={styles.container}
            onPress={() => {}}
          >
            <Image
              source={require('../../assets/images/LoginImage.png')}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={styles.title}>
              Login Or Sign in
            </Text>

            <TextInput
              placeholder="Enter your mobile number"
              placeholderTextColor="#999"
              value={mobileNumber}
              onChangeText={(text) => {
                const formatted = text
                  .replace(/\D/g, '')
                  .slice(0, 10);

                setMobileNumber(formatted);
              }}
              keyboardType={
                Platform.OS === 'web'
                  ? 'numeric'
                  : 'number-pad'
              }
              maxLength={10}
              autoFocus
              style={styles.input}
            />

            {/* Validation */}
            {mobileNumber.length > 0 &&
              mobileNumber.length < 10 && (
                <Text style={styles.errorText}>
                  Please enter a valid 10-digit mobile number
                </Text>
              )}

            {/* Confirm */}
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    mobileNumber.length === 10 &&
                    !loading
                      ? '#1C9C57'
                      : '#B5B5B5',
                },
              ]}
              disabled={
                mobileNumber.length !== 10 ||
                loading
              }
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Sending OTP...' : 'Confirm'}
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
  },

  image: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginBottom: 20,
  },

  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 25,
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#222',
  },

  errorText: {
    color: '#E53935',
    marginTop: 8,
    fontSize: 13,
  },

  button: {
    marginTop: 24,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});