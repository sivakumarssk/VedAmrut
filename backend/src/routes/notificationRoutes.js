const express = require("express");

const router = express.Router();

const {
  getNotifications,
  getUnreadCount,
  addNotification,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

// =====================================================
// GET ALL NOTIFICATIONS
// =====================================================

router.get(
  "/",
  getNotifications
);

// =====================================================
// GET UNREAD COUNT
// =====================================================

router.get(
  "/unread-count",
  getUnreadCount
);

// =====================================================
// CREATE NOTIFICATION
// =====================================================

router.post(
  "/",
  addNotification
);

// =====================================================
// MARK ALL READ
// =====================================================

router.put(
  "/read-all",
  markAllAsRead
);

// =====================================================
// MARK ONE READ
// =====================================================

router.put(
  "/:id/read",
  markAsRead
);

module.exports = router;