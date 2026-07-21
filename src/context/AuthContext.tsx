import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  clearUser,
  getIsLoggedIn,
  getUser,
  saveUser,
  StoredUser,
} from '@/utils/storage';

type AuthContextType = {
  isLoggedIn: boolean;
  user: StoredUser | null;
  isLoading: boolean;
  login: (user: StoredUser) => Promise<void>;
  updateUser: (user: StoredUser) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [loggedIn, storedUser] = await Promise.all([
        getIsLoggedIn(),
        getUser(),
      ]);
      setIsLoggedIn(loggedIn);
      setUser(storedUser);
      setIsLoading(false);
    })();
  }, []);

  const login = async (newUser: StoredUser) => {
    await saveUser(newUser);
    setUser(newUser);
    setIsLoggedIn(true);
  };

  const updateUser = async (updatedUser: StoredUser) => {
    await saveUser(updatedUser);
    setUser(updatedUser);
  };

  const logout = async () => {
    await clearUser();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, isLoading, login, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }

  return context;
}
