

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// ========================================
// ROUTES
// ========================================

const userRoutes =
  require("./routes/userRoutes");

const authRoutes =
  require("./routes/authRoutes");

const mobileAuthRoutes =
  require("./routes/mobileAuthRoutes");

const categoryRoutes =
  require("./routes/categoryRoutes");

const productRoutes =
  require("./routes/productRoutes");

const cartRoutes =
  require("./routes/cartRoutes");

const addressRoutes =
  require("./routes/addressRoutes");

const orderRoutes =
  require("./routes/orderRoutes");

const dashboardRoutes =
  require("./routes/dashboardRoutes");

const notificationRoutes =
  require("./routes/notificationRoutes");

const walletRoutes =
  require("./routes/walletRoutes");

const productQrRoutes =
  require("./routes/productQrRoutes");
const reviewRoutes =
  require("./routes/reviewRoutes");
// ========================================
// APP
// ========================================

const app = express();

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ========================================
// UPLOADS
// ========================================

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);

// ========================================
// TEST ROUTE
// ========================================

app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,
      message:
        "VedAmrut Backend Running 🚀",
    });
  }
);

// ========================================
// API ROUTES
// ========================================

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/mobile-auth",
  mobileAuthRoutes
);

app.use(
  "/api/categories",
  categoryRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/addresses",
  addressRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/wallet",
  walletRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/product-qr",
  productQrRoutes
);
app.use(
  "/api/reviews",
  reviewRoutes
);
// ========================================
// 404 HANDLER
// ========================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        "API route not found",
      path: req.originalUrl,
    });
  }
);

// ========================================
// ERROR HANDLER
// ========================================

app.use(
  (error, req, res, next) => {
    console.error(
      "GLOBAL ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
);

module.exports = app;