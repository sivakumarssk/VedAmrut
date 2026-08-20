import { useCartContext } from '../../src/context/CartContext';

export const useCart = () => {
  return useCartContext();
};
