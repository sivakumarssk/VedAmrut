import {Ionicons,MaterialCommunityIcons,} from '@expo/vector-icons';
import { router,useLocalSearchParams,} from 'expo-router';
import React from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '@/components/common/ScreenHeader';
import { useAddress } from '@/hooks/useAddress';
import { SavedAddress } from '@/utils/storage';

function AddressIcon({
  label,
}: {
  label: SavedAddress['label'];
}) {
  const iconName =
    label === 'Home'
      ? 'home-outline'
      : label === 'Work'
      ? 'domain'
      : 'map-marker-outline';

  return (
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons
        name={iconName as any}
        size={22}
        color="#222"
      />
    </View>
  );
}

export default function SavedAddressesScreen() {
  // =====================================================
  // PARAMETERS
  // =====================================================

  const params = useLocalSearchParams<{
    returnTo?: string | string[];

    mode?: string | string[];

    productId?: string | string[];
    productName?: string | string[];
    productPrice?: string | string[];
    productImage?: string | string[];
    categoryName?: string | string[];
    quantity?: string | string[];
  }>();

  // =====================================================
  // PARAM HELPER
  // =====================================================

  const getParam = (
    value?: string | string[],
  ): string => {
    if (Array.isArray(value)) {
      return value[0] || '';
    }

    return value || '';
  };

  const returnTo = getParam(params.returnTo);

  const mode = getParam(params.mode);

  const isBuyNow = mode === 'buyNow';

  const productId = getParam(params.productId);

  const productName = getParam(params.productName);

  const productPrice = getParam(params.productPrice);

  const productImage = getParam(params.productImage);

  const categoryName = getParam(params.categoryName);

  const quantity = getParam(params.quantity) || '1';

  // =====================================================
  // ADDRESS HOOK
  // =====================================================

  const {
    addresses,
    selectedAddressId,
    selectAddress,
    deleteAddress,
  } = useAddress();

  // =====================================================
  // NAVIGATION PARAMS
  // =====================================================

  const getNavigationParams = () => {
    const navigationParams: Record<
      string,
      string
    > = {};

    if (returnTo) {
      navigationParams.returnTo = returnTo;
    }

    if (mode) {
      navigationParams.mode = mode;
    }

    if (isBuyNow) {
      if (productId) {
        navigationParams.productId = productId;
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

      navigationParams.quantity = quantity;
    }

    return navigationParams;
  };


// =====================================================
// BACK BUTTON
// =====================================================

const handleBack = () => {
  console.log('================================');
  console.log('SAVED ADDRESSES → BACK PRESSED');
  console.log('RETURN TO:', returnTo);
  console.log('MODE:', mode);
  console.log('================================');


   if (returnTo === 'home') {
    router.replace('/home');
    return;
  }
  // ============================================
  // FROM CHECKOUT
  // ============================================
  if (returnTo === 'checkout') {
    console.log('→ GOING BACK TO CHECKOUT');

    router.replace({
      pathname: '/(home)/checkout',
      params: getNavigationParams(),
    });

    return;
  }

  // ============================================
  // FROM PROFILE
  // ============================================
  if (returnTo === 'profile') {
    console.log('→ GOING BACK TO PROFILE');

    router.replace('/(home)/profile');

    return;
  }

  // ============================================
  // FROM CART
  // ============================================
  if (returnTo === 'cart') {
    console.log('→ GOING BACK TO CART');

    router.replace('/(home)/cart');

    return;
  }

  // ============================================
  // FROM PRODUCT DETAILS
  // ============================================
  if (returnTo === 'product-details') {
    console.log('→ GOING BACK TO PRODUCT DETAILS');

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
  console.log('→ NO RETURN PATH, GOING HOME');

  router.replace('/');
};



  // =====================================================
  // SELECT ADDRESS
  // =====================================================

  const handleSelectAddress = async (
    addressId: string,
  ) => {
    try {
      await selectAddress(addressId);

      // =============================================
      // CHECKOUT
      // =============================================

      if (returnTo === 'checkout') {
      router.replace({
        pathname: '/(home)/checkout',
        params: getNavigationParams(),
      });
      return;
    }

      // =============================================
      // PROFILE
      // =============================================

      if (returnTo === 'profile') {
        router.replace('/(home)/profile');
        return;
      }

      // =============================================
      // CART
      // =============================================

      if (returnTo === 'cart') {
        router.replace('/(home)/cart');
        return;
      }

      // =============================================
      // PRODUCT DETAILS
      // =============================================

//    if (returnTo === 'product-details') {
//   router.replace({
//     pathname: '/(home)/product-details',
//     params: {
//       id: productId,
//     },
//   });
//   return;
// }
// =============================================
// PRODUCT DETAILS / BUY NOW
// =============================================

if (returnTo === 'product-details') {

  // If this came from Buy Now,
  // continue directly to Checkout
  if (mode === 'buyNow') {
    router.replace({
      pathname: '/(home)/checkout',
      params: {
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

  // Normal product-details address selection
  router.replace({
    pathname: '/(home)/product-details',
    params: {
      id: productId,
    },
  });

  return;
}

      // =============================================
      // DEFAULT
      // =============================================

      router.back();
    } catch (error) {
      console.error(
        'Select address error:',
        error,
      );
    }
  };

  // =====================================================
  // ADD NEW ADDRESS
  // =====================================================

  // const handleAddNew = () => {
  //   router.push({
  //     pathname: '/(home)/add-address',
  //     params: getNavigationParams(),
  //   });
  // };
const handleAddNew = () => {
  router.push({
    pathname: '/(home)/add-address',
    params: {
      ...getNavigationParams(),
      mode: 'add',
    },
  });
};
  // =====================================================
  // EDIT ADDRESS
  // =====================================================

  const handleEdit = (id: string) => {
    router.push({
      pathname: '/(home)/add-address',
      params: {
        ...getNavigationParams(),
        id,
      },
    });
  };

  // =====================================================
  // DELETE ADDRESS
  // =====================================================

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAddress(id);
            } catch (error) {
              console.error(
                'Delete address error:',
                error,
              );
            }
          },
        },
      ],
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

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
          Saved Addresses
        </Text>

        <View style={styles.headerRight} />
      </View>

      {/* ================================================= */}
      {/* ADD NEW */}
      {/* ================================================= */}

      <TouchableOpacity
        style={styles.addNewButton}
        activeOpacity={0.8}
        onPress={handleAddNew}
      >
        <View style={styles.addNewLeft}>
          <Ionicons
            name="add"
            size={21}
            color="#1C6FD9"
          />

          <Text style={styles.addNewText}>
            Add New Address
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={19}
          color="#1C6FD9"
        />
      </TouchableOpacity>

      {/* ================================================= */}
      {/* TITLE */}
      {/* ================================================= */}

      {addresses.length > 0 && (
        <Text style={styles.sectionLabel}>
          Saved Addresses
        </Text>
      )}

      {/* ================================================= */}
      {/* ADDRESS LIST */}
      {/* ================================================= */}

      <FlatList
        data={addresses}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
        renderItem={({ item }) => {
          const isSelected =
            String(item.id) ===
            String(selectedAddressId);

          return (
            <TouchableOpacity
              style={[
                styles.addressCard,
                isSelected &&
                  styles.addressCardSelected,
              ]}
              activeOpacity={0.9}
              onPress={() =>
                handleSelectAddress(
                  String(item.id),
                )
              }
            >
              {/* ICON */}

              <AddressIcon label={item.label} />

              {/* DETAILS */}

              <View style={styles.addressInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>
                    {item.fullName}
                  </Text>

                  <View style={styles.labelBadge}>
                    <Text
                      style={
                        styles.labelBadgeText
                      }
                    >
                      {item.label}
                    </Text>
                  </View>
                </View>

               <Text style={styles.addressLine}>
  {[
    item.addressLine,
    item.area,
    item.city,
    item.state,
    item.pincode,
  ]
    .filter(
      (value) =>
        value &&
        value.trim() !== ''
    )
    .join(', ')}
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

                {/* ACTIONS */}

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.editButton}
                    activeOpacity={0.7}
                    onPress={() =>
                      handleEdit(
                        String(item.id),
                      )
                    }
                  >
                    <Ionicons
                      name="create-outline"
                      size={16}
                      color="#1C6FD9"
                    />

                    <Text
                      style={
                        styles.editButtonText
                      }
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      styles.deleteButton
                    }
                    activeOpacity={0.7}
                    onPress={() =>
                      handleDelete(
                        String(item.id),
                      )
                    }
                  >
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color="#E53935"
                    />

                    <Text
                      style={
                        styles.deleteButtonText
                      }
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  // ===================================================
  // HEADER
  // ===================================================

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
    fontFamily: 'InterBold',
    color: '#222222',
  },

  headerRight: {
    width: 40,
  },

  // ===================================================
  // ADD NEW ADDRESS
  // ===================================================

  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E3F0FE',
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  addNewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  addNewText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'InterBold',
    color: '#1C6FD9',
  },

  // ===================================================
  // SECTION
  // ===================================================

  sectionLabel: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#333333',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },

  // ===================================================
  // LIST
  // ===================================================

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },

  emptyText: {
    marginTop: 12,
    fontSize: 15,
    fontFamily: 'InterRegular',
    color: '#888888',
  },

  // ===================================================
  // ADDRESS CARD
  // ===================================================

  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E4E4E4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  addressCardSelected: {
    borderColor: '#1C9C57',
    borderWidth: 1.5,
  },

  // ===================================================
  // ADDRESS ICON
  // ===================================================

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E3F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  // ===================================================
  // ADDRESS DETAILS
  // ===================================================

  addressInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  name: {
    fontSize: 17,
    fontFamily: 'InterBold',
    color: '#222222',
  },

  labelBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
  },

  labelBadgeText: {
    fontSize: 11,
    fontFamily: 'InterSemiBold',
    color: '#1C9C57',
  },

  addressLine: {
    fontSize: 14,
    fontFamily: 'InterRegular',
    color: '#555555',
    marginTop: 5,
    lineHeight: 20,
  },

  // ===================================================
  // PHONE
  // ===================================================

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  phone: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#333333',
  },

  // ===================================================
  // ACTIONS
  // ===================================================

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 9,
    backgroundColor: '#E3F0FE',
  },

  editButtonText: {
    marginLeft: 5,
    fontSize: 13,
    fontFamily: 'InterSemiBold',
    color: '#1C6FD9',
  },

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 9,
    backgroundColor: '#FDECEC',
    marginLeft: 8,
  },

  deleteButtonText: {
    marginLeft: 5,
    fontSize: 13,
    fontFamily: 'InterSemiBold',
    color: '#E53935',
  },
});