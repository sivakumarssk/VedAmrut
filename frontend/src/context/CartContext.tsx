
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  StoredCartItem,
  getToken,
} from '@/utils/storage';

import { API_BASE_URL } from '@/constants/api';
import { useAuthContext } from '@/context/AuthContext';

// =====================================================
// API PRODUCT
// =====================================================

export type APIProduct = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  image: string | null;
  stock: number;
  category_id: number;
  category_name: string;
};

// =====================================================
// CART LINE
// =====================================================

export type CartLine = StoredCartItem & {
  product: APIProduct;
};

// =====================================================
// CART CONTEXT TYPE
// =====================================================

type CartContextType = {
  items: StoredCartItem[];
  cartLines: CartLine[];

  totalCount: number;
  totalPrice: number;

  isLoading: boolean;

  addToCart: (
    productId: string,
    quantity?: number
  ) => Promise<void>;

  removeFromCart: (
    productId: string
  ) => Promise<void>;

  updateQuantity: (
    productId: string,
    quantity: number
  ) => Promise<void>;

  clearCart: () => Promise<void>;

  loadCart: () => Promise<void>;
};

// =====================================================
// CONTEXT
// =====================================================

const CartContext =
  createContext<CartContextType | undefined>(
    undefined
  );

// =====================================================
// PROPS
// =====================================================

type Props = {
  children: ReactNode;
};

// =====================================================
// PROVIDER
// =====================================================

