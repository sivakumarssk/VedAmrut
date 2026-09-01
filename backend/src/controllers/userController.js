const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  //  deleteMyAccount,
} = require("../models/userModel");

const {
  createNotification,
} = require("../models/notificationModel");

// Create User
const registerUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await createUser(name, email, phone);

    await createNotification(
  "New User",
  `${name} has registered as a new customer.`,
  "user",
  user.id,
  null
);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    console.log("ADMIN USERS:", users);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get User By ID
const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update User

// const editUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const {
//       name,
//       email,
//       phone,
//       address,
//     } = req.body;

//     const user = await updateUser(
//       id,
//       name,
//       email,
//       phone,
//       address
//     );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       data: user,
//     });

//   } catch (error) {
//     console.error("Edit User Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };
const editUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      address,
      dob,
    } = req.body;

    const user = await updateUser(
      id,
      name,
      email,
      phone,
      address,
      dob
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });

  } catch (error) {
    console.error("Edit User Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// Delete User
const removeUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await deleteUser(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// Get Logged In User Profile
// Get Logged In User Profile
const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove password before sending user data
    const { password, ...safeUser } = user;

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: safeUser,
    });

  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// ==========================================
// DELETE LOGGED-IN USER ACCOUNT
// ==========================================
const deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await deleteUser(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete My Account Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete account",
    });
  }
};
module.exports = {
  registerUser,
  getUsers,
  getUser,
  editUser,
  removeUser,
   getProfile,
   deleteMyAccount,
};