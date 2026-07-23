import { useAddressContext } from '../../src/context/AddressContext';

export const useAddress = () => {
  return useAddressContext();
};
