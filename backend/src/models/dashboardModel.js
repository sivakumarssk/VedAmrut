const pool = require("../config/db");

// =====================================================
// DASHBOARD STATISTICS
// =====================================================

const getDashboardStats = async () => {
  // Total users
  const usersResult = await pool.query(`
    SELECT COUNT(*)::int AS total_users
    FROM users
  `);

  // Total orders
  const ordersResult = await pool.query(`
    SELECT COUNT(*)::int AS total_orders
    FROM orders
  `);

  // Orders grouped by status
  const statusResult = await pool.query(`
    SELECT
      LOWER(status) AS status,
      COUNT(*)::int AS count
    FROM orders
    GROUP BY LOWER(status)
  `);

  const statusCounts = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  statusResult.rows.forEach((row) => {
    if (statusCounts.hasOwnProperty(row.status)) {
      statusCounts[row.status] = row.count;
    }
  });

  return {
    total_users: usersResult.rows[0].total_users,
    total_orders: ordersResult.rows[0].total_orders,

    pending: statusCounts.pending,
    confirmed: statusCounts.confirmed,
    processing: statusCounts.processing,
    shipped: statusCounts.shipped,
    delivered: statusCounts.delivered,
    cancelled: statusCounts.cancelled,
  };
};

// =====================================================
// RECENT ORDERS
// =====================================================

const getRecentOrders = async (limit = 5) => {
  const result = await pool.query(
    `
    SELECT
      o.*,
      u.name AS user_name,
      u.phone AS user_phone
    FROM orders o
    LEFT JOIN users u
      ON o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT $1
    `,
    [limit]
  );

  return result.rows;
};

module.exports = {
  getDashboardStats,
  getRecentOrders,
};