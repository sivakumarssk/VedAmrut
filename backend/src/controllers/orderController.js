
const pool = require("../config/db");

const {
  createOrderFromCart,
  getOrdersByUserId,
  getOrderById,
    getAllOrders,
     getAdminOrderById: getAdminOrderByIdModel,
  updateOrderStatus,
  cancelOrder,
} = require("../models/orderModel");
const {
  createNotification,
} = require("../models/notificationModel");
// =====================================================
// PLACE ORDER
// =====================================================

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
//     const {
//   addressId,
//   paymentMethod = "COD",
//   buyNowProductId = null,
//   buyNowQuantity = 1,
// } = req.body;
const {
  addressId,
  paymentMethod = "COD",
  buyNowProductId,
  buyNowQuantity = 1,
} = req.body;

console.log("================================");
console.log("RAW ORDER BODY:");
console.log(JSON.stringify(req.body, null, 2));

console.log("BODY buyNowProductId:", buyNowProductId);
console.log("BODY buyNowProductId TYPE:", typeof buyNowProductId);
console.log("BODY buyNowQuantity:", buyNowQuantity);
console.log("================================");
console.log("================================");
console.log(
  "BUY NOW PRODUCT ID TYPE:",
  typeof buyNowProductId
);
console.log("BUY NOW QUANTITY:", buyNowQuantity);
console.log("================================");
const parsedBuyNowProductId =
  buyNowProductId !== null &&
  buyNowProductId !== undefined &&
  buyNowProductId !== ''
    ? Number(buyNowProductId)
    : null;

const parsedBuyNowQuantity =
  Number(buyNowQuantity) || 1;
console.log("BUY NOW PRODUCT ID:", buyNowProductId);
console.log("BUY NOW QUANTITY:", buyNowQuantity);
    console.log("================================");
    console.log("PLACE ORDER");
    console.log("USER ID:", userId);
    console.log("ADDRESS ID:", addressId);
    console.log("PAYMENT METHOD:", paymentMethod);

    // =================================================
    // CHECK ADDRESS ID
    // =================================================

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    // =================================================
    // GET USER ADDRESS
    // =================================================

    const addressResult = await pool.query(
      `
      SELECT
        id,
        user_id,
        full_name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        landmark
      FROM addresses
      WHERE id = $1
        AND user_id = $2
      `,
      [addressId, userId]
    );

    if (addressResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Delivery address not found",
      });
    }

    const address = addressResult.rows[0];

    console.log("ADDRESS FOUND:", address);

    // =================================================
    // CREATE ORDER
    // =================================================

// const result = await createOrderFromCart(
//   userId,
//   address,
//   paymentMethod,
//   buyNowProductId,
//   buyNowQuantity
// );
const result = await createOrderFromCart(
  userId,
  address,
  paymentMethod,
  parsedBuyNowProductId,
  parsedBuyNowQuantity
);
const order = result.order;

await createNotification(
  "New Order",
  `New order #${order.id} has been placed.`,
  "order",
  userId,
  order.id
);
    console.log(
      "ORDER CREATED SUCCESSFULLY:",
      result.order
    );

    console.log("================================");

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: result,
    });

  } catch (error) {
    console.error(
      "PLACE ORDER ERROR:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to place order",
    });
  }
};

// =====================================================
// GET MY ORDERS
// =====================================================

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(
      "GET MY ORDERS USER:",
      userId
    );

    const orders =
      await getOrdersByUserId(userId);

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });

  } catch (error) {
    console.error(
      "GET MY ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// =====================================================
// GET SINGLE ORDER
// =====================================================

const getMyOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(
      "GET ORDER:",
      id,
      "USER:",
      userId
    );

    const order = await getOrderById(
      userId,
      id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });

  } catch (error) {
    console.error(
      "GET ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const changeOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("================================");
    console.log("UPDATE ORDER STATUS");
    console.log("ORDER ID:", id);
    console.log("STATUS:", status);

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    const order = await updateOrderStatus(
      id,
      status
    );

    return res.status(200).json({
      success: true,
      message:
        status === "cancelled"
          ? "Order cancelled successfully"
          : "Order status updated successfully",
      data: order,
    });

  } catch (error) {

    console.error(
      "UPDATE ORDER STATUS ERROR:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update order status",
    });
  }
};

// =====================================================
// CANCEL MY ORDER
// =====================================================

const cancelMyOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log("================================");
    console.log("CANCEL MY ORDER");
    console.log("USER ID:", userId);
    console.log("ORDER ID:", id);

    const order = await cancelOrder(
      userId,
      id
    );

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });

  } catch (error) {
    console.error(
      "CANCEL MY ORDER ERROR:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to cancel order",
    });
  }
};
// =====================================================
// GET ALL ORDERS - ADMIN
// =====================================================

const getAdminOrders = async (req, res) => {
  try {
    console.log("================================");
    console.log("ADMIN FETCH ALL ORDERS");

    const orders = await getAllOrders();

    console.log(
      "ADMIN ORDERS COUNT:",
      orders.length
    );

    return res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: orders,
    });

  } catch (error) {
    console.error(
      "GET ADMIN ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
    });
  }
};
// =====================================================
// GET SINGLE ORDER - ADMIN
// NO ADMIN LOGIN
// =====================================================

const getAdminOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("================================");
    console.log("ADMIN GET ORDER DETAILS");
    console.log("ORDER ID:", id);

    const order = await getAdminOrderByIdModel(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error(
      "ADMIN GET ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};
// =====================================================
// EXPORT
// =====================================================

module.exports = {
  placeOrder,
  getMyOrders,
  getMyOrder,
   getAdminOrderById,
   getAdminOrders,
  changeOrderStatus,
    cancelMyOrder,
};