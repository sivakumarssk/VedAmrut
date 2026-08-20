import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { products } from '@/constants/DummyData2';
import {
  getCartItems,
  saveCartItems,
  StoredCartItem,
} from '@/utils/storage';

export type CartLine = StoredCartItem & {
  product: (typeof products)[number];
};

type CartContextType = {
  items: StoredCartItem[];
  cartLines: CartLine[];
  totalCount: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export function CartProvider({ children }: Props) {
  const [items, setItems] = useState<StoredCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await getCartItems();
      setItems(stored);
      setIsLoading(false);
    })();
  }, []);

  const persist = async (next: StoredCartItem[]) => {
    setItems(next);
    await saveCartItems(next);
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    const existing = items.find((item) => item.productId === productId);

    if (existing) {
      await persist(
        items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      await persist([...items, { productId, quantity }]);
    }
  };

  const removeFromCart = async (productId: string) => {
    await persist(items.filter((item) => item.productId !== productId));
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    await persist(
      items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    await persist([]);
  };

  const cartLines: CartLine[] = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((line): line is CartLine => line !== null);

  const totalCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const totalPrice = cartLines.reduce(
    (sum, line) => sum + line.quantity * line.product.price,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        cartLines,
        totalCount,
        totalPrice,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCartContext must be used inside CartProvider');
  }

  return context;
}
