import React, { useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

type OTPInputProps = {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function OTPInput({
  otp,
  setOtp,
}: OTPInputProps) {

  const inputRefs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {

    if (!/^\d?$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;

    setOtp(newOtp);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (
    key: string,
    index: number,
  ) => {

    if (
      key === 'Backspace' &&
      otp[index] === '' &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>

      {otp.map((digit, index) => (

        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) {
              inputRefs.current[index] = ref;
            }
          }}
          value={digit}
          onChangeText={(text) =>
            handleChange(text, index)
          }
          onKeyPress={({ nativeEvent }) =>
            handleBackspace(
              nativeEvent.key,
              index
            )
          }
          keyboardType="number-pad"
          maxLength={1}
          style={styles.input}
          textAlign="center"
          autoFocus={index === 0}
        />

      ))}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 55,
    paddingHorizontal: 12,
  },

  input: {
    width: 58,
    height: 58,

    borderWidth: 1.5,
    borderColor: '#8DE5B5',

    borderRadius: 14,

    fontSize: 24,
    fontWeight: '600',

    color: '#222',

    backgroundColor: '#FFFFFF',
  },

});