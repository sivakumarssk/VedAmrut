const {
  getCartByUserId,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearUserCart,
} = require("../models/cartModel");


// ==========================================
// GET CART
// ==========================================

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await getCartByUserId(userId);

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });

  } catch (error) {
    console.error("GET CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};


// ==========================================
// ADD TO CART
// ==========================================

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      productId,
      quantity = 1,
    } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const item = await addItemToCart(
      userId,
      productId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: item,
    });

  } catch (error) {
    console.error("ADD TO CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};


// ==========================================
// UPDATE QUANTITY
// ==========================================

const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const item = await updateCartItem(
      userId,
      productId,
      quantity
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: item,
    });

  } catch (error) {
    console.error("UPDATE CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};


// ==========================================
// REMOVE FROM CART
// ==========================================

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId } = req.params;

    const item = await removeCartItem(
      userId,
      productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });

  } catch (error) {
    console.error(
      "REMOVE CART ITEM ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to remove product",
    });
  }
};


// ==========================================
// CLEAR CART
// ==========================================

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await clearUserCart(userId);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });

  } catch (error) {
    console.error("CLEAR CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};


module.exports = {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
};