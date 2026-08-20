

import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Background */}
        <Pressable style={styles.overlay} onPress={onClose}>
          {/* Popup */}
          <Pressable style={styles.container} onPress={() => {}}>
            <Image
              source={require('../../assets/images/LoginImage.png')}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={styles.title}>Login Or Sign in</Text>

            <TextInput
              placeholder="Enter your mobile number"
              placeholderTextColor="#999"
              value={mobileNumber}
              onChangeText={(text) => {
                const formatted = text.replace(/\D/g, '').slice(0, 10);
                setMobileNumber(formatted);
              }}
              keyboardType={Platform.OS === 'web' ? 'numeric' : 'number-pad'}
              maxLength={10}
              autoFocus
              style={styles.input}
            />

            {mobileNumber.length > 0 && mobileNumber.length < 10 && (
              <Text style={styles.errorText}>
                Please enter a valid 10-digit mobile number
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    mobileNumber.length === 10 ? '#1C9C57' : '#B5B5B5',
                },
              ]}
              disabled={mobileNumber.length !== 10}
              onPress={() => {
                onClose();

                router.push({
                  pathname: '/(auth)/otp',
                  params: {
                    mobile: mobileNumber,
                  },
                });
              }}
            >
              <Text style={styles.buttonText}>Confirm</Text>
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