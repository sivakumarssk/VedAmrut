

// const express = require("express");

// const router = express.Router();

// const {
//   generateProductQRCodes,
//   generateAllProductQRCodes,
//   getProductQRCodes,
//   getQRDetails,
//   claimQRReward,
//   deleteProductQRCodes,
// } = require("./controllers/qrcodecontroller");

// // =====================================================
// // GENERATE QR CODES FOR ONE PRODUCT
// // POST /api/product-qr/product/:productId/generate
// // =====================================================

// router.post(
//   "/product/:productId/generate",
//   generateProductQRCodes
// );

// // =====================================================
// // GENERATE QR CODES FOR ALL PRODUCTS
// // POST /api/product-qr/generate-all
// // =====================================================

// router.post(
//   "/generate-all",
//   generateAllProductQRCodes
// );

// // =====================================================
// // GET QR CODES FOR ONE PRODUCT
// // GET /api/product-qr/product/:productId
// // =====================================================

// router.get(
//   "/product/:productId",
//   getProductQRCodes
// );

// // =====================================================
// // GET SINGLE QR DETAILS
// // GET /api/product-qr/scan/:qrCode
// // =====================================================

// router.get(
//   "/scan/:qrCode",
//   getQRDetails
// );

// // =====================================================
// // CLAIM QR GIFT
// // POST /api/product-qr/claim
// // =====================================================

// router.post(
//   "/claim",
//   claimQRReward
// );

// // =====================================================
// // DELETE PRODUCT QR CODES
// // DELETE /api/product-qr/product/:productId
// // =====================================================

// router.delete(
//   "/product/:productId",
//   deleteProductQRCodes
// );

// module.exports = router;

const express = require("express");

const router = express.Router();

// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// QR CODE CONTROLLER
// =====================================================

const {
  generateProductQRCodes,
  generateAllProductQRCodes,
  getProductQRCodes,
  getQRDetails,
  claimQRReward,
  deleteProductQRCodes,
} = require("../controllers/qrCodeController");

// =====================================================
// GENERATE QR CODES FOR ONE PRODUCT
// POST /api/product-qr/product/:productId/generate
// =====================================================

router.post(
  "/product/:productId/generate",
  generateProductQRCodes
);

// =====================================================
// GENERATE QR CODES FOR ALL PRODUCTS
// POST /api/product-qr/generate-all
// =====================================================

router.post(
  "/generate-all",
  generateAllProductQRCodes
);

// =====================================================
// GET QR CODES FOR ONE PRODUCT
// GET /api/product-qr/product/:productId
// =====================================================

router.get(
  "/product/:productId",
  getProductQRCodes
);

// =====================================================
// GET SINGLE QR DETAILS
// GET /api/product-qr/scan/:qrCode
// =====================================================

router.get(
  "/scan/:qrCode",
  getQRDetails
);

// =====================================================
// CLAIM QR GIFT
// POST /api/product-qr/claim
//
// AUTHENTICATION REQUIRED
// =====================================================

router.post(
  "/claim",
  authMiddleware,
  claimQRReward
);

// =====================================================
// DELETE PRODUCT QR CODES
// DELETE /api/product-qr/product/:productId
// =====================================================

router.delete(
  "/product/:productId",
  deleteProductQRCodes
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;