export function CartProvider({
  children,
}: Props) {
  // ===================================================
  // AUTH
  // ===================================================

  const {
    user,
    isLoggedIn,
    isLoading: authLoading,
  } = useAuthContext();

  // ===================================================
  // STATE
  // ===================================================

  const [items, setItems] =
    useState<StoredCartItem[]>([]);

  const [products, setProducts] =
    useState<APIProduct[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  // ===================================================
  // AUTH HEADERS
  // ===================================================

  const getAuthHeaders = async () => {
    const token = await getToken();

    console.log(
      'CART TOKEN EXISTS:',
      !!token
    );

    if (!token) {
      throw new Error(
        'Authentication token not found'
      );
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  // ===================================================
  // LOAD CART WHEN USER CHANGES
  // ===================================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isLoggedIn || !user?.id) {
      setItems([]);
      setProducts([]);
      setIsLoading(false);
      return;
    }

    loadCart();
  }, [
    user?.id,
    isLoggedIn,
    authLoading,
  ]);

  // ===================================================
  // LOAD CART FROM BACKEND
  // ===================================================

  const loadCart = async () => {
    try {
      setIsLoading(true);

      if (!isLoggedIn || !user?.id) {
        console.log(
          'CART: User not logged in'
        );

        setItems([]);
        return;
      }

      console.log(
        '================================'
      );

      console.log(
        'LOADING USER CART FROM BACKEND'
      );

      console.log(
        'USER ID:',
        user.id
      );

      // -----------------------------------------------
      // AUTH
      // -----------------------------------------------

      const headers =
        await getAuthHeaders();

      // -----------------------------------------------
      // GET BACKEND CART
      // -----------------------------------------------

      const cartResponse =
        await fetch(
          `${API_BASE_URL}/api/cart`,
          {
            method: 'GET',
            headers,
          }
        );

      const cartResult =
        await cartResponse.json();

      console.log(
        'CART API STATUS:',
        cartResponse.status
      );

      console.log(
        'CART API RESPONSE:',
        cartResult
      );

      if (
        !cartResponse.ok ||
        !cartResult.success
      ) {
        throw new Error(
          cartResult.message ||
            'Failed to fetch cart'
        );
      }

      // -----------------------------------------------
      // CONVERT BACKEND CART
      // -----------------------------------------------

      const backendCart =
        Array.isArray(cartResult.data)
          ? cartResult.data
          : [];

      const formattedItems: StoredCartItem[] =
        backendCart
          .filter(
            (item: any) =>
              item.product_id != null
          )
          .map((item: any) => ({
            productId: String(
              item.product_id
            ),
            quantity: Number(
              item.quantity
            ),
          }));

      console.log(
        'BACKEND CART ITEMS:',
        formattedItems
      );

      setItems(formattedItems);

      // -----------------------------------------------
      // LOAD PRODUCTS
      // -----------------------------------------------

      const productResponse =
        await fetch(
          `${API_BASE_URL}/api/products`
        );

      const productResult =
        await productResponse.json();

      console.log(
        'PRODUCT API STATUS:',
        productResponse.status
      );

      if (
        productResponse.ok &&
        productResult.success &&
        Array.isArray(
          productResult.data
        )
      ) {
        setProducts(
          productResult.data
        );
      } else {
        setProducts([]);
      }

      console.log(
        '================================'
      );

    } catch (error) {
      console.error(
        'LOAD CART ERROR:',
        error
      );

      setItems([]);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ===================================================
  // ADD TO CART
  // ===================================================

  const addToCart = async (
    productId: string,
    quantity: number = 1
  ) => {
    if (
      !isLoggedIn ||
      !user?.id
    ) {
      console.log(
        'ADD TO CART BLOCKED: User not logged in'
      );
      return;
    }

    if (quantity <= 0) {
      return;
    }

    try {
      console.log(
        '================================'
      );

      console.log(
        'ADDING PRODUCT TO BACKEND CART'
      );

      console.log(
        'USER ID:',
        user.id
      );

      console.log(
        'PRODUCT ID:',
        productId
      );

      console.log(
        'QUANTITY:',
        quantity
      );

      const headers =
        await getAuthHeaders();

      const response =
        await fetch(
          `${API_BASE_URL}/api/cart`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              productId: Number(
                productId
              ),
              quantity,
            }),
          }
        );

      const result =
        await response.json();

      console.log(
        'ADD CART STATUS:',
        response.status
      );

      console.log(
        'ADD CART RESPONSE:',
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            'Failed to add product to cart'
        );
      }

      console.log(
        'PRODUCT ADDED TO BACKEND CART'
      );

      // Refresh cart from backend
      await loadCart();

    } catch (error) {
      console.error(
        'ADD TO CART ERROR:',
        error
      );

      throw error;
    }
  };

  // ===================================================
  // REMOVE FROM CART
  // ===================================================
 const removeFromCart = async (
  productId: string
) => {
  if (!isLoggedIn || !user?.id) {
    return;
  }

  const normalizedProductId = String(productId);

  try {
    console.log('================================');
    console.log('REMOVING PRODUCT FROM BACKEND CART');
    console.log('USER ID:', user.id);
    console.log(
      'PRODUCT ID:',
      normalizedProductId
    );

    const headers = await getAuthHeaders();

    const response = await fetch(
      `${API_BASE_URL}/api/cart/${encodeURIComponent(
        normalizedProductId
      )}`,
      {
        method: 'DELETE',
        headers,
      }
    );

    const result = await response.json();

    console.log(
      'REMOVE CART STATUS:',
      response.status
    );

    console.log(
      'REMOVE CART RESPONSE:',
      result
    );

    // -----------------------------------------------
    // SUCCESS
    // -----------------------------------------------

    if (response.ok && result.success) {
      console.log(
        'PRODUCT REMOVED SUCCESSFULLY'
      );

      setItems((currentItems) =>
        currentItems.filter(
          (item) =>
            String(item.productId) !==
            normalizedProductId
        )
      );

      return;
    }

    // -----------------------------------------------
    // ALREADY REMOVED
    // -----------------------------------------------

    if (
      response.status === 404 &&
      result.message === 'Cart item not found'
    ) {
      console.log(
        'ITEM NOT FOUND IN BACKEND - REMOVING FROM LOCAL CART'
      );

      setItems((currentItems) =>
        currentItems.filter(
          (item) =>
            String(item.productId) !==
            normalizedProductId
        )
      );

      return;
    }

    // -----------------------------------------------
    // OTHER ERROR
    // -----------------------------------------------

    throw new Error(
      result.message ||
        'Failed to remove product'
    );

  } catch (error) {
    console.error(
      'REMOVE FROM CART ERROR:',
      error
    );

    throw error;
  }
};

  // ===================================================
  // UPDATE QUANTITY
  // ===================================================

  // const updateQuantity = async (
  //   productId: string,
  //   quantity: number
  // ) => {
  //   if (
  //     !isLoggedIn ||
  //     !user?.id
  //   ) {
  //     return;
  //   }

  //   // -----------------------------------------------
  //   // REMOVE IF ZERO
  //   // -----------------------------------------------

  //   if (quantity <= 0) {
  //     await removeFromCart(
  //       productId
  //     );

  //     return;
  //   }

  //   try {
  //     console.log(
  //       '================================'
  //     );

  //     console.log(
  //       'UPDATING CART QUANTITY'
  //     );

  //     console.log(
  //       'USER ID:',
  //       user.id
  //     );

  //     console.log(
  //       'PRODUCT ID:',
  //       productId
  //     );

  //     console.log(
  //       'NEW QUANTITY:',
  //       quantity
  //     );

  //     const headers =
  //       await getAuthHeaders();

  //     const response =
  //       await fetch(
  //         `${API_BASE_URL}/api/cart/${productId}`,
  //         {
  //           method: 'PUT',
  //           headers,
  //           body: JSON.stringify({
  //             quantity,
  //           }),
  //         }
  //       );

  //     const result =
  //       await response.json();

  //     console.log(
  //       'UPDATE CART STATUS:',
  //       response.status
  //     );

  //     console.log(
  //       'UPDATE CART RESPONSE:',
  //       result
  //     );

  //     if (
  //       !response.ok ||
  //       !result.success
  //     ) {
  //       throw new Error(
  //         result.message ||
  //           'Failed to update cart'
  //       );
  //     }

  //     console.log(
  //       'CART QUANTITY UPDATED'
  //     );

  //     // Refresh from backend
  //     await loadCart();

  //   } catch (error) {
  //     console.error(
  //       'UPDATE QUANTITY ERROR:',
  //       error
  //     );

  //     throw error;
  //   }
  // };
