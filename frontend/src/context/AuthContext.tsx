import React, {createContext,ReactNode,useContext,useEffect,useState,} from "react";
import {clearUser,getIsLoggedIn,getUser,saveUser,saveToken,StoredUser,} from "@/utils/storage";
import { API_BASE_URL } from "@/constants/api";

type AuthContextType = {
  isLoggedIn: boolean;
  user: StoredUser | null;
  isLoading: boolean;

  login: (
    user: StoredUser,
    token: string
  ) => Promise<void>;

  register: (
    fullName: string,
    email: string,
    mobile: string,
    password: string,
    address: string
  ) => Promise<void>;

  updateUser: (
    user: StoredUser
  ) => Promise<void>;

  refreshUser: () => Promise<void>;

  logout: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

type Props = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: Props) {
  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [user, setUser] =
    useState<StoredUser | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  // =====================================================
  // LOAD STORED USER
  // =====================================================

  useEffect(() => {
    const loadUser = async () => {
      try {
        const [
          loggedIn,
          storedUser,
        ] = await Promise.all([
          getIsLoggedIn(),
          getUser(),
        ]);

        setIsLoggedIn(loggedIn);
        setUser(storedUser);

      } catch (error) {
        console.error(
          "Load User Error:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // =====================================================
  // LOGIN
  // =====================================================

  const login = async (
    newUser: StoredUser,
    token: string
  ) => {
    console.log(
      "================================"
    );

    console.log("LOGIN USER:", newUser);
    console.log(
      "TOKEN EXISTS:",
      !!token
    );

    if (!token) {
      throw new Error(
        "Login token not received"
      );
    }

    await saveUser(newUser);
    await saveToken(token);

    setUser(newUser);
    setIsLoggedIn(true);

    console.log(
      "USER AND TOKEN SAVED"
    );
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const register = async (
    fullName: string,
    email: string,
    mobile: string,
    password: string,
    address: string
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: fullName,
            email,
            phone: mobile,
            password,
            address: address.trim(),
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Register response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Registration failed"
        );
      }

      // =================================================
      // CHECK TOKEN
      // =================================================

      if (!data.token) {
        throw new Error(
          "Registration token not received"
        );
      }

      // =================================================
      // CREATE USER
      // =================================================
const cleanAddress = String(
  data.data.address || address || ''
)
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)
  .join(', ');

const registeredUser: StoredUser = {
  id: data.data.id,
  fullName: data.data.name,
  email: data.data.email,
  mobile: data.data.phone,
  address: cleanAddress,
  role: data.data.role,
};

      // =================================================
      // SAVE USER + TOKEN
      // =================================================

      await saveUser(
        registeredUser
      );

      await saveToken(
        data.token
      );

      setUser(
        registeredUser
      );

      setIsLoggedIn(true);

      console.log(
        "Registration successful"
      );

      console.log(
        "Registration token saved:",
        !!data.token
      );

    } catch (error) {
      console.error(
        "Registration API error:",
        error
      );

      throw error;
    }
  };

  // =====================================================
  // UPDATE USER
  // =====================================================

  const updateUser = async (
    updatedUser: StoredUser
  ) => {
    try {
      if (!updatedUser.id) {
        throw new Error(
          "User ID not found"
        );
      }

      console.log(
        "Updating user:",
        updatedUser.id
      );

      const response =
        await fetch(
          `${API_BASE_URL}/api/users/${updatedUser.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name:
                updatedUser.fullName,

              email:
                updatedUser.email,

              phone:
                updatedUser.mobile,

              // address:
              //   updatedUser.address ?? "",
address: String(updatedUser.address ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean)
  .join(", "),
              dob:
                updatedUser.dob ?? "",
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "Update Profile Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update profile"
        );
      }

      const updatedUserData: StoredUser = {
        id: data.data.id,
        fullName: data.data.name,
        email: data.data.email,
        mobile: data.data.phone,
        address:
          data.data.address ?? "",
        dob:
          data.data.dob ?? "",
        role: data.data.role,
      };

      await saveUser(
        updatedUserData
      );

      setUser(
        updatedUserData
      );

      console.log(
        "User state updated:",
        updatedUserData
      );

    } catch (error) {
      console.error(
        "Update User Error:",
        error
      );

      throw error;
    }
  };

  // =====================================================
  // REFRESH USER
  // =====================================================

  const refreshUser = async () => {
    try {
      const storedUser =
        await getUser();

      if (storedUser) {
        setUser(storedUser);
      }

    } catch (error) {
      console.error(
        "Refresh User Error:",
        error
      );
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = async () => {
    await clearUser();

    setUser(null);
    setIsLoggedIn(false);

    console.log(
      "User logged out"
    );
  };

  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        isLoading,
        login,
        register,
        updateUser,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// USE AUTH CONTEXT
// =====================================================

export function useAuthContext() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider"
    );
  }

  return context;
}