const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");


// GET CART
router.get(
  "/",
  authMiddleware,
  getCart
);


// ADD TO CART
router.post(
  "/",
  authMiddleware,
  addToCart
);


// UPDATE CART ITEM
router.put(
  "/:productId",
  authMiddleware,
  updateCart
);


// REMOVE CART ITEM
router.delete(
  "/:productId",
  authMiddleware,
  removeFromCart
);


// CLEAR CART
router.delete(
  "/",
  authMiddleware,
  clearCart
);


module.exports = router;