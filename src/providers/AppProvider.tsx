import React, { ReactNode } from 'react';

import { LoginPopupProvider } from '@/context/LoginPopupContext';

type Props = {
  children: ReactNode;
};

export default function AppProvider({
  children,
}: Props) {
  return (
    <LoginPopupProvider>
      {children}
    </LoginPopupProvider>
  );
}