
import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView,useSafeAreaInsets} from 'react-native-safe-area-context';
import ScreenHeader from '@/components/common/ScreenHeader';
import { useAuth } from '@/hooks/useAuth';

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState( user?.mobile ?? '');
  const [email, setEmail] = useState(user?.email ?? '' );
  const [dob, setDob] = useState(user?.dob ?? '');
  const [address, setAddress] = useState( user?.address ?? '');
  const [submitting, setSubmitting] = useState(false);
  const isFormValid =
    fullName.trim().length > 0 &&
    phone.length === 10 &&
    email.trim().length > 0;
const { from } = useLocalSearchParams<{
  from?: string;
}>();
  // =========================
  // SAVE PROFILE
  // =========================

//  const handleSave = async () => {
//   if (!isFormValid || submitting) {
//     return;
//   }

//   if (!user?.id) {
//     Alert.alert(
//       'Error',
//       'User information not found. Please login again.'
//     );
//     return;
//   }

//   setSubmitting(true);

//   try {
//     console.log('Updating user:', user.id);

//     // AuthContext handles backend + local storage
//     await updateUser({
//       id: user.id,
//       fullName: fullName.trim(),
//       mobile: phone,
//       email: email.trim(),
//       dob: dob.trim(),
//       address: address.trim(),
//       role: user.role,
//     });

//    Alert.alert(
//   'Success',
//   'Profile updated successfully',
//   [
//     {
//       text: 'OK',
//       onPress: () => {
//         if (from === 'profile') {
//           router.replace('/(home)/profile');
//           return;
//         }

//         router.back();
//       },
//     },
//   ]
// );
//   } catch (error) {
//     console.error('Update Profile Error:', error);

//     Alert.alert(
//       'Update Failed',
//       error instanceof Error
//         ? error.message
//         : 'Unable to update profile'
//     );
//   } finally {
//     setSubmitting(false);
//   }
// };
const handleSave = async () => {
  if (!isFormValid || submitting) {
    return;
  }

  if (!user?.id) {
    Alert.alert(
      'Error',
      'User information not found. Please login again.'
    );
    return;
  }

  setSubmitting(true);

  try {
    console.log('Updating user:', user.id);

    await updateUser({
      id: user.id,
      fullName: fullName.trim(),
      mobile: phone,
      email: email.trim(),
      dob: dob.trim(),
      address: address.trim(),
      role: user.role,
    });

    Alert.alert(
      'Success',
      'Profile updated successfully',
      [
        {
          text: 'OK',
          onPress: () => {
            if (from === 'profile') {
              router.replace('/(home)/profile');
            } else {
              router.back();
            }
          },
        },
      ]
    );
  } catch (error) {
    console.error('Update Profile Error:', error);

    Alert.alert(
      'Update Failed',
      error instanceof Error
        ? error.message
        : 'Unable to update profile'
    );
  } finally {
    setSubmitting(false);
  }
};

// =====================================================
// BACK TO PROFILE
// =====================================================

