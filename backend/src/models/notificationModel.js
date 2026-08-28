const pool = require("../config/db");

// =====================================================
// CREATE NOTIFICATION
// =====================================================

const createNotification = async (
  title,
  message,
  type = "general",
  userId = null,
  orderId = null
) => {
  const result = await pool.query(
    `
    INSERT INTO notifications
      (
        title,
        message,
        type,
        user_id,
        order_id
      )
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      title,
      message,
      type,
      userId,
      orderId,
    ]
  );

  return result.rows[0];
};

// =====================================================
// GET ALL NOTIFICATIONS
// =====================================================

const getAllNotifications = async () => {
  const result = await pool.query(`
    SELECT *
    FROM notifications
    ORDER BY created_at DESC
  `);

  return result.rows;
};

// =====================================================
// GET UNREAD COUNT
// =====================================================

const getUnreadNotificationCount =
  async () => {
    const result = await pool.query(`
      SELECT COUNT(*)::int AS count
      FROM notifications
      WHERE is_read = FALSE
    `);

    return result.rows[0].count;
  };

// =====================================================
// MARK ONE AS READ
// =====================================================

const markNotificationAsRead = async (
  id
) => {
  const result = await pool.query(
    `
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};

// =====================================================
// MARK ALL AS READ
// =====================================================

const markAllNotificationsAsRead =
  async () => {
    const result = await pool.query(`
      UPDATE notifications
      SET is_read = TRUE
      WHERE is_read = FALSE
      RETURNING *
    `);

    return result.rows;
  };

module.exports = {
  createNotification,
  getAllNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};