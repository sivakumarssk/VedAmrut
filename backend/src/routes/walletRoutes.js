// const express = require("express");

// const router = express.Router();

// const {
//   getMyWallet,
//   addMoney,
//   getMyTransactions,
//   payWithWallet,
// } = require("../controllers/walletController");

// const authMiddleware = require("../middleware/authMiddleware");

// // =====================================================
// // GET MY WALLET
// // =====================================================

// router.get(
//   "/",
//   authMiddleware,
//   getMyWallet
// );

// // =====================================================
// // ADD MONEY
// // DEVELOPMENT ONLY
// // =====================================================

// router.post(
//   "/add-money",
//   authMiddleware,
//   addMoney
// );

// // =====================================================
// // GET TRANSACTIONS
// // =====================================================

// router.get(
//   "/transactions",
//   authMiddleware,
//   getMyTransactions
// );

// // =====================================================
// // PAY USING WALLET
// // =====================================================

// router.post(
//   "/pay",
//   authMiddleware,
//   payWithWallet
// );

// module.exports = router;

const express = require("express");

const router =
  express.Router();

const {
  getMyWallet,
  addMoney,
  getMyTransactions,
  payWithWallet,
  payForQRProductController,
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
// QR PRODUCT PAYMENT
// =====================================================

router.post(
  "/pay-qr",
  authMiddleware,
  payForQRProductController
);

module.exports = router;