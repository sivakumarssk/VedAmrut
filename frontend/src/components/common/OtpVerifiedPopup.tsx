import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
};

export default function OtpVerifiedPopup({
  visible,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback>
        <View style={styles.overlay}>

          <View style={styles.container}>

            <Image
              source={require('../../assets/images/OtpSuccess.png')}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={styles.title}>
              OTP Is Verified{"\n"}
              Successfully
            </Text>

          </View>

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
    paddingHorizontal: 32,
  },

  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },

  image: {
    width: 120,
    height: 120,
  },

  title: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#11884A',
    lineHeight: 34,
  },

});