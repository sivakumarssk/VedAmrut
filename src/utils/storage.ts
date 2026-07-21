import AsyncStorage from '@react-native-async-storage/async-storage';

export type StoredUser = {
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  dob?: string;
};

const AUTH_USER_KEY = '@auth_user';
const AUTH_LOGGED_IN_KEY = '@auth_is_logged_in';
const CART_ITEMS_KEY = '@cart_items';

export async function saveUser(user: StoredUser): Promise<void> {
  await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  await AsyncStorage.setItem(AUTH_LOGGED_IN_KEY, 'true');
}

export async function getUser(): Promise<StoredUser | null> {
  const raw = await AsyncStorage.getItem(AUTH_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function getIsLoggedIn(): Promise<boolean> {
  const value = await AsyncStorage.getItem(AUTH_LOGGED_IN_KEY);
  return value === 'true';
}

export async function clearUser(): Promise<void> {
  await AsyncStorage.multiRemove([AUTH_USER_KEY, AUTH_LOGGED_IN_KEY]);
}

export type StoredCartItem = {
  productId: string;
  quantity: number;
};

export async function saveCartItems(items: StoredCartItem[]): Promise<void> {
  await AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
}

export async function getCartItems(): Promise<StoredCartItem[]> {
  const raw = await AsyncStorage.getItem(CART_ITEMS_KEY);
  return raw ? JSON.parse(raw) : [];
}

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

const ADDRESSES_KEY = '@saved_addresses';
const SELECTED_ADDRESS_ID_KEY = '@selected_address_id';

export async function saveAddresses(addresses: SavedAddress[]): Promise<void> {
  await AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
}

export async function getAddresses(): Promise<SavedAddress[]> {
  const raw = await AsyncStorage.getItem(ADDRESSES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveSelectedAddressId(id: string | null): Promise<void> {
  if (id) {
    await AsyncStorage.setItem(SELECTED_ADDRESS_ID_KEY, id);
  } else {
    await AsyncStorage.removeItem(SELECTED_ADDRESS_ID_KEY);
  }
}

export async function getSelectedAddressId(): Promise<string | null> {
  return AsyncStorage.getItem(SELECTED_ADDRESS_ID_KEY);
}

export type UserReview = {
  id: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  author: string;
  daysAgo: number;
};

const USER_REVIEWS_KEY = '@user_reviews';

export async function saveUserReviews(reviews: UserReview[]): Promise<void> {
  await AsyncStorage.setItem(USER_REVIEWS_KEY, JSON.stringify(reviews));
}

export async function getUserReviews(): Promise<UserReview[]> {
  const raw = await AsyncStorage.getItem(USER_REVIEWS_KEY);
  return raw ? JSON.parse(raw) : [];
}

const SEARCH_HISTORY_KEY = '@search_history';

export async function saveSearchHistory(terms: string[]): Promise<void> {
  await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(terms));
}

export async function getSearchHistory(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}
