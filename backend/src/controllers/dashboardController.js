const {
  getDashboardStats,
  getRecentOrders,
} = require("../models/dashboardModel");

// =====================================================
// GET DASHBOARD
// =====================================================

const getDashboard = async (req, res) => {
  try {
    const stats = await getDashboardStats();

    const recentOrders =
      await getRecentOrders(5);

    res.status(200).json({
      success: true,
      message: "Dashboard fetched successfully",

      data: {
        stats,
        recentOrders,
      },
    });
  } catch (error) {
    console.error(
      "DASHBOARD CONTROLLER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
    });
  }
};

module.exports = {
  getDashboard,
};