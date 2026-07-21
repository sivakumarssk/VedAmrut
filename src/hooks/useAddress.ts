import { useAddressContext } from '@/context/AddressContext';

export const useAddress = () => {
  return useAddressContext();
};
