const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  placeOrder,
  getMyOrders,
  getMyOrder,
  getAdminOrders,
   getAdminOrderById,
  changeOrderStatus,
  cancelMyOrder,
} = require("../controllers/orderController");

// =====================================================
// CUSTOMER - PLACE ORDER
// =====================================================

router.post(
  "/",
  authMiddleware,
  placeOrder
);

// =====================================================
// CUSTOMER - MY ORDERS
// =====================================================

router.get(
  "/my-orders",
  authMiddleware,
  getMyOrders
);

// =====================================================
// ADMIN - GET ALL ORDERS
// NO ADMIN LOGIN
// =====================================================

router.get(
  "/admin",
  getAdminOrders
);

// =====================================================
// ADMIN - UPDATE ORDER STATUS
// NO ADMIN LOGIN
// =====================================================

router.put(
  "/:id/status",
  changeOrderStatus
);

// =====================================================
// CUSTOMER - CANCEL ORDER
// =====================================================

router.put(
  "/:id/cancel",
  authMiddleware,
  cancelMyOrder
);

// =====================================================
// CUSTOMER - SINGLE ORDER
// =====================================================

router.get(
  "/:id",
  authMiddleware,
  getMyOrder
);
// =====================================================
// ADMIN - GET SINGLE ORDER
// NO ADMIN LOGIN
// =====================================================

router.get(
  "/admin/:id",
  getAdminOrderById
);

module.exports = router;