import React, { ReactNode } from 'react';

import { AddressProvider } from '../../src/context/AddressContext';
import { AuthProvider } from '../../src/context/AuthContext';
import { CartProvider } from '../../src/context/CartContext';
import { LoginPopupProvider } from '../../src/context/LoginPopupContext';
import { ReviewsProvider } from '../../src/context/ReviewsContext';

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