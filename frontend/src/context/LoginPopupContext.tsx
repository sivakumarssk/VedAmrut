import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';

import LoginPopup from '@/components/common/LoginPopup';

type LoginPopupContextType = {
  showLoginPopup: () => void;
  hideLoginPopup: () => void;
};

const LoginPopupContext = createContext<LoginPopupContextType | undefined>(
  undefined
);

type Props = {
  children: ReactNode;
};

export function LoginPopupProvider({ children }: Props) {
  const [visible, setVisible] = useState(false);

  const showLoginPopup = () => {
    setVisible(true);
  };

  const hideLoginPopup = () => {
    setVisible(false);
  };

  return (
    <LoginPopupContext.Provider
      value={{
        showLoginPopup,
        hideLoginPopup,
      }}
    >
      {children}

      <LoginPopup
        visible={visible}
        onClose={hideLoginPopup}
        onConfirm={() => {
          hideLoginPopup();
        }}
      />
    </LoginPopupContext.Provider>
  );
}

export function useLoginPopupContext() {
  const context = useContext(LoginPopupContext);

  if (!context) {
    throw new Error(
      'useLoginPopupContext must be used inside LoginPopupProvider'
    );
  }

  return context;
}