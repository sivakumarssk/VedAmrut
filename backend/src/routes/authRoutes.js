const express = require("express");
const router = express.Router();


const {
  register,
  login,
  adminLogin,
  createAdmin,
  checkMobile,
} = require("../controllers/authController");


// Register API
router.post("/register", register);


// Login API
router.post("/login", login);

// Admin Login API
router.post("/admin-login", adminLogin);

// Create / Replace Admin Account (guarded by ADMIN_SETUP_KEY)
router.post("/create-admin", createAdmin);

router.post("/check-mobile", checkMobile);

module.exports = router;