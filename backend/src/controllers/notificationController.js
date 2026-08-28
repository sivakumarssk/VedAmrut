const {
  createNotification,
  getAllNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../models/notificationModel");

// =====================================================
// GET ALL
// =====================================================

const getNotifications = async (
  req,
  res
) => {
  try {
    const notifications =
      await getAllNotifications();

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error(
      "GET NOTIFICATIONS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch notifications",
    });
  }
};

// =====================================================
// UNREAD COUNT
// =====================================================

const getUnreadCount = async (
  req,
  res
) => {
  try {
    const count =
      await getUnreadNotificationCount();

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error(
      "UNREAD COUNT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch unread count",
    });
  }
};

// =====================================================
// CREATE
// =====================================================

const addNotification = async (
  req,
  res
) => {
  try {
    const {
      title,
      message,
      type,
      user_id,
      order_id,
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Title and message are required",
      });
    }

    const notification =
      await createNotification(
        title,
        message,
        type || "general",
        user_id || null,
        order_id || null
      );

    res.status(201).json({
      success: true,
      message:
        "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    console.error(
      "CREATE NOTIFICATION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create notification",
    });
  }
};

// =====================================================
// MARK ONE READ
// =====================================================

const markAsRead = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const notification =
      await markNotificationAsRead(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error(
      "MARK READ ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update notification",
    });
  }
};

// =====================================================
// MARK ALL READ
// =====================================================

const markAllAsRead = async (
  req,
  res
) => {
  try {
    await markAllNotificationsAsRead();

    res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "MARK ALL READ ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update notifications",
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  addNotification,
  markAsRead,
  markAllAsRead,
};