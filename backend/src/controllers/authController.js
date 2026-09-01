const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  createAuthUser,
  createRegistrationAddress,
  getUserByEmail,
  getUserByPhone,
} = require("../models/authModel");


// =====================================================
// REGISTER USER
// =====================================================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      address,
    } = req.body;

    console.log("=================================");
    console.log("REGISTER REQUEST");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Address:", address);
    console.log("=================================");


    // =====================================================
    // BASIC VALIDATION
    // =====================================================

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

    const finalAddress =
      typeof address === "string"
        ? address.trim()
        : "";

    if (!finalAddress) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }


    // =====================================================
    // CHECK EMAIL
    // =====================================================

    const existingUser =
      await getUserByEmail(email.trim());

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }


    // =====================================================
    // CHECK PHONE
    // =====================================================

    const existingPhone =
      await getUserByPhone(phone.trim());

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }


    // =====================================================
    // HASH PASSWORD
    // =====================================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await createAuthUser(
      name.trim(),
      email.trim(),
      phone.trim(),
      hashedPassword,
      finalAddress
    );
    const userAddress =
      await createRegistrationAddress(
        user.id,
        name.trim(),
        phone.trim(),
        finalAddress
      );


    // =====================================================
    // GENERATE JWT
    // =====================================================

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


    // =====================================================
    // REMOVE PASSWORD
    // =====================================================

    const {
      password: _password,
      ...userData
    } = user;


    // =====================================================
    // IMPORTANT:
    // RETURN ADDRESS INSIDE USER DATA
    // =====================================================

    userData.address = finalAddress;


    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,
      message: "Registration successful",

      token,

      data: userData,

      address: userAddress,
    });

  } catch (error) {

    console.error(
      "Register error:",
      error
    );

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
  checkMobile,
};