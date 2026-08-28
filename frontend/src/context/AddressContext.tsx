
import React, {createContext,ReactNode,useContext,useEffect, useState,} from 'react';
import {SavedAddress, getToken,} from '@/utils/storage';
import { useAuthContext } from '@/context/AuthContext';
import { API_BASE_URL } from '@/constants/api';



type AddressContextType = {
  addresses: SavedAddress[];
  selectedAddressId: string | null;
  selectedAddress: SavedAddress | null;
  isLoading: boolean;

  addAddress: (
    address: Omit<SavedAddress, 'id'>
  ) => Promise<void>;

  updateAddress: (
    address: SavedAddress
  ) => Promise<void>;

  deleteAddress: (
    id: string
  ) => Promise<void>;

  selectAddress: (
    id: string
  ) => Promise<void>;
};

const AddressContext =
  createContext<AddressContextType | undefined>(
    undefined
  );

type Props = {
  children: ReactNode;
};

export function AddressProvider({
  children,
}: Props) {
  const [addresses, setAddresses] =
    useState<SavedAddress[]>([]);

  const [selectedAddressId, setSelectedAddressId] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const { user } = useAuthContext();

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getAuthHeaders = async () => {
    const token = await getToken();

    console.log(
      'ADDRESS TOKEN EXISTS:',
      !!token
    );

    if (!token) {
      throw new Error(
        'Authentication token not found'
      );
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  // =====================================================
  // MAP BACKEND ADDRESS → FRONTEND ADDRESS
  // =====================================================

  const mapBackendAddress = (
    item: any
  ): SavedAddress => {
    return {
      id: String(item.id),

      label:
        item.label ??
        (item.is_default
          ? 'Home'
          : 'Other'),

      fullName:
        item.full_name ?? '',

      addressLine:
        item.address_line1 ?? '',

      area:
        item.address_line2 ?? '',

      city:
        item.city ?? '',

      state:
        item.state ?? '',

      pincode:
        String(item.pincode ?? ''),

      phone:
        item.phone ?? '',
    };
  };

  // =====================================================
  // LOAD ADDRESSES FROM BACKEND
  // =====================================================

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setIsLoading(true);

        if (!user?.id) {
          console.log(
            'NO USER → CLEARING ADDRESSES'
          );

          setAddresses([]);
          setSelectedAddressId(null);

          return;
        }

        console.log(
          '================================'
        );

        console.log(
          'LOADING ADDRESSES FOR USER:',
          user.id
        );

        const headers =
          await getAuthHeaders();

        const response = await fetch(
          `${API_BASE_URL}/api/addresses`,
          {
            method: 'GET',
            headers,
          }
        );

        const data = await response.json();

        console.log(
          'GET ADDRESSES RESPONSE:',
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Failed to fetch addresses'
          );
        }

        const backendAddresses =
          data.data ?? [];

        const mappedAddresses =
          backendAddresses.map(
            mapBackendAddress
          );

        setAddresses(
          mappedAddresses
        );

        // Find backend default address
        const defaultAddress =
          backendAddresses.find(
            (item: any) =>
              item.is_default === true
          );

        if (defaultAddress) {
          setSelectedAddressId(
            String(defaultAddress.id)
          );
        } else if (
          mappedAddresses.length > 0
        ) {
          setSelectedAddressId(
            mappedAddresses[0].id
          );
        } else {
          setSelectedAddressId(null);
        }

        console.log(
          'FRONTEND ADDRESSES:',
          mappedAddresses
        );

        console.log(
          '================================'
        );
      } catch (error) {
        console.error(
          'LOAD ADDRESSES ERROR:',
          error
        );

        setAddresses([]);
        setSelectedAddressId(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadAddresses();
  }, [user?.id]);

  // =====================================================
  // ADD ADDRESS
  // =====================================================

  const addAddress = async (
    address: Omit<SavedAddress, 'id'>
  ) => {
    try {
      if (!user?.id) {
        throw new Error(
          'User not logged in'
        );
      }

      const headers =
        await getAuthHeaders();

      const isFirstAddress =
        addresses.length === 0;

      const response = await fetch(
        `${API_BASE_URL}/api/addresses`,
        {
          method: 'POST',
          headers,

          body: JSON.stringify({
            fullName:
              address.fullName,

            phone:
              address.phone,

            addressLine1:
              address.addressLine,

            addressLine2:
              address.area,

            city:
              address.city,

            state:
              address.state,

            pincode:
              address.pincode,

            landmark:
              null,

            isDefault:
              isFirstAddress,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        'ADD ADDRESS RESPONSE:',
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to add address'
        );
      }

      const newAddress =
        mapBackendAddress(data.data);

      const next = [
        ...addresses,
        newAddress,
      ];

      setAddresses(next);

      // Backend automatically makes first
      // address/default address selected
      if (
        isFirstAddress ||
        data.data?.is_default
      ) {
        setSelectedAddressId(
          newAddress.id
        );
      }

      console.log(
        'ADDRESS ADDED SUCCESSFULLY:',
        newAddress
      );
    } catch (error) {
      console.error(
        'ADD ADDRESS ERROR:',
        error
      );

      throw error;
    }
  };

  // =====================================================
  // UPDATE ADDRESS
  // =====================================================

  const updateAddress = async (
    address: SavedAddress
  ) => {
    try {
      if (!user?.id) {
        throw new Error(
          'User not logged in'
        );
      }

      const headers =
        await getAuthHeaders();

      const response = await fetch(
        `${API_BASE_URL}/api/addresses/${address.id}`,
        {
          method: 'PUT',
          headers,

          body: JSON.stringify({
            fullName:
              address.fullName,

            phone:
              address.phone,

            addressLine1:
              address.addressLine,

            addressLine2:
              address.area,

            city:
              address.city,

            state:
              address.state,

            pincode:
              address.pincode,

            landmark:
              null,

            isDefault:
              address.id ===
              selectedAddressId,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        'UPDATE ADDRESS RESPONSE:',
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to update address'
        );
      }

      const updatedAddress =
        mapBackendAddress(data.data);

      const next =
        addresses.map((item) =>
          item.id === address.id
            ? updatedAddress
            : item
        );

      setAddresses(next);

      console.log(
        'ADDRESS UPDATED:',
        updatedAddress
      );
    } catch (error) {
      console.error(
        'UPDATE ADDRESS ERROR:',
        error
      );

      throw error;
    }
  };

  // =====================================================
  // DELETE ADDRESS
  // =====================================================

  const deleteAddress = async (
    id: string
  ) => {
    try {
      if (!user?.id) {
        throw new Error(
          'User not logged in'
        );
      }

      const headers =
        await getAuthHeaders();

      const response = await fetch(
        `${API_BASE_URL}/api/addresses/${id}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      const data =
        await response.json();

      console.log(
        'DELETE ADDRESS RESPONSE:',
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to delete address'
        );
      }

      const next =
        addresses.filter(
          (item) =>
            item.id !== id
        );

      setAddresses(next);

      if (
        selectedAddressId === id
      ) {
        const fallback =
          next[0] ?? null;

        setSelectedAddressId(
          fallback?.id ?? null
        );

        // Make fallback address default
        if (fallback) {
          const fallbackHeaders =
            await getAuthHeaders();

          await fetch(
            `${API_BASE_URL}/api/addresses/${fallback.id}/default`,
            {
              method: 'PUT',
              headers: fallbackHeaders,
            }
          );
        }
      }

      console.log(
        'ADDRESS DELETED:',
        id
      );
    } catch (error) {
      console.error(
        'DELETE ADDRESS ERROR:',
        error
      );

      throw error;
    }
  };

  // =====================================================
  // SELECT ADDRESS / SET DEFAULT
  // =====================================================

  const selectAddress = async (
    id: string
  ) => {
    try {
      if (!user?.id) {
        throw new Error(
          'User not logged in'
        );
      }

      const selected =
        addresses.find(
          (item) =>
            item.id === id
        );

      if (!selected) {
        throw new Error(
          'Address not found'
        );
      }

      const headers =
        await getAuthHeaders();

      const response = await fetch(
        `${API_BASE_URL}/api/addresses/${id}/default`,
        {
          method: 'PUT',
          headers,
        }
      );

      const data =
        await response.json();

      console.log(
        'SET DEFAULT RESPONSE:',
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to select address'
        );
      }

      setSelectedAddressId(id);

      // Update local list so selected
      // address remains first/default
      setAddresses((current) =>
        current.map((item) => ({
          ...item,
          // frontend doesn't need to store
          // is_default, selection is by ID
        }))
      );

      console.log(
        'ADDRESS SELECTED:',
        selected
      );
    } catch (error) {
      console.error(
        'SELECT ADDRESS ERROR:',
        error
      );

      throw error;
    }
  };

  // =====================================================
  // SELECTED ADDRESS
  // =====================================================

  const selectedAddress =
    addresses.find(
      (item) =>
        item.id ===
        selectedAddressId
    ) ?? null;

  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddressId,
        selectedAddress,
        isLoading,

        addAddress,
        updateAddress,
        deleteAddress,
        selectAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

// =====================================================
// HOOK
// =====================================================

export function useAddressContext() {
  const context =
    useContext(AddressContext);

  if (!context) {
    throw new Error(
      'useAddressContext must be used inside AddressProvider'
    );
  }

  return context;
}