// import React, { useRef } from 'react';
// import {
//   StyleSheet,
//   TextInput,
//   View,
// } from 'react-native';

// type OTPInputProps = {
//   otp: string[];
//   setOtp: React.Dispatch<React.SetStateAction<string[]>>;
// };

// export default function OTPInput({
//   otp,
//   setOtp,
// }: OTPInputProps) {

//   const inputRefs = useRef<TextInput[]>([]);

//   const handleChange = (text: string, index: number) => {

//     if (!/^\d?$/.test(text)) return;

//     const newOtp = [...otp];
//     newOtp[index] = text;

//     setOtp(newOtp);

//     if (text && index < 3) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleBackspace = (
//     key: string,
//     index: number,
//   ) => {

//     if (
//       key === 'Backspace' &&
//       otp[index] === '' &&
//       index > 0
//     ) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   return (
//     <View style={styles.container}>

//       {otp.map((digit, index) => (

//         <TextInput
//           key={index}
//           ref={(ref) => {
//             if (ref) {
//               inputRefs.current[index] = ref;
//             }
//           }}
//           value={digit}
//           onChangeText={(text) =>
//             handleChange(text, index)
//           }
//           onKeyPress={({ nativeEvent }) =>
//             handleBackspace(
//               nativeEvent.key,
//               index
//             )
//           }
//           keyboardType="number-pad"
//           maxLength={1}
//           style={styles.input}
//           textAlign="center"
//           autoFocus={index === 0}
//         />

//       ))}

//     </View>
//   );
// }

// const styles = StyleSheet.create({

//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 55,
//     paddingHorizontal: 12,
//   },

//   input: {
//     width: 58,
//     height: 58,

//     borderWidth: 1.5,
//     borderColor: '#8DE5B5',

//     borderRadius: 14,

//     fontSize: 24,
//     fontWeight: '600',

//     color: '#222',

//     backgroundColor: '#FFFFFF',
//   },

// });
import React, { useRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
} from "react-native";

type OTPInputProps = {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function OTPInput({
  otp,
  setOtp,
}: OTPInputProps) {

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {

    const value = text.slice(-1);

    const updatedOtp = [...otp];
    updatedOtp[index] = value;

    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };


  return (
    <View style={styles.container}>
      {otp.map((value, index) => (
        <TextInput
          key={index}

          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}

          value={value}

          onChangeText={(text) =>
            handleChange(text, index)
          }

          keyboardType="number-pad"

          inputMode="numeric"

          maxLength={1}

          editable={true}

          autoFocus={index === 0}

          style={styles.input}

          textAlign="center"

        />
      ))}
    </View>
  );
}


const styles = StyleSheet.create({

  container:{
    marginTop:55,
    flexDirection:"row",
    justifyContent:"space-between",
    paddingHorizontal:20,
  },


  input:{
    width:56,
    height:56,
    borderWidth:1.5,
    borderColor:"#92F0C2",
    borderRadius:14,
    fontSize:22,
    fontWeight:"700",
    color:"#222",
  }

});