const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addAddress,
  getAddresses,
  getAddress,
  editAddress,
  removeAddress,
  makeDefaultAddress,
} = require("../controllers/addressController");


// ==========================================
// GET ALL ADDRESSES
// ==========================================

router.get(
  "/",
  authMiddleware,
  getAddresses
);


// ==========================================
// ADD ADDRESS
// ==========================================

router.post(
  "/",
  authMiddleware,
  addAddress
);


// ==========================================
// GET ADDRESS BY ID
// ==========================================

router.get(
  "/:id",
  authMiddleware,
  getAddress
);


// ==========================================
// UPDATE ADDRESS
// ==========================================

router.put(
  "/:id",
  authMiddleware,
  editAddress
);


// ==========================================
// DELETE ADDRESS
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  removeAddress
);


// ==========================================
// SET DEFAULT ADDRESS
// ==========================================

router.put(
  "/:id/default",
  authMiddleware,
  makeDefaultAddress
);


module.exports = router;