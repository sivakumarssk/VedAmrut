
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

import ScreenHeader from '@/components/common/ScreenHeader';
import { useAddress } from '@/hooks/useAddress';
import { SavedAddress } from '@/utils/storage';

const LABELS: SavedAddress['label'][] = ['Home', 'Work', 'Other'];

export default function AddAddressScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const { addresses, addAddress, updateAddress } = useAddress();

  const insets = useSafeAreaInsets();

  const existing = addresses.find((item) => item.id === id);

  const isEditing = !!existing;


  const [fullName, setFullName] = useState(existing?.fullName ?? '');
  const [addressLine, setAddressLine] = useState(existing?.addressLine ?? '');
  const [area, setArea] = useState(existing?.area ?? '');
  const [city, setCity] = useState(existing?.city ?? '');
  const [state, setState] = useState(existing?.state ?? '');
  const [pincode, setPincode] = useState(existing?.pincode ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');

  const [label, setLabel] =
    useState<SavedAddress['label']>(
      existing?.label ?? 'Home'
    );

  const [submitting, setSubmitting] = useState(false);



  const isFormValid =
    fullName.trim().length > 0 &&
    addressLine.trim().length > 0 &&
    area.trim().length > 0 &&
    city.trim().length > 0 &&
    state.trim().length > 0 &&
    pincode.length === 6 &&
    phone.length === 10;



  const handleSave = async () => {

    if (!isFormValid || submitting) return;

    setSubmitting(true);

    try {

      if (isEditing && existing) {

        await updateAddress({
          ...existing,
          fullName: fullName.trim(),
          addressLine: addressLine.trim(),
          area: area.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode,
          phone,
          label,
        });


      } else {


        await addAddress({

          fullName: fullName.trim(),
          addressLine: addressLine.trim(),
          area: area.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode,
          phone,
          label,

        });

      }


      router.back();


    } finally {

      setSubmitting(false);

    }

  };




  return (

    <SafeAreaView style={styles.safeArea} edges={['top']}>

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

            title={
              isEditing
                ? 'Edit Address'
                : 'Add New Address'
            }

            titleStyle={styles.title}

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



            <Text style={styles.label}>
              Full name
            </Text>


            <TextInput

              autoFocus

              placeholder="Enter recipient's name"

              placeholderTextColor="#999"

              value={fullName}

              onChangeText={setFullName}

              style={styles.input}

            />




            <Text style={styles.label}>
              Flat, House no., Building
            </Text>


            <TextInput

              placeholder="Flat, House no., Building, Company"

              placeholderTextColor="#999"

              value={addressLine}

              onChangeText={setAddressLine}

              style={styles.input}

            />




            <Text style={styles.label}>
              Area, Street, Locality
            </Text>


            <TextInput

              placeholder="Area, Colony, Street"

              placeholderTextColor="#999"

              value={area}

              onChangeText={setArea}

              style={styles.input}

            />




            <View style={styles.row}>


              <View style={styles.halfField}>


                <Text style={styles.label}>
                  Pincode
                </Text>


                <TextInput

                  placeholder="6 digit pincode"

                  placeholderTextColor="#999"

                  value={pincode}

                  keyboardType="number-pad"

                  maxLength={6}

                  onChangeText={(text)=>{

                    setPincode(
                      text
                      .replace(/[^0-9]/g,'')
                      .slice(0,6)
                    );

                  }}

                  style={styles.input}

                />


              </View>





              <View style={[
                styles.halfField,
                styles.halfFieldRight
              ]}>


                <Text style={styles.label}>
                  City
                </Text>


                <TextInput

                  placeholder="City"

                  placeholderTextColor="#999"

                  value={city}

                  onChangeText={setCity}

                  style={styles.input}

                />


              </View>


            </View>





            <Text style={styles.label}>
              State
            </Text>


            <TextInput

              placeholder="State"

              placeholderTextColor="#999"

              value={state}

              onChangeText={setState}

              style={styles.input}

            />





            <Text style={styles.label}>
              Phone Number
            </Text>


            <TextInput

              placeholder="Enter Your 10 Digit Mobile Number"

              placeholderTextColor="#999"

              value={phone}

              keyboardType="number-pad"

              maxLength={10}

              onChangeText={(text)=>{

                setPhone(
                  text
                  .replace(/[^0-9]/g,'')
                  .slice(0,10)
                );

              }}

              style={styles.input}

            />






            <Text style={styles.label}>
              Save as
            </Text>



            <View style={styles.labelRow}>


              {
                LABELS.map((item)=>(

                  <TouchableOpacity

                    key={item}

                    onPress={()=>{
                      setLabel(item)
                    }}

                    style={[
                      styles.labelChip,
                      label===item &&
                      styles.labelChipActive
                    ]}

                  >


                    <Text

                      style={[
                        styles.labelChipText,
                        label===item &&
                        styles.labelChipTextActive
                      ]}

                    >

                      {item}

                    </Text>


                  </TouchableOpacity>


                ))
              }


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
                  : "Save Address"
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
  backgroundColor:'#fff'
},

flex:{
  flex:1
},

title:{
  fontSize:19
},


scrollContent:{
  paddingHorizontal:20
},


label:{
  fontSize:14,
  color:'#222',
  marginTop:18,
  marginBottom:8
},


input:{

 height:52,

 borderWidth:1,

 borderColor:'#D9D9D9',

 borderRadius:14,

 paddingHorizontal:16,

 fontSize:15,

 color:'#222'

},


row:{
 flexDirection:'row'
},


halfField:{
 flex:1
},


halfFieldRight:{
 marginLeft:12
},


labelRow:{
 flexDirection:'row'
},


labelChip:{
 borderWidth:1,
 borderColor:'#D9D9D9',
 borderRadius:20,
 paddingHorizontal:18,
 paddingVertical:10,
 marginRight:12
},


labelChipActive:{
 backgroundColor:'#1C9C57',
 borderColor:'#1C9C57'
},


labelChipText:{
 color:'#444',
 fontWeight:'600'
},


labelChipTextActive:{
 color:'#fff'
},


saveButton:{
 marginTop:32,
 height:56,
 borderRadius:28,
 alignItems:'center',
 justifyContent:'center'
},


saveButtonText:{
 color:'#fff',
 fontSize:17,
 fontWeight:'600'
}


});