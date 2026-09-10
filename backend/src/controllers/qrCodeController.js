

const {
  createProductQRCodes,
  createAllProductQRCodes,
  getQRCodesByProductId,
  getQRByCode,
  claimQRCodeAndReward,
    markQRCodeClaimed,
  deleteQRCodesByProductId,
} = require("../models/qrCodeModel");

// =====================================================
// GENERATE QR CODES FOR ONE PRODUCT
// =====================================================

const generateProductQRCodes = async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    console.log("================================");
    console.log("GENERATE PRODUCT QR");
    console.log("PRODUCT ID:", productId);
    console.log("================================");

    const qrCodes = await createProductQRCodes(productId);

    return res.status(200).json({
      success: true,
      message: "QR codes generated successfully",
      data: qrCodes,
    });
  } catch (error) {
    console.error("GENERATE QR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate QR codes",
    });
  }
};

// =====================================================
// GENERATE QR CODES FOR ALL PRODUCTS
// =====================================================

const generateAllProductQRCodes = async (req, res) => {
  try {
    console.log("================================");
    console.log("GENERATE ALL PRODUCT QR");
    console.log("================================");

    const result = await createAllProductQRCodes();

    return res.status(200).json({
      success: true,
      message: "QR codes generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("GENERATE ALL QR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate QR codes",
    });
  }
};

// =====================================================
// GET QR CODES FOR PRODUCT
// =====================================================

const getProductQRCodes = async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    console.log("================================");
    console.log("GET PRODUCT QR CODES");
    console.log("PRODUCT ID:", productId);
    console.log("================================");

    const result = await getQRCodesByProductId(productId);

    return res.status(200).json({
      success: true,
      message: "QR codes fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("GET QR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch QR codes",
    });
  }
};

// =====================================================
// GET SINGLE QR DETAILS
// =====================================================

const getQRDetails = async (req, res) => {
  try {
    const qrCode = String(req.params.qrCode || "").trim();

    if (!qrCode) {
      return res.status(400).json({
        success: false,
        message: "QR code is required",
      });
    }

    console.log("================================");
    console.log("GET QR DETAILS");
    console.log("QR CODE:", qrCode);
    console.log("================================");

    const result = await getQRByCode(qrCode);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "QR code not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "QR details fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("GET QR DETAILS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get QR details",
    });
  }
};

// =====================================================
// CLAIM QR REWARD
// =====================================================

const claimQRReward = async (req, res) => {
  try {
    // =================================================
    // GET QR CODE
    // =================================================

    const qrCode = String(req.body?.qrCode || "").trim();

    // =================================================
    // GET USER ID FROM JWT
    // =================================================

    const userId =
      req.user?.id ||
      req.user?.userId ||
      req.user?.user_id;

    console.log("================================");
    console.log("CLAIM QR REQUEST");
    console.log("REQ.USER:", req.user);
    console.log("USER ID:", userId);
    console.log("QR CODE:", qrCode);
    console.log("================================");

    // =================================================
    // VALIDATE QR
    // =================================================

    if (!qrCode) {
      return res.status(400).json({
        success: false,
        message: "QR code is required",
      });
    }

    // =================================================
    // VALIDATE AUTHENTICATION
    // =================================================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // =================================================
    // CLAIM
    // =================================================

    const result = await claimQRCodeAndReward(
      qrCode,
      userId
    );

    // =================================================
    // CLAIM FAILED
    // =================================================

    if (!result.success) {
      let message = "Unable to claim QR reward.";

      if (result.reason === "ALREADY_CLAIMED") {
        message = "This QR has already been claimed.";
      }

      if (result.reason === "NO_GIFT") {
        message = "This QR does not contain a gift.";
      }

      if (result.reason === "NOT_FOUND") {
        message = "QR code not found.";
      }

      if (result.reason === "INVALID_QR") {
        message = "Invalid QR code.";
      }

      return res.status(400).json({
        success: false,
        message,
        data: result,
      });
    }

    // =================================================
    // SUCCESS
    // =================================================

    console.log("================================");
    console.log("CLAIM QR RESPONSE SUCCESS");
    console.log("USER ID:", userId);
    console.log("REWARD:", result.reward);
    console.log(
      "REMAINING BALANCE:",
      result.remaining_balance
    );
    console.log("================================");

    return res.status(200).json({
      success: true,
      message: "Gift reward claimed successfully",
      data: result,
    });
  } catch (error) {
    console.error("CLAIM QR ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to claim QR reward",
    });
  }
};

// =====================================================
// MARK QR AS CLAIMED AFTER SCRATCHING
// =====================================================

const markQRClaimed = async (req, res) => {
  try {
    const qrCode =
      String(
        req.body?.qrCode || ""
      ).trim();

    const userId =
      req.user?.id ||
      req.user?.userId ||
      req.user?.user_id;

    console.log(
      "================================"
    );

    console.log(
      "MARK QR CLAIMED REQUEST"
    );

    console.log(
      "REQ.USER:",
      req.user
    );

    console.log(
      "USER ID:",
      userId
    );

    console.log(
      "QR CODE:",
      qrCode
    );

    console.log(
      "================================"
    );

    // =================================================
    // VALIDATE QR
    // =================================================

    if (!qrCode) {
      return res.status(400).json({
        success: false,
        message: "QR code is required",
      });
    }

    // =================================================
    // VALIDATE USER
    // =================================================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User authentication required",
      });
    }

    // =================================================
    // MARK CLAIMED
    // =================================================

    const result =
      await markQRCodeClaimed(
        qrCode,
        userId
      );

    // =================================================
    // FAILED
    // =================================================

    if (!result.success) {
      let message =
        "Unable to mark QR as claimed.";

      if (
        result.reason ===
        "ALREADY_CLAIMED"
      ) {
        message =
          "This QR has already been claimed.";
      }

      if (
        result.reason ===
        "NOT_FOUND"
      ) {
        message =
          "QR code not found.";
      }

      if (
        result.reason ===
        "INVALID_QR"
      ) {
        message =
          "Invalid QR code.";
      }

      if (
        result.reason ===
        "USER_NOT_FOUND"
      ) {
        message =
          "User not found.";
      }

      return res.status(400).json({
        success: false,
        message,
        data: result,
      });
    }

    // =================================================
    // SUCCESS
    // =================================================

    console.log(
      "QR MARKED AS CLAIMED SUCCESSFULLY"
    );

    return res.status(200).json({
      success: true,

      message:
        "QR marked as claimed successfully.",

      data: result,
    });
  } catch (error) {
    console.error(
      "MARK QR CLAIMED ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to mark QR as claimed.",
    });
  }
};

// =====================================================
// DELETE QR CODES
// =====================================================

const deleteProductQRCodes = async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const result =
      await deleteQRCodesByProductId(productId);

    return res.status(200).json({
      success: true,
      message: "QR codes deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("DELETE QR ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to delete QR codes",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  generateProductQRCodes,
  generateAllProductQRCodes,
  getProductQRCodes,
  getQRDetails,
  claimQRReward,
   markQRClaimed,
  deleteProductQRCodes,
};