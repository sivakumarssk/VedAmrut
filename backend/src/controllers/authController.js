const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const {
  createAuthUser,
  getUserByEmail,
  getUserByPhone,
  replaceAdminUser,
} = require("../models/authModel");

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    console.log("=================================");
    console.log("REGISTER REQUEST");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("=================================");

    // BASIC VALIDATION
    if (
      !name ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone and password are required",
      });
    }

    // CHECK EMAIL
    const existingUser =
      await getUserByEmail(email.trim());

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // CHECK PHONE
    const existingPhone =
      await getUserByPhone(phone.trim());

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await createAuthUser(
      name.trim(),
      email.trim(),
      phone.trim(),
      hashedPassword
    );

    // GENERATE JWT
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

    // REMOVE PASSWORD
    const {
      password: _password,
      ...userData
    } = user;

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      data: userData,
    });

  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// =====================================================
// CREATE / REPLACE THE ADMIN ACCOUNT
//
// Only one admin account should ever exist. Calling this
// again replaces the existing admin's name/email/password
// rather than creating a second admin. Guarded by
// ADMIN_SETUP_KEY (set in .env) so this cannot be called
// by anyone who doesn't also know that secret — it is NOT
// protected by authMiddleware since there is no admin
// token yet the first time this runs.
// =====================================================

const createAdmin = async (req, res) => {
  try {
    const { name, email, password, setupKey } = req.body;

    if (
      !process.env.ADMIN_SETUP_KEY ||
      setupKey !== process.env.ADMIN_SETUP_KEY
    ) {
      return res.status(403).json({
        success: false,
        message: "Invalid setup key",
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await replaceAdminUser(
      name.trim(),
      email.trim().toLowerCase(),
      hashedPassword
    );

    return res.status(200).json({
      success: true,
      message: "Admin account created successfully",
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);

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

    const {
      phone,
      password,
    } = req.body;


    // =====================================================
    // VALIDATION
    // =====================================================

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Mobile number and password required",
      });
    }


    // =====================================================
    // FIND USER
    // =====================================================

    const user =
      await getUserByPhone(phone.trim());

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Mobile number not registered",
      });
    }


    // =====================================================
    // CHECK PASSWORD
    // =====================================================

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }


    // =====================================================
    // GENERATE JWT
    // =====================================================

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


    // =====================================================
    // RESPONSE
    // =====================================================

    // return res.status(200).json({
    //   success: true,
    //   message: "Login successful",

    //   token,

    //   user: {
    //     id: user.id,
    //     name: user.name,
    //     email: user.email,
    //     phone: user.phone,
    //     address: user.address || "",
    //     role: user.role,
    //   },
    // });
return res.status(200).json({
  success: true,
  message: "Login successful",
  token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address || "",
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
// ADMIN LOGIN
//
// Separate from the customer login above: this checks
// email + password (not phone), and only succeeds for a
// user whose role is "admin". Admin accounts are created
// directly via SQL / a one-off script, never through the
// public register endpoint.
// =====================================================

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await getUserByEmail(
      email.trim().toLowerCase()
    );

    if (!user || user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

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


    // =====================================================
    // VALIDATION
    // =====================================================

    if (!phone) {
      return res.status(400).json({
        success: false,
        message:
          "Mobile number is required",
      });
    }


    // =====================================================
    // FIND USER
    // =====================================================

    const user =
      await getUserByPhone(phone.trim());

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Mobile number is not registered",
      });
    }


    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      message: "Mobile number verified",

      // user: {
      //   id: user.id,
      //   name: user.name,
      //   email: user.email,
      //   phone: user.phone,
      //   address: user.address || "",
      //   role: user.role,
      // },
      user: {
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address || "",
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
  adminLogin,
  createAdmin,
  checkMobile,
};