// ===================================================
// UPDATE QUANTITY
// ===================================================

const updateQuantity = async (
  productId: string,
  quantity: number
) => {
  if (!isLoggedIn || !user?.id) {
    return;
  }

  const normalizedProductId = String(productId);

  // -----------------------------------------------
  // REMOVE IF ZERO
  // -----------------------------------------------

  if (quantity <= 0) {
    await removeFromCart(normalizedProductId);
    return;
  }

  try {
    console.log('================================');
    console.log('UPDATING CART QUANTITY');
    console.log('USER ID:', user.id);
    console.log('PRODUCT ID:', normalizedProductId);
    console.log('NEW QUANTITY:', quantity);

    const headers = await getAuthHeaders();

    const response = await fetch(
      `${API_BASE_URL}/api/cart/${encodeURIComponent(
        normalizedProductId
      )}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          quantity,
        }),
      }
    );

    const result = await response.json();

    console.log(
      'UPDATE CART STATUS:',
      response.status
    );

    console.log(
      'UPDATE CART RESPONSE:',
      result
    );

    if (!response.ok || !result.success) {
      throw new Error(
        result.message ||
          'Failed to update cart'
      );
    }

    console.log(
      'CART QUANTITY UPDATED'
    );

    // -----------------------------------------------
    // UPDATE LOCAL STATE
    // -----------------------------------------------

    setItems((currentItems) =>
      currentItems.map((item) =>
        String(item.productId) ===
        normalizedProductId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );

  } catch (error) {
    console.error(
      'UPDATE QUANTITY ERROR:',
      error
    );

    throw error;
  }
};
  // ===================================================
  // CLEAR CART
  // ===================================================

  const clearCart = async () => {
    if (
      !isLoggedIn ||
      !user?.id
    ) {
      return;
    }

    try {
      console.log(
        '================================'
      );

      console.log(
        'CLEARING BACKEND CART'
      );

      const headers =
        await getAuthHeaders();

      const response =
        await fetch(
          `${API_BASE_URL}/api/cart`,
          {
            method: 'DELETE',
            headers,
          }
        );

      const result =
        await response.json();

      console.log(
        'CLEAR CART STATUS:',
        response.status
      );

      console.log(
        'CLEAR CART RESPONSE:',
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            'Failed to clear cart'
        );
      }

      setItems([]);

      console.log(
        'BACKEND CART CLEARED'
      );

    } catch (error) {
      console.error(
        'CLEAR CART ERROR:',
        error
      );

      throw error;
    }
  };

  // ===================================================
  // CREATE CART LINES
  // ===================================================

  const cartLines: CartLine[] =
    items
      .map((item) => {
        const product =
          products.find(
            (p) =>
              String(p.id) ===
              String(
                item.productId
              )
          );

        if (!product) {
          return null;
        }

        return {
          ...item,
          product,
        };
      })
      .filter(
        (
          line
        ): line is CartLine =>
          line !== null
      );

  // ===================================================
  // TOTAL COUNT
  // ===================================================

  const totalCount =
    cartLines.reduce(
      (sum, line) =>
        sum + line.quantity,
      0
    );

  // ===================================================
  // TOTAL PRICE
  // ===================================================

  const totalPrice =
    cartLines.reduce(
      (sum, line) =>
        sum +
        line.quantity *
          Number(
            line.product.price
          ),
      0
    );

  // ===================================================
  // PROVIDER
  // ===================================================

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
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// =====================================================
// HOOK
// =====================================================

export function useCartContext() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCartContext must be used inside CartProvider'
    );
  }

  return context;
}