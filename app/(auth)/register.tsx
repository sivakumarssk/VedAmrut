// import { Ionicons } from '@expo/vector-icons';
// import { router, useLocalSearchParams } from 'expo-router';
// import React, { useState } from 'react';
// import {
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from 'react-native';
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';

// import { useAuth } from '@/hooks/useAuth';

// export default function RegisterScreen() {
//   const { mobile } = useLocalSearchParams<{ mobile?: string }>();
//   const { login } = useAuth();
//   const insets = useSafeAreaInsets();

//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState(mobile ?? '');
//   const [address, setAddress] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const isFormValid =
//     fullName.trim().length > 0 &&
//     /^\S+@\S+\.\S+$/.test(email.trim()) &&
//     phone.length === 10 &&
//     address.trim().length > 0 &&
//     password.length >= 6 &&
//     password === confirmPassword;

//   const handleCreateAccount = async () => {
//     if (!isFormValid || submitting) return;

//     setSubmitting(true);
//     try {
//       await login({
//         fullName: fullName.trim(),
//         email: email.trim(),
//         mobile: phone,
//         address: address.trim(),
//       });
//       router.replace('/(home)/home');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea} edges={['top']}>
//       <KeyboardAvoidingView
//         style={styles.flex}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <View style={styles.flex}>
//             <ScrollView
//               contentContainerStyle={[
//                 styles.scrollContent,
//                 { paddingBottom: 40 + insets.bottom },
//               ]}
//               keyboardShouldPersistTaps="handled"
//               showsVerticalScrollIndicator={false}
//             >
//               <TouchableOpacity
//                 style={styles.backButton}
//                 onPress={() => router.back()}
//               >
//                 <Ionicons name="arrow-back" size={28} color="#222" />
//               </TouchableOpacity>

//               <Text style={styles.title}>Register</Text>

//               <View style={styles.card}>
//                 <Text style={styles.label}>Full name</Text>
//                 <TextInput
//                   placeholder="Enter your name"
//                   placeholderTextColor="#9A9A9A"
//                   value={fullName}
//                   onChangeText={setFullName}
//                   style={styles.input}
//                   returnKeyType="next"
//                 />

//                 <Text style={styles.label}>Email</Text>
//                 <TextInput
//                   placeholder="Enter your email"
//                   placeholderTextColor="#9A9A9A"
//                   value={email}
//                   onChangeText={setEmail}
//                   style={styles.input}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   returnKeyType="next"
//                 />

//                 <Text style={styles.label}>Phone Number</Text>
//                 <View style={styles.phoneRow}>
//                   <View style={styles.countryCode}>
//                     <Text style={styles.flagEmoji}>🇮🇳</Text>
//                     <Ionicons
//                       name="chevron-down"
//                       size={16}
//                       color="#6E6E6E"
//                       style={{ marginLeft: 4 }}
//                     />
//                   </View>
//                   <View style={styles.divider} />
//                   <TextInput
//                     placeholder="Enter Your 10 Digit Mobile Number"
//                     placeholderTextColor="#9A9A9A"
//                     value={phone}
//                     onChangeText={(text) =>
//                       setPhone(text.replace(/[^0-9]/g, '').slice(0, 10))
//                     }
//                     style={styles.phoneInput}
//                     keyboardType="number-pad"
//                     maxLength={10}
//                     returnKeyType="next"
//                   />
//                 </View>

//                 <Text style={styles.label}>Address</Text>
//                 <TextInput
//                   placeholder="Enter Your Complete address"
//                   placeholderTextColor="#9A9A9A"
//                   value={address}
//                   onChangeText={setAddress}
//                   style={styles.input}
//                   returnKeyType="next"
//                 />

//                 <Text style={styles.label}>Password</Text>
//                 <View style={styles.passwordRow}>
//                   <TextInput
//                     placeholder="Create a strong password"
//                     placeholderTextColor="#9A9A9A"
//                     value={password}
//                     onChangeText={setPassword}
//                     style={styles.passwordInput}
//                     secureTextEntry={!showPassword}
//                     returnKeyType="next"
//                   />
//                   <TouchableOpacity
//                     onPress={() => setShowPassword((prev) => !prev)}
//                   >
//                     <Ionicons
//                       name={showPassword ? 'eye-outline' : 'eye-off-outline'}
//                       size={22}
//                       color="#6E6E6E"
//                     />
//                   </TouchableOpacity>
//                 </View>

