import AsyncStorage from '@react-native-async-storage/async-storage';

// =====================================================
// USER
// =====================================================

export type StoredUser = {
  id?: number;
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  role?: string;
  dob?: string;
};

const AUTH_USER_KEY = '@auth_user';
const AUTH_LOGGED_IN_KEY = '@auth_is_logged_in';
const AUTH_TOKEN_KEY = '@auth_token';

// =====================================================
// SAVE USER
// =====================================================

export async function saveUser(
  user: StoredUser
): Promise<void> {
  await AsyncStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify(user)
  );

  await AsyncStorage.setItem(
    AUTH_LOGGED_IN_KEY,
    'true'
  );
}

// =====================================================
// GET USER
// =====================================================

export async function getUser(): Promise<StoredUser | null> {
  const raw = await AsyncStorage.getItem(
    AUTH_USER_KEY
  );

  return raw ? JSON.parse(raw) : null;
}

// =====================================================
// GET LOGIN STATUS
// =====================================================

export async function getIsLoggedIn(): Promise<boolean> {
  const value = await AsyncStorage.getItem(
    AUTH_LOGGED_IN_KEY
  );

  return value === 'true';
}

// =====================================================
// CLEAR USER
// =====================================================

export async function clearUser(): Promise<void> {
  await AsyncStorage.multiRemove([
    AUTH_USER_KEY,
    AUTH_LOGGED_IN_KEY,
    AUTH_TOKEN_KEY,
  ]);
}

// =====================================================
// TOKEN
// =====================================================

export async function saveToken(
  token: string
): Promise<void> {
  await AsyncStorage.setItem(
    AUTH_TOKEN_KEY,
    token
  );
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(
    AUTH_TOKEN_KEY
  );
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(
    AUTH_TOKEN_KEY
  );
}

// =====================================================
// CART
// =====================================================

export type StoredCartItem = {
  productId: string;
  quantity: number;
};

// =====================================================
// USER-SPECIFIC CART KEY
// =====================================================

const getCartKey = (
  userId: number | string
): string => {
  return `@cart_items_user_${userId}`;
};

// =====================================================
// SAVE CART
// =====================================================

export async function saveCartItems(
  userId: number | string,
  items: StoredCartItem[]
): Promise<void> {
  const key = getCartKey(userId);

  await AsyncStorage.setItem(
    key,
    JSON.stringify(items)
  );
}

// =====================================================
// GET CART
// =====================================================

export async function getCartItems(
  userId: number | string
): Promise<StoredCartItem[]> {
  const key = getCartKey(userId);

  const raw = await AsyncStorage.getItem(
    key
  );

  return raw ? JSON.parse(raw) : [];
}

// =====================================================
// CLEAR USER CART
// =====================================================

export async function clearUserCart(
  userId: number | string
): Promise<void> {
  const key = getCartKey(userId);

  await AsyncStorage.removeItem(key);
}

// =====================================================
// ADDRESSES
// =====================================================

export type SavedAddress = {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  fullName: string;
  addressLine: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
};

// =====================================================
// USER-SPECIFIC ADDRESS KEYS
// =====================================================

const getAddressesKey = (
  userId: number | string
): string => {
  return `@saved_addresses_user_${userId}`;
};

const getSelectedAddressIdKey = (
  userId: number | string
): string => {
  return `@selected_address_id_user_${userId}`;
};

// =====================================================
// SAVE ADDRESSES FOR USER
// =====================================================

export async function saveAddresses(
  userId: number | string,
  addresses: SavedAddress[]
): Promise<void> {
  const key = getAddressesKey(userId);

  await AsyncStorage.setItem(
    key,
    JSON.stringify(addresses)
  );
}

// =====================================================
// GET ADDRESSES FOR USER
// =====================================================

export async function getAddresses(
  userId: number | string
): Promise<SavedAddress[]> {
  const key = getAddressesKey(userId);

  const raw = await AsyncStorage.getItem(
    key
  );

  return raw ? JSON.parse(raw) : [];
}

// =====================================================
// SAVE SELECTED ADDRESS ID FOR USER
// =====================================================

export async function saveSelectedAddressId(
  userId: number | string,
  id: string | null
): Promise<void> {
  const key =
    getSelectedAddressIdKey(userId);

  if (id) {
    await AsyncStorage.setItem(
      key,
      id
    );
  } else {
    await AsyncStorage.removeItem(
      key
    );
  }
}

// =====================================================
// GET SELECTED ADDRESS ID FOR USER
// =====================================================

export async function getSelectedAddressId(
  userId: number | string
): Promise<string | null> {
  const key =
    getSelectedAddressIdKey(userId);

  return AsyncStorage.getItem(key);
}

// =====================================================
// CLEAR USER ADDRESSES
// =====================================================

export async function clearUserAddresses(
  userId: number | string
): Promise<void> {
  const addressesKey =
    getAddressesKey(userId);

  const selectedKey =
    getSelectedAddressIdKey(userId);

  await AsyncStorage.multiRemove([
    addressesKey,
    selectedKey,
  ]);
}

// =====================================================
// USER REVIEWS
// =====================================================

export type UserReview = {
  id: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  author: string;
  daysAgo: number;
};

const USER_REVIEWS_KEY =
  '@user_reviews';

// =====================================================
// SAVE USER REVIEWS
// =====================================================

export async function saveUserReviews(
  reviews: UserReview[]
): Promise<void> {
  await AsyncStorage.setItem(
    USER_REVIEWS_KEY,
    JSON.stringify(reviews)
  );
}

// =====================================================
// GET USER REVIEWS
// =====================================================

export async function getUserReviews(): Promise<UserReview[]> {
  const raw =
    await AsyncStorage.getItem(
      USER_REVIEWS_KEY
    );

  return raw ? JSON.parse(raw) : [];
}

// =====================================================
// SEARCH HISTORY
// =====================================================

const SEARCH_HISTORY_KEY =
  '@search_history';

// =====================================================
// SAVE SEARCH HISTORY
// =====================================================

export async function saveSearchHistory(
  terms: string[]
): Promise<void> {
  await AsyncStorage.setItem(
    SEARCH_HISTORY_KEY,
    JSON.stringify(terms)
  );
}

// =====================================================
// GET SEARCH HISTORY
// =====================================================

export async function getSearchHistory(): Promise<string[]> {
  const raw =
    await AsyncStorage.getItem(
      SEARCH_HISTORY_KEY
    );

  return raw ? JSON.parse(raw) : [];
}