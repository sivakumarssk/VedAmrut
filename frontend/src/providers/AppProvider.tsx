import React, { ReactNode } from 'react';

import { AddressProvider } from '@/context/AddressContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { LoginPopupProvider } from '@/context/LoginPopupContext';
import { ReviewsProvider } from '@/context/ReviewsContext';

type Props = {
  children: ReactNode;
};

export default function AppProvider({
  children,
}: Props) {
  return (
    <AuthProvider>
      <CartProvider>
        <AddressProvider>
          <ReviewsProvider>
            <LoginPopupProvider>
              {children}
            </LoginPopupProvider>
          </ReviewsProvider>
        </AddressProvider>
      </CartProvider>
    </AuthProvider>
  );
}