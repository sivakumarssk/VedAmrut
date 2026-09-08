
const express = require("express");

const router = express.Router();

const {
  getMyWallet,
  addMoney,
  getMyTransactions,
  payWithWallet,
  payForQRProductController,
  payForQRProductSplitController,
} = require("../controllers/walletController");

const authMiddleware =
  require("../middleware/authMiddleware");

// =====================================================
// GET MY WALLET
// =====================================================

router.get(
  "/",
  authMiddleware,
  getMyWallet
);

// =====================================================
// ADD MONEY
// DEVELOPMENT ONLY
// =====================================================

router.post(
  "/add-money",
  authMiddleware,
  addMoney
);

// =====================================================
// GET TRANSACTIONS
// =====================================================

router.get(
  "/transactions",
  authMiddleware,
  getMyTransactions
);

// =====================================================
// GENERIC WALLET PAYMENT
// =====================================================

router.post(
  "/pay",
  authMiddleware,
  payWithWallet
);

// =====================================================
// QR PRODUCT PAYMENT - WALLET ONLY
// =====================================================

router.post(
  "/pay-qr",
  authMiddleware,
  payForQRProductController
);

// =====================================================
// QR PRODUCT PAYMENT - PRACTICE SPLIT PAYMENT
// =====================================================

router.post(
  "/pay-qr-split",
  authMiddleware,
  payForQRProductSplitController
);

module.exports = router;