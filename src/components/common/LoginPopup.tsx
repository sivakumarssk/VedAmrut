import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native';

type LoginPopupProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function LoginPopup({
  visible,
  onClose,
  onConfirm,
}: LoginPopupProps) {
    const [mobileNumber, setMobileNumber] = useState('');
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>

          <TouchableWithoutFeedback>
            <View style={styles.container}>

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
  keyboardType="number-pad"
  maxLength={10}
  value={mobileNumber}
  onChangeText={(text) => {
    const formatted = text.replace(/[^0-9]/g, '');
    setMobileNumber(formatted);
  }}
  style={styles.input}
/>

{mobileNumber.length > 0 &&
 mobileNumber.length < 10 && (
  <Text style={styles.errorText}>
    Please enter a valid 10-digit mobile number
  </Text>
)}


             <TouchableOpacity
  style={[
    styles.button,
    {
      backgroundColor:
        mobileNumber.length === 10
          ? '#1C9C57'
          : '#B5B5B5',
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
  <Text style={styles.buttonText}>
    Confirm
  </Text>
</TouchableOpacity>

            </View>
          </TouchableWithoutFeedback>

        </View>
      </TouchableWithoutFeedback>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 30,
    height:500,
  },

  image: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginBottom: 28,
  },

  title: {
  textAlign: 'center',
  fontSize: 20,
  fontWeight: '700',
  color: '#222',
  marginTop: 10,
  marginBottom: 30,
},

  input: {
  height: 56,
  borderWidth: 1,
  borderColor: '#D9D9D9',
  borderRadius: 14,
  paddingHorizontal: 16,
  fontSize: 16,
},

  button: {
    marginTop: 26,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#B5B5B5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
  marginTop: 8,
  color: '#E53935',
  fontSize: 13,
},

});