//                 <Text style={styles.label}>Confirm Password</Text>
//                 <View style={styles.passwordRow}>
//                   <TextInput
//                     placeholder="Confirm your password"
//                     placeholderTextColor="#9A9A9A"
//                     value={confirmPassword}
//                     onChangeText={setConfirmPassword}
//                     style={styles.passwordInput}
//                     secureTextEntry={!showConfirmPassword}
//                     returnKeyType="done"
//                   />
//                   <TouchableOpacity
//                     onPress={() => setShowConfirmPassword((prev) => !prev)}
//                   >
//                     <Ionicons
//                       name={
//                         showConfirmPassword ? 'eye-outline' : 'eye-off-outline'
//                       }
//                       size={22}
//                       color="#6E6E6E"
//                     />
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               <TouchableOpacity
//                 style={[
//                   styles.createButton,
//                   {
//                     backgroundColor: isFormValid ? '#1C9C57' : '#B5B5B5',
//                   },
//                 ]}
//                 disabled={!isFormValid || submitting}
//                 onPress={handleCreateAccount}
//               >
//                 <Text style={styles.createButtonText}>
//                   {submitting ? 'Creating...' : 'Create Account'}
//                 </Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   flex: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 40,
//   },
//   backButton: {
//     marginTop: 8,
//     width: 40,
//   },
//   title: {
//     textAlign: 'center',
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#222',
//     marginTop: 8,
//     marginBottom: 20,
//   },
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 24,
//     paddingHorizontal: 20,
//     paddingTop: 24,
//     paddingBottom: 8,
//   },
//   label: {
//     fontSize: 14,
//     color: '#222',
//     marginBottom: 8,
//   },
//   input: {
//     height: 52,
//     borderWidth: 1,
//     borderColor: '#D9D9D9',
//     borderRadius: 26,
//     paddingHorizontal: 18,
//     fontSize: 15,
//     color: '#222',
//     marginBottom: 18,
//   },
//   phoneRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     height: 52,
//     borderWidth: 1,
//     borderColor: '#D9D9D9',
//     borderRadius: 26,
//     paddingHorizontal: 14,
//     marginBottom: 18,
//   },
//   countryCode: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   flagEmoji: {
//     fontSize: 18,
//   },
//   divider: {
//     width: 1,
//     height: 24,
//     backgroundColor: '#D9D9D9',
//     marginHorizontal: 12,
//   },
//   phoneInput: {
//     flex: 1,
//     fontSize: 14,
//     color: '#222',
//   },
//   passwordRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     height: 52,
//     borderWidth: 1,
//     borderColor: '#D9D9D9',
//     borderRadius: 26,
//     paddingHorizontal: 18,
//     marginBottom: 18,
//   },
//   passwordInput: {
//     flex: 1,
//     fontSize: 15,
//     color: '#222',
//   },
//   createButton: {
//     marginTop: 16,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   createButtonText: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
// });

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
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

  const { login } = useAuth();

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



  const isFormValid =
    fullName.trim().length > 0 &&
    /^\S+@\S+\.\S+$/.test(email.trim()) &&
    phone.length === 10 &&
    address.trim().length > 0 &&
    password.length >= 6 &&
    password === confirmPassword;



  const handleCreateAccount = async () => {

    if (!isFormValid || submitting) return;


    setSubmitting(true);

    try {

      await login({

        fullName: fullName.trim(),

        email: email.trim(),

        mobile: phone,

        address: address.trim(),

      });


      router.replace('/(home)/home');


    } finally {

      setSubmitting(false);

    }

  };



  return (

    <SafeAreaView 
      style={styles.safeArea}
      edges={['top']}
    >

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

  contentContainerStyle={[
    styles.scrollContent,
    {
      paddingBottom:
      120 + insets.bottom
    }
  ]}

  keyboardShouldPersistTaps="always"

  keyboardDismissMode="none"

  showsVerticalScrollIndicator={false}

>



          <TouchableOpacity

            style={styles.backButton}

            onPress={()=>router.back()}

          >

            <Ionicons 
              name="arrow-back"
              size={28}
              color="#222"
            />

          </TouchableOpacity>




          <Text style={styles.title}>
            Register
          </Text>




          <View style={styles.card}>


            <Text style={styles.label}>
              Full name
            </Text>


            <TextInput

              placeholder="Enter your name"

              placeholderTextColor="#999"

              value={fullName}

              onChangeText={(text)=>{

                console.log(text);

                setFullName(text);

              }}

              style={styles.input}

              autoCapitalize="words"

            />




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

            />





            <Text style={styles.label}>
              Phone Number
            </Text>



            <View style={styles.phoneRow}>


              <View style={styles.countryCode}>

                <Text style={styles.flagEmoji}>
                  🇮🇳
                </Text>


                <Ionicons

                  name="chevron-down"

                  size={16}

                  color="#666"

                />

              </View>



              <View style={styles.divider}/>



              <TextInput

                placeholder="Enter 10 digit mobile number"

                placeholderTextColor="#999"

                value={phone}

                onChangeText={(text)=>

                  setPhone(
                    text
                    .replace(/[^0-9]/g,'')
                    .slice(0,10)
                  )

                }

                style={styles.phoneInput}

                keyboardType="number-pad"

                maxLength={10}

              />


            </View>





            <Text style={styles.label}>
              Address
            </Text>


            <TextInput

              placeholder="Enter your complete address"

              placeholderTextColor="#999"

              value={address}

              onChangeText={setAddress}

              style={styles.input}

            />






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

              />



              <TouchableOpacity

                onPress={()=>setShowPassword(!showPassword)}

              >

                <Ionicons

                  name={
                    showPassword
                    ? "eye-outline"
                    :"eye-off-outline"
                  }

                  size={22}

                  color="#666"

                />


              </TouchableOpacity>


            </View>






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

              />



              <TouchableOpacity

                onPress={()=>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }

              >

                <Ionicons

                  name={
                    showConfirmPassword
                    ?"eye-outline"
                    :"eye-off-outline"
                  }

                  size={22}

                  color="#666"

                />

              </TouchableOpacity>


            </View>



          </View>






          <TouchableOpacity

            style={[
              styles.createButton,
              {
                backgroundColor:
                isFormValid
                ? "#1C9C57"
                :"#B5B5B5"
              }
            ]}

            disabled={!isFormValid || submitting}

            onPress={handleCreateAccount}

          >

            <Text style={styles.createButtonText}>

              {
                submitting
                ?"Creating..."
                :"Create Account"
              }

            </Text>


          </TouchableOpacity>




        </ScrollView>


      </KeyboardAvoidingView>


    </SafeAreaView>

  );

}





