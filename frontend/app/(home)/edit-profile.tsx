
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

import ScreenHeader from '@/components/common/ScreenHeader';
import { useAuth } from '@/hooks/useAuth';


export default function EditProfileScreen() {

  const { user, updateUser } = useAuth();

  const insets = useSafeAreaInsets();


  const [fullName, setFullName] = useState(
    user?.fullName ?? ''
  );

  const [phone, setPhone] = useState(
    user?.mobile ?? ''
  );

  const [email, setEmail] = useState(
    user?.email ?? ''
  );

  const [dob, setDob] = useState(
    user?.dob ?? ''
  );

  const [address, setAddress] = useState(
    user?.address ?? ''
  );


  const [submitting, setSubmitting] = useState(false);



  const isFormValid =
    fullName.trim().length > 0 &&
    phone.length === 10;



  const handleSave = async () => {

    if (!isFormValid || submitting) return;


    setSubmitting(true);


    try {

      await updateUser({

        fullName: fullName.trim(),

        mobile: phone,

        email: email.trim(),

        dob: dob.trim(),

        address: address.trim(),

      });


      router.back();


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


        <View style={styles.flex}>


          <ScreenHeader
            title="Edit Profile"
          />



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




            <View style={styles.avatarWrapper}>


              <View style={styles.avatarContainer}>


                <Ionicons
                  name="person"
                  size={30}
                  color="#555"
                />


                <TouchableOpacity
                  style={styles.avatarEditBadge}
                >

                  <Ionicons
                    name="add"
                    size={16}
                    color="#222"
                  />

                </TouchableOpacity>


              </View>


            </View>





            <Text style={styles.updateTitle}>
              Update Profile Details
            </Text>


            <Text style={styles.updateSubtitle}>
              Keep your account information fresh and accurate
            </Text>





            <Text style={styles.sectionLabel}>
              Basic Information
            </Text>



            <View style={styles.card}>



              <Text style={styles.label}>
                Full name
                <Text style={styles.required}>
                  *
                </Text>
              </Text>



              <TextInput

                autoFocus

                placeholder="Enter your name"

                placeholderTextColor="#9A9A9A"

                value={fullName}

                onChangeText={(text)=>
                  setFullName(text)
                }

                style={styles.input}

                returnKeyType="next"
                 
              />






              <Text style={styles.label}>

                Phone number
                <Text style={styles.required}>
                  *
                </Text>

              </Text>




              <TextInput

                placeholder="Enter your phone number"

                placeholderTextColor="#9A9A9A"

                value={phone}


                onChangeText={(text)=>{

                  setPhone(
                    text
                    .replace(/[^0-9]/g,'')
                    .slice(0,10)
                  );

                }}


                style={styles.input}

                keyboardType="number-pad"

                maxLength={10}

                returnKeyType="next"

              />







              <Text style={styles.label}>
                Email
              </Text>




              <TextInput

                placeholder="Enter your email"

                placeholderTextColor="#9A9A9A"

                value={email}

                onChangeText={setEmail}

                style={styles.input}

                keyboardType="email-address"

                autoCapitalize="none"

              />



            </View>






            <Text style={styles.sectionLabel}>
              Personal Information
            </Text>





            <View style={styles.card}>



              <Text style={styles.label}>

                Date of Birth

                <Text style={styles.required}>
                  *
                </Text>

              </Text>



              <TextInput

                placeholder="Enter DOB"

                placeholderTextColor="#9A9A9A"

                value={dob}

                onChangeText={setDob}

                style={styles.input}

              />






              <Text style={styles.label}>
                Address
              </Text>





              <TextInput

                placeholder="Enter Your Complete address"

                placeholderTextColor="#9A9A9A"

                value={address}

                onChangeText={setAddress}

                style={styles.input}

              />



            </View>







            <TouchableOpacity

              disabled={
                !isFormValid ||
                submitting
              }

              onPress={handleSave}


              style={[
                styles.saveButton,
                {
                  backgroundColor:
                  isFormValid
                  ? '#1C9C57'
                  : '#B5B5B5'
                }
              ]}


            >

              <Text style={styles.saveButtonText}>

                {
                  submitting
                  ? "Saving..."
                  : "Save Changes"
                }

              </Text>


            </TouchableOpacity>





          </ScrollView>



        </View>



      </KeyboardAvoidingView>



    </SafeAreaView>

  );

}






const styles = StyleSheet.create({

safeArea:{
  flex:1,
  backgroundColor:'#F5F5F5'
},


flex:{
  flex:1
},


scrollContent:{
  paddingHorizontal:20,
  paddingBottom:40
},


avatarWrapper:{
  alignItems:'center',
  marginTop:8
},


avatarContainer:{

  width:88,

  height:88,

  borderRadius:20,

  borderWidth:1.5,

  borderColor:'#1C9C57',

  backgroundColor:'#EDEDED',

  justifyContent:'center',

  alignItems:'center'

},


avatarEditBadge:{

 position:'absolute',

 bottom:-6,

 right:-6,

 width:28,

 height:28,

 borderRadius:14,

 backgroundColor:'#fff',

 justifyContent:'center',

 alignItems:'center',

 elevation:3

},


updateTitle:{

 textAlign:'center',

 fontSize:19,

 fontWeight:'700',

 color:'#222',

 marginTop:16

},


updateSubtitle:{

 textAlign:'center',

 fontSize:13,

 color:'#777',

 marginTop:4,

 marginBottom:24

},


sectionLabel:{

 fontSize:16,

 fontWeight:'700',

 color:'#222',

 marginBottom:10

},


card:{

 backgroundColor:'#fff',

 borderRadius:20,

 padding:20,

 marginBottom:24

},


label:{

 fontSize:15,

 color:'#222',

 marginBottom:8

},


required:{

 color:'#E53935'

},


input:{

 height:52,

 borderWidth:1,

 borderColor:'#D9D9D9',

 borderRadius:26,

 paddingHorizontal:18,

 fontSize:15,

 color:'#222',

 marginBottom:18

},


saveButton:{

 height:56,

 borderRadius:28,

 justifyContent:'center',

 alignItems:'center'

},


saveButtonText:{

 fontSize:17,

 fontWeight:'600',

 color:'#fff'

}

});