import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../src/components/common/ScreenHeader';
import { useAddress } from '../../src/hooks/useAddress';
import { SavedAddress } from '../../src/utils/storage';


type AddressIconProps = {
  label: SavedAddress['label'];
};


function AddressIcon({ label }: AddressIconProps) {

  let iconName:
    | 'home-outline'
    | 'domain'
    | 'map-marker-outline';

  if (label === 'Home') {
    iconName = 'home-outline';
  } 
  else if (label === 'Work') {
    iconName = 'domain';
  } 
  else {
    iconName = 'map-marker-outline';
  }


  return (
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons
        name={iconName}
        size={22}
        color="#222"
      />
    </View>
  );
}



export default function SavedAddressesScreen() {


  const {
    addresses = [],
    selectedAddressId,
    selectAddress,
    deleteAddress,
  } = useAddress();



  const [menuOpenFor, setMenuOpenFor] =
    useState<string | null>(null);



  const handleDelete = async () => {

    if(menuOpenFor){

      await deleteAddress(menuOpenFor);

      setMenuOpenFor(null);
    }

  };



  return (

    <SafeAreaView style={styles.safeArea}>


      <ScreenHeader title="Saved Addresses" />



      {/* ADD NEW */}

      <TouchableOpacity

        style={styles.addNewButton}

        onPress={() =>
          router.push('/(home)/add-address')
        }

      >

        <View style={styles.addNewLeft}>

          <Ionicons
            name="add"
            size={20}
            color="#1C6FD9"
          />

          <Text style={styles.addNewText}>
            Add New
          </Text>

        </View>


        <Ionicons
          name="chevron-forward"
          size={18}
          color="#1C6FD9"
        />

      </TouchableOpacity>





      {
        addresses.length > 0 && (

          <Text style={styles.sectionLabel}>
            Saved addresses
          </Text>

        )
      }






      <FlatList

        data={addresses}

        keyExtractor={(item)=>item.id}

        showsVerticalScrollIndicator={false}

        contentContainerStyle={styles.listContent}



        ListEmptyComponent={

          <View style={styles.emptyContainer}>

            <Ionicons
              name="location-outline"
              size={48}
              color="#B5B5B5"
            />

            <Text style={styles.emptyText}>
              No saved addresses yet
            </Text>


          </View>

        }



        renderItem={({item})=>(



          <TouchableOpacity


            style={[
              styles.addressCard,

              item.id === selectedAddressId &&
              styles.addressCardSelected
            ]}



            activeOpacity={0.8}



            onPress={async()=>{

              await selectAddress(item.id);

              router.back();

            }}


          >



            <AddressIcon label={item.label}/>




            <View style={styles.addressInfo}>


              <Text style={styles.name}>
                {item.fullName}
              </Text>



              <Text style={styles.addressLine}>

                {item.addressLine},
                {' '}
                {item.area},
                {' '}
                {item.city},
                {' '}
                {item.state}
                {' - '}
                {item.pincode}

              </Text>



              <View style={styles.phoneRow}>


                <Ionicons
                  name="call-outline"
                  size={14}
                  color="#555"
                />

                <Text style={styles.phone}>
                  {item.phone}
                </Text>


              </View>


            </View>




            <TouchableOpacity

              style={styles.menuButton}

              onPress={()=>
                setMenuOpenFor(item.id)
              }

            >

              <Ionicons
                name="ellipsis-vertical"
                size={18}
                color="#444"
              />

            </TouchableOpacity>



          </TouchableOpacity>


        )}

      />






      {/* MENU MODAL */}


      <Modal

        visible={menuOpenFor !== null}

        transparent

        animationType="fade"

        onRequestClose={()=>
          setMenuOpenFor(null)
        }

      >



        <TouchableWithoutFeedback

          onPress={()=>
            setMenuOpenFor(null)
          }

        >

          <View style={styles.modalOverlay}>


            <TouchableWithoutFeedback>


              <View style={styles.menuCard}>




                {/* EDIT */}

                <TouchableOpacity


                  style={styles.menuItem}


                  onPress={()=>{


                    const id = menuOpenFor;


                    setMenuOpenFor(null);



                    if(id){

                      router.push({

                        pathname:'/(home)/add-address',

                        params:{
                          id
                        }

                      });

                    }


                  }}

                >

                  <Ionicons

                    name="create-outline"

                    size={18}

                    color="#222"

                  />


                  <Text style={styles.menuItemText}>
                    Edit
                  </Text>


                </TouchableOpacity>






                {/* DELETE */}


                <TouchableOpacity

                  style={styles.menuItem}

                  onPress={handleDelete}

                >


                  <Ionicons

                    name="trash-outline"

                    size={18}

                    color="#E53935"

                  />



                  <Text

                    style={[
                      styles.menuItemText,
                      {
                        color:'#E53935'
                      }
                    ]}

                  >

                    Delete

                  </Text>



                </TouchableOpacity>



              </View>


            </TouchableWithoutFeedback>


          </View>


        </TouchableWithoutFeedback>


      </Modal>



    </SafeAreaView>


  );
}






const styles = StyleSheet.create({


safeArea:{
  flex:1,
  backgroundColor:'#F7F8FA'
},


addNewButton:{
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'space-between',
  backgroundColor:'#E3F0FE',
  borderRadius:18,
  marginHorizontal:20,
  paddingHorizontal:20,
  paddingVertical:18
},


addNewLeft:{
  flexDirection:'row',
  alignItems:'center'
},


addNewText:{
  marginLeft:8,
  fontSize:16,
  fontWeight:'700',
  color:'#1C6FD9'
},


sectionLabel:{
  fontSize:16,
  color:'#333',
  marginHorizontal:20,
  marginTop:24,
  marginBottom:12
},


listContent:{
  paddingHorizontal:20,
  paddingBottom:40
},


emptyContainer:{
  alignItems:'center',
  marginTop:60
},


emptyText:{
  marginTop:12,
  fontSize:15,
  color:'#888'
},



addressCard:{
  flexDirection:'row',
  alignItems:'flex-start',
  borderWidth:1,
  borderColor:'#E4E4E4',
  borderRadius:16,
  padding:16,
  marginBottom:16,
  backgroundColor:'#fff'
},


addressCardSelected:{
  borderColor:'#1C9C57'
},



iconContainer:{
  width:44,
  height:44,
  borderRadius:12,
  backgroundColor:'#E3F0FE',
  justifyContent:'center',
  alignItems:'center',
  marginRight:14
},



addressInfo:{
  flex:1
},


name:{
  fontSize:17,
  fontWeight:'700',
  color:'#222'
},


addressLine:{
  fontSize:14,
  color:'#555',
  marginTop:4,
  lineHeight:20
},


phoneRow:{
  flexDirection:'row',
  alignItems:'center',
  marginTop:8
},


phone:{
  marginLeft:6,
  fontSize:14,
  fontWeight:'600',
  color:'#333'
},



menuButton:{
  padding:6
},



modalOverlay:{
  flex:1,
  backgroundColor:'rgba(0,0,0,0.25)',
  justifyContent:'center',
  alignItems:'center'
},



menuCard:{
  width:180,
  backgroundColor:'#fff',
  borderRadius:16,
  paddingVertical:8
},


menuItem:{
  flexDirection:'row',
  alignItems:'center',
  paddingHorizontal:18,
  paddingVertical:14
},



menuItemText:{
  marginLeft:10,
  fontSize:15,
  fontWeight:'500',
  color:'#222'
}


});