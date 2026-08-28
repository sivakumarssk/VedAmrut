const jwt = require("jsonwebtoken");

const {
  saveOTP,
  getOTP,
  deleteOTP,
  getUserByPhone,
} = require("../models/mobileAuthModel");

// =========================
// SEND OTP
// =========================
const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Valid 10-digit mobile number required",
      });
    }

    // Temporary OTP for testing
    const otp = "1234";

    // OTP expires after 5 minutes
    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await saveOTP(phone, otp, expiresAt);

    console.log(`📱 OTP for ${phone}: ${otp}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("Send OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// =========================
// VERIFY OTP
// =========================
const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    const otpRecord = await getOTP(phone);

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    // Check expiry
    if (new Date() > new Date(otpRecord.expires_at)) {
      await deleteOTP(phone);

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Check OTP
    if (otpRecord.otp !== otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP verified
    await deleteOTP(phone);

    // Check if user exists
    const user = await getUserByPhone(phone);

    // Existing user
    if (user) {
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
        isNewUser: false,
        message: "Login successful",
        token,
        user,
      });
    }

    // New user
    return res.status(200).json({
      success: true,
      isNewUser: true,
      message: "OTP verified. Please register",
      phone,
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// =========================
// EXPORT
// =========================
module.exports = {
  sendOTP,
  verifyOTP,
};