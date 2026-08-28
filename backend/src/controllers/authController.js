// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const {
//   createAuthUser,
//   getUserByEmail,
//   getUserByPhone,
// } = require("../models/authModel");


// // Register User
// const register = async (req, res) => {
//   try {
//     const { name, email, phone, password } = req.body;

//     // Validation
//     if (!name || !email || !phone || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     // Check existing user
//     const existingUser = await getUserByEmail(email);

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already exists",
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = await createAuthUser(
//       name,
//       email,
//       phone,
//       hashedPassword
//     );

//     // Remove password from response
//     const { password: _, ...userData } = user;

//     res.status(201).json({
//       success: true,
//       message: "Register successful",
//       data: userData,
//     });

//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };


// // Login User
// // const login = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     // Validation
// //     if (!email || !password) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Email and password required",
// //       });
// //     }

// //     // Find user
// //     const user = await getUserByEmail(email);

// //     if (!user) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "User not found",
// //       });
// //     }

// //     // Compare password
// //     const isMatch = await bcrypt.compare(
// //       password,
// //       user.password
// //     );

// //     if (!isMatch) {
// //       return res.status(401).json({
// //         success: false,
// //         message: "Invalid password",
// //       });
// //     }

// //     // Generate JWT token
// //     const token = jwt.sign(
// //       {
// //         id: user.id,
// //         email: user.email,
// //         role: user.role,
// //       },
// //       process.env.JWT_SECRET,
// //       {
// //         expiresIn: "7d",
// //       }
// //     );

// //     res.status(200).json({
// //       success: true,
// //       message: "Login successful",
// //       token,
// //       user: {
// //         id: user.id,
// //         name: user.name,
// //         email: user.email,
// //         phone: user.phone,
// //         role: user.role,
// //       },
// //     });

// //   } catch (error) {
// //     console.error(error);

// //     res.status(500).json({
// //       success: false,
// //       message: "Internal Server Error",
// //     });
// //   }
// // };

// const login = async (req, res) => {
//   try {
//     const { phone, password } = req.body;

//     // Validation
//     if (!phone || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Mobile number and password required",
//       });
//     }

//     // Find user by mobile number
//     const user = await getUserByPhone(phone);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "Mobile number not registered",
//       });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(
//       password,
//       user.password
//     );

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid password",
//       });
//     }

//     // Generate JWT
//     const token = jwt.sign(
//       {
//         id: user.id,
//         phone: user.phone,
//         email: user.email,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );

//     // Send response
//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//       },
//     });

//   } catch (error) {
//     console.error("Login error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };
// const checkMobile = async (req, res) => {
//   try {
//     const { phone } = req.body;

//     if (!phone) {
//       return res.status(400).json({
//         success: false,
//         message: "Mobile number is required",
//       });
//     }

//     const user = await getUserByPhone(phone);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "Mobile number is not registered",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Mobile number verified",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//       },
//     });

//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// module.exports = {
//   register,
//   login,
//   checkMobile,
// };

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  createAuthUser,
  getUserByEmail,
  getUserByPhone,
} = require("../models/authModel");

// =====================================================
// REGISTER USER
// =====================================================

const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing email
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check existing phone
    const existingPhone = await getUserByPhone(phone);

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    const user = await createAuthUser(
      name,
      email,
      phone,
      hashedPassword
    );

    // =================================================
    // GENERATE JWT TOKEN
    // =================================================

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Remove password
    const { password: _, ...userData } = user;

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,
      message: "Register successful",
      token,
      data: userData,
    });

  } catch (error) {
    console.error(
      "Register error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =====================================================
// LOGIN USER
// =====================================================

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Validation
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Mobile number and password required",
      });
    }

    // Find user
    const user = await getUserByPhone(phone);

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Mobile number not registered",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // =================================================
    // GENERATE JWT
    // =================================================

    const token = jwt.sign(
      {
        id: user.id,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =====================================================
// CHECK MOBILE
// =====================================================

const checkMobile = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message:
          "Mobile number is required",
      });
    }

    const user =
      await getUserByPhone(phone);

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Mobile number is not registered",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mobile number verified",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      "Check mobile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  register,
  login,
  checkMobile,
};