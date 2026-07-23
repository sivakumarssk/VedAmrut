import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

import {
    getAddresses,
    getSelectedAddressId,
    saveAddresses,
    SavedAddress,
    saveSelectedAddressId,
} from '../../src/utils/storage';

type AddressContextType = {
  addresses: SavedAddress[];
  selectedAddressId: string | null;
  selectedAddress: SavedAddress | null;
  isLoading: boolean;
  addAddress: (address: Omit<SavedAddress, 'id'>) => Promise<void>;
  updateAddress: (address: SavedAddress) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  selectAddress: (id: string) => Promise<void>;
};

const AddressContext = createContext<AddressContextType | undefined>(
  undefined
);

type Props = {
  children: ReactNode;
};

export function AddressProvider({ children }: Props) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [storedAddresses, storedSelectedId] = await Promise.all([
        getAddresses(),
        getSelectedAddressId(),
      ]);
      setAddresses(storedAddresses);
      setSelectedAddressId(storedSelectedId);
      setIsLoading(false);
    })();
  }, []);

  const addAddress = async (address: Omit<SavedAddress, 'id'>) => {
    const newAddress: SavedAddress = {
      ...address,
      id: Date.now().toString(),
    };
    const next = [...addresses, newAddress];
    setAddresses(next);
    await saveAddresses(next);

    if (!selectedAddressId) {
      setSelectedAddressId(newAddress.id);
      await saveSelectedAddressId(newAddress.id);
    }
  };

  const updateAddress = async (address: SavedAddress) => {
    const next = addresses.map((item) =>
      item.id === address.id ? address : item
    );
    setAddresses(next);
    await saveAddresses(next);
  };

  const deleteAddress = async (id: string) => {
    const next = addresses.filter((item) => item.id !== id);
    setAddresses(next);
    await saveAddresses(next);

    if (selectedAddressId === id) {
      const fallbackId = next[0]?.id ?? null;
      setSelectedAddressId(fallbackId);
      await saveSelectedAddressId(fallbackId);
    }
  };

  const selectAddress = async (id: string) => {
    setSelectedAddressId(id);
    await saveSelectedAddressId(id);
  };

  const selectedAddress =
    addresses.find((item) => item.id === selectedAddressId) ?? null;

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

export function useAddressContext() {
  const context = useContext(AddressContext);

  if (!context) {
    throw new Error('useAddressContext must be used inside AddressProvider');
  }

  return context;
}
