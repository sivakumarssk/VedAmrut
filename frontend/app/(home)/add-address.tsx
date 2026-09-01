import { Ionicons } from '@expo/vector-icons';
import { router,useLocalSearchParams,} from 'expo-router';
import React, { useEffect, useMemo, useState,} from 'react';
import {Alert,KeyboardAvoidingView,Platform,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View,} from 'react-native';
import {SafeAreaView,useSafeAreaInsets,} from 'react-native-safe-area-context';
import { useAddress } from '@/hooks/useAddress';
import { SavedAddress } from '@/utils/storage';

const LABELS: SavedAddress['label'][] = ['Home','Work','Other',];

export default function AddAddressScreen() {

  const params = useLocalSearchParams<{
    id?: string | string[];
    returnTo?: string | string[];
    mode?: string | string[];
    productId?: string | string[];
    productName?: string | string[];
    productPrice?: string | string[];
    productImage?: string | string[];
    categoryName?: string | string[];
    quantity?: string | string[];
  }>();

  const getParam = (value?: string | string[],): string => {
    if (Array.isArray(value)) {
      return value[0] || '';
    }
    return value || '';
  };

  const addressId = getParam(params.id);
  const returnTo = getParam(params.returnTo);
  const mode = getParam(params.mode);
  const productId = getParam(params.productId);
  const productName = getParam(
    params.productName,
  );

  const productPrice = getParam(
    params.productPrice,
  );

  const productImage = getParam(
    params.productImage,
  );

  const categoryName = getParam(
    params.categoryName,
  );
  const quantity =getParam(params.quantity) || '1';
  const { addresses, addAddress, updateAddress,} = useAddress();
  const insets = useSafeAreaInsets();

  const existingAddress = useMemo(() => {
    if (!addressId) {
      return undefined;
    }
    return addresses.find(
      (item) =>
        String(item.id) ===  String(addressId),
     );
  }, [addresses, addressId]);
 
const isEditing = Boolean(addressId && existingAddress);

const [fullName, setFullName] = useState('');
const [addressLine, setAddressLine] = useState('');
const [area, setArea] = useState('');
const [city, setCity] = useState('');
const [state, setState] = useState('');
const [pincode, setPincode] = useState('');
const [phone, setPhone] = useState('');
const [label, setLabel] =
  useState<SavedAddress['label']>('Home');
const [submitting, setSubmitting] = useState(false);

useEffect(() => {
  // ============================================
  // EDIT ADDRESS
  // ============================================

  if (addressId && existingAddress) {
    setFullName(existingAddress.fullName ?? '');
    setAddressLine(existingAddress.addressLine ?? '');
    setArea(existingAddress.area ?? '');
    setCity(existingAddress.city ?? '');
    setState(existingAddress.state ?? '');
    setPincode(String(existingAddress.pincode ?? ''));
    setPhone(String(existingAddress.phone ?? ''));
    setLabel(existingAddress.label ?? 'Home');

    return;
  }

  // ============================================
  // ADD NEW ADDRESS
  // ALWAYS CLEAR OLD FORM DATA
  // ============================================

  setFullName('');
  setAddressLine('');
  setArea('');
  setCity('');
  setState('');
  setPincode('');
  setPhone('');
  setLabel('Home');
}, [addressId, existingAddress]);
  // =====================================================
  // VALIDATION
  // =====================================================

  const isFormValid =
    fullName.trim().length > 0 &&
    addressLine.trim().length > 0 &&
    area.trim().length > 0 &&
    city.trim().length > 0 &&
    state.trim().length > 0 &&
    /^\d{6}$/.test(pincode) &&
    /^\d{10}$/.test(phone);

  // =====================================================
  // NAVIGATION PARAMS
  // =====================================================

  const getNavigationParams = () => {
    const navigationParams: Record<
      string,
      string
    > = {};

    if (returnTo) {
      navigationParams.returnTo =
        returnTo;
    }

    if (mode) {
      navigationParams.mode = mode;
    }

    if (mode === 'buyNow') {
      if (productId) {
        navigationParams.productId =
          productId;
      }

      if (productName) {
        navigationParams.productName =
          productName;
      }

      if (productPrice) {
        navigationParams.productPrice =
          productPrice;
      }

      if (productImage) {
        navigationParams.productImage =
          productImage;
      }

      if (categoryName) {
        navigationParams.categoryName =
          categoryName;
      }

      navigationParams.quantity =
        quantity;
    }

    return navigationParams;
  };

  // =====================================================
  // GO TO SAVED ADDRESSES
  // =====================================================


const goToSavedAddresses = () => {
  // ============================================
  // BUY NOW FLOW
  // ============================================
  if (mode === 'buyNow') {
    router.replace({
      pathname: '/(home)/saved-addresses',
      params: {
        returnTo: 'checkout',
        mode: 'buyNow',
        productId,
        productName,
        productPrice,
        productImage,
        categoryName,
        quantity,
      },
    });
    return;
  }

  // ============================================
  // PRODUCT DETAILS NORMAL FLOW
  // ============================================
  if (returnTo === 'product-details') {
    router.replace({
      pathname: '/(home)/product-details',
      params: {
        id: productId,
      },
    });
    return;
  }

  // ============================================
  // DEFAULT
  // ============================================
  router.replace({
    pathname: '/(home)/saved-addresses',
    params: getNavigationParams(),
  });
};
  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {
    if (!isFormValid || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      const addressData = {
        fullName: fullName.trim(),
        addressLine:
          addressLine.trim(),
        area: area.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        phone: phone.trim(),
        label,
      };

      // ===============================================
      // UPDATE
      // ===============================================

      if (
        isEditing &&
        existingAddress
      ) {
        await updateAddress({
          ...existingAddress,
          ...addressData,
        });

        console.log(
          'ADDRESS UPDATED SUCCESSFULLY',
        );
      }

      // ===============================================
      // ADD
      // ===============================================

      else {
        await addAddress(
          addressData,
        );

        console.log(
          'ADDRESS ADDED SUCCESSFULLY',
        );
      }

      // ===============================================
      // ALWAYS RETURN TO SAVED ADDRESSES
      // ===============================================

      goToSavedAddresses();
    } catch (error: any) {
      console.error(
        'ADDRESS SAVE ERROR:',
        error,
      );

      Alert.alert(
        'Unable to save address',
        error?.message ||
          'Something went wrong while saving the address.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // BACK
  // =====================================================

//  const handleBack = () => {
//   if (returnTo) {
//     router.back();
//   } else {
//     goToSavedAddresses();
//   }
// };
// =====================================================
// BACK → SAVED ADDRESSES
// =====================================================

const handleBack = () => {
  console.log('================================');
  console.log('ADD/EDIT ADDRESS → BACK PRESSED');
  console.log('RETURNING TO SAVED ADDRESSES');
  console.log('================================');

  router.replace({
    pathname: '/(home)/saved-addresses',
    params: {
      returnTo: returnTo || '',
      mode: mode || '',
      productId: productId || '',
      productName: productName || '',
      productPrice: productPrice || '',
      productImage: productImage || '',
      categoryName: categoryName || '',
      quantity: quantity || '1',
    },
  });
};


  // =====================================================
  // UI
  // =====================================================

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
            : undefined
        }
        keyboardVerticalOffset={80}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={handleBack}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#222"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {isEditing
              ? 'Edit Address'
              : 'Add New Address'}
          </Text>

          <View
            style={styles.headerRight}
          />
        </View>

        {/* FORM */}

        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom:
                120 + insets.bottom,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          <Text style={styles.label}>
            Full name
          </Text>

          <TextInput
            autoFocus={!isEditing}
            placeholder="Enter recipient's name"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            returnKeyType="next"
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
            returnKeyType="next"
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
            returnKeyType="next"
          />

          {/* PINCODE + CITY */}

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
                onChangeText={(text) => {
                  const cleaned =
                    text.replace(
                      /[^0-9]/g,
                      '',
                    );

                  setPincode(
                    cleaned.slice(0, 6),
                  );
                }}
                style={styles.input}
                returnKeyType="next"
              />
            </View>

            <View
              style={[
                styles.halfField,
                styles.halfFieldRight,
              ]}
            >
              <Text style={styles.label}>
                City
              </Text>

              <TextInput
                placeholder="City"
                placeholderTextColor="#999"
                value={city}
                onChangeText={setCity}
                style={styles.input}
                returnKeyType="next"
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
            returnKeyType="next"
          />

          <Text style={styles.label}>
            Phone Number
          </Text>

          <TextInput
            placeholder="Enter your 10 digit mobile number"
            placeholderTextColor="#999"
            value={phone}
            keyboardType="number-pad"
            maxLength={10}
            onChangeText={(text) => {
              const cleaned =
                text.replace(
                  /[^0-9]/g,
                  '',
                );

              setPhone(
                cleaned.slice(0, 10),
              );
            }}
            style={styles.input}
            returnKeyType="done"
          />

          <Text style={styles.label}>
            Save as
          </Text>

          <View style={styles.labelRow}>
            {LABELS.map((item) => {
              const active =
                label === item;

              return (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.8}
                  onPress={() =>
                    setLabel(item)
                  }
                  style={[
                    styles.labelChip,
                    active &&
                      styles.labelChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.labelChipText,
                      active &&
                        styles.labelChipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={
              !isFormValid ||
              submitting
            }
            onPress={handleSave}
            style={[
              styles.saveButton,
              {
                backgroundColor:
                  isFormValid &&
                  !submitting
                    ? '#1C9C57'
                    : '#B5B5B5',
              },
            ]}
          >
            <Text
              style={
                styles.saveButtonText
              }
            >
              {submitting
                ? 'Saving...'
                : isEditing
                ? 'Update Address'
                : 'Save Address'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  flex: {
    flex: 1,
  },

  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 19,
    fontWeight: '600',
    color: '#222222',
  },

  headerRight: {
    width: 40,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222222',
    marginTop: 18,
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#222222',
    backgroundColor: '#FFFFFF',
  },

  row: {
    flexDirection: 'row',
  },

  halfField: {
    flex: 1,
  },

  halfFieldRight: {
    marginLeft: 12,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  labelChip: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },

  labelChipActive: {
    backgroundColor: '#1C9C57',
    borderColor: '#1C9C57',
  },

  labelChipText: {
    color: '#444444',
    fontSize: 14,
    fontWeight: '600',
  },

  labelChipTextActive: {
    color: '#FFFFFF',
  },

  saveButton: {
    marginTop: 32,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});