const handleBackToProfile = () => {
  console.log('================================');
  console.log('EDIT PROFILE → BACK PRESSED');
  console.log('GOING TO PROFILE');
  console.log('================================');

  router.replace('/(home)/profile');
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

          {/* <ScreenHeader title="Edit Profile" /> */}
          
<View style={styles.header}>

  <TouchableOpacity
    style={styles.headerBackButton}
    activeOpacity={0.7}
    onPress={handleBackToProfile}
  >
    <Ionicons
      name="arrow-back"
      size={24}
      color="#222222"
    />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>
    Edit Profile
  </Text>

</View>



          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingBottom:
                  120 + insets.bottom,
              },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

            {/* =========================
                AVATAR
            ========================= */}

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

            {/* =========================
                TITLE
            ========================= */}

            <Text style={styles.updateTitle}>
              Update Profile Details
            </Text>

            <Text style={styles.updateSubtitle}>
              Keep your account information fresh and accurate
            </Text>

            {/* =========================
                BASIC INFORMATION
            ========================= */}

            <Text style={styles.sectionLabel}>
              Basic Information
            </Text>

            <View style={styles.card}>

              {/* FULL NAME */}

              <Text style={styles.label}>
                Full name
                <Text style={styles.required}>
                  *
                </Text>
              </Text>

              <TextInput
                placeholder="Enter your name"
                placeholderTextColor="#9A9A9A"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
                returnKeyType="next"
              />

              {/* PHONE */}

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
                onChangeText={(text) => {
                  const formatted =
                    text
                      .replace(/[^0-9]/g, '')
                      .slice(0, 10);

                  setPhone(formatted);
                }}
                style={styles.input}
                keyboardType="number-pad"
                maxLength={10}
                returnKeyType="next"
              />

              {/* EMAIL */}

              <Text style={styles.label}>
                Email
                <Text style={styles.required}>
                  *
                </Text>
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

            {/* =========================
                PERSONAL INFORMATION
            ========================= */}

            <Text style={styles.sectionLabel}>
              Personal Information
            </Text>

            <View style={styles.card}>

              {/* DOB */}

              <Text style={styles.label}>
                Date of Birth
              </Text>

            <TextInput
  placeholder="DD/MM/YYYY"
  placeholderTextColor="#9A9A9A"
  value={dob}
  onChangeText={setDob}
  style={styles.input}
/>

              {/* ADDRESS */}

              <Text style={styles.label}>
                Address
              </Text>

              <TextInput
                placeholder="Enter Your Complete address"
                placeholderTextColor="#9A9A9A"
                value={address}
                onChangeText={setAddress}
                style={[
                  styles.input,
                  styles.addressInput,
                ]}
                multiline
                textAlignVertical="top"
              />

            </View>

            {/* =========================
                SAVE BUTTON
            ========================= */}

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
                    isFormValid && !submitting
                      ? '#1C9C57'
                      : '#B5B5B5',
                },
              ]}
            >
              <Text style={styles.saveButtonText}>
                {submitting
                  ? 'Saving...'
                  : 'Save Changes'}
              </Text>
            </TouchableOpacity>

          </ScrollView>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// =========================
// STYLES
// =========================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  flex: {
    flex: 1,
  },

  // =========================
  // HEADER
  // =========================

  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },

  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontFamily: 'InterBold',
    color: '#222222',
    marginLeft: 8,
  },

  // =========================
  // SCROLL
  // =========================

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // =========================
  // AVATAR
  // =========================

  avatarWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },

  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#1C9C57',
    backgroundColor: '#EDEDED',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarEditBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  // =========================
  // TITLE
  // =========================

  updateTitle: {
    textAlign: 'center',
    fontSize: 19,
    fontFamily: 'InterBold',
    color: '#222222',
    marginTop: 16,
  },

  updateSubtitle: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'InterRegular',
    color: '#777777',
    marginTop: 4,
    marginBottom: 24,
  },

  // =========================
  // SECTION
  // =========================

  sectionLabel: {
    fontSize: 16,
    fontFamily: 'InterBold',
    color: '#222222',
    marginBottom: 10,
  },

  // =========================
  // CARD
  // =========================

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },

  // =========================
  // LABELS
  // =========================

  label: {
    fontSize: 15,
    fontFamily: 'InterMedium',
    color: '#222222',
    marginBottom: 8,
  },

  required: {
    color: '#E53935',
    fontFamily: 'InterMedium',
  },

  // =========================
  // INPUT
  // =========================

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 26,
    paddingHorizontal: 18,
    fontSize: 15,
    fontFamily: 'InterRegular',
    color: '#222222',
    marginBottom: 18,
  },

  addressInput: {
    height: 90,
    paddingTop: 16,
    borderRadius: 20,
  },

  // =========================
  // SAVE BUTTON
  // =========================

  saveButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveButtonText: {
    fontSize: 17,
    fontFamily: 'InterSemiBold',
    color: '#FFFFFF',
  },
});