const styles = StyleSheet.create({

safeArea:{
 flex:1,
 backgroundColor:"#F5F5F5"
},


flex:{
 flex:1
},


scrollContent:{
 paddingHorizontal:20,
 paddingBottom:40
},


backButton:{
 marginTop:8,
 width:40
},


title:{
 textAlign:"center",
 fontSize:28,
 fontWeight:"700",
 color:"#222",
 marginTop:8,
 marginBottom:20
},


card:{
 backgroundColor:"#fff",
 borderRadius:24,
 padding:20
},


label:{
 fontSize:14,
 color:"#222",
 marginBottom:8
},


input:{
 height:52,
 borderWidth:1,
 borderColor:"#D9D9D9",
 borderRadius:26,
 paddingHorizontal:18,
 fontSize:15,
 color:"#222",
 marginBottom:18
},


phoneRow:{
 flexDirection:"row",
 alignItems:"center",
 height:52,
 borderWidth:1,
 borderColor:"#D9D9D9",
 borderRadius:26,
 paddingHorizontal:14,
 marginBottom:18
},


countryCode:{
 flexDirection:"row",
 alignItems:"center"
},


flagEmoji:{
 fontSize:18
},


divider:{
 width:1,
 height:24,
 backgroundColor:"#ddd",
 marginHorizontal:12
},


phoneInput:{
 flex:1,
 fontSize:15,
 color:"#222"
},


passwordRow:{
 flexDirection:"row",
 alignItems:"center",
 height:52,
 borderWidth:1,
 borderColor:"#D9D9D9",
 borderRadius:26,
 paddingHorizontal:18,
 marginBottom:18
},


passwordInput:{
 flex:1,
 fontSize:15,
 color:"#222"
},


createButton:{
 height:56,
 borderRadius:28,
 justifyContent:"center",
 alignItems:"center",
 marginTop:16
},


createButtonText:{
 color:"#fff",
 fontSize:17,
 fontWeight:"600"
}


});