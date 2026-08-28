// const express = require("express");
// const router = express.Router();

// const {
//   registerUser,
//   getUsers,
//   getUser,
//   editUser,
//   removeUser,
//   getProfile,
//   deleteMyAccount,
// } = require("../controllers/userController");

// const authMiddleware = require("../middleware/authMiddleware");


// // Create User
// router.post("/register", registerUser);


// // Get All Users
// router.get("/", getUsers);


// // Protected Profile Route (keep above /:id)
// router.get("/profile", authMiddleware, getProfile);


// // Get User By ID
// router.get("/:id", getUser);


// // Update User
// router.put("/:id", editUser);


// // Delete User
// router.delete("/:id", removeUser);
// // Delete Logged-In User Account
// router.delete(
//   "/profile",
//   authMiddleware,
//   deleteMyAccount
// );


// module.exports = router;
const express = require("express");

const router = express.Router();

const {
  registerUser,
  getUsers,
  getUser,
  editUser,
  removeUser,
  getProfile,
  deleteMyAccount,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

// ========================================
// CREATE USER
// ========================================

router.post("/register", registerUser);

// ========================================
// GET ALL USERS
// ========================================

router.get("/", getUsers);

// ========================================
// GET LOGGED-IN USER PROFILE
// IMPORTANT: KEEP BEFORE /:id
// ========================================

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

// ========================================
// DELETE LOGGED-IN USER ACCOUNT
// IMPORTANT: KEEP BEFORE /:id
// ========================================

router.delete(
  "/profile",
  authMiddleware,
  deleteMyAccount
);

// ========================================
// GET USER BY ID
// ========================================

router.get("/:id", getUser);

// ========================================
// UPDATE USER
// ========================================

router.put("/:id", editUser);

// ========================================
// DELETE USER BY ID
// ========================================

router.delete("/:id", removeUser);

module.exports = router;