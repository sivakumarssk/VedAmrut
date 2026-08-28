const express = require("express");
const router = express.Router();


const {
  register,
  login,
  checkMobile,
} = require("../controllers/authController");


// Register API
router.post("/register", register);


// Login API
router.post("/login", login);

router.post("/check-mobile", checkMobile);

module.exports = router;