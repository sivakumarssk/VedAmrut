
// const {
//   getOrCreateWallet,
//   addMoneyToWallet,
//   getWalletTransactions,
//   payFromWallet,
//   payForQRProduct,
// } = require("../models/walletModel");

// // =====================================================
// // GET MY WALLET
// // =====================================================

// const getMyWallet = async (
//   req,
//   res
// ) => {
//   try {
//     const userId =
//       req.user.id;

//     const wallet =
//       await getOrCreateWallet(
//         userId
//       );

//     return res.status(200).json({
//       success: true,

//       message:
//         "Wallet fetched successfully",

//       data: wallet,
//     });
//   } catch (error) {
//     console.error(
//       "GET WALLET ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         "Failed to fetch wallet",
//     });
//   }
// };

// // =====================================================
// // ADD MONEY
// // DEVELOPMENT ONLY
// // =====================================================

// const addMoney = async (
//   req,
//   res
// ) => {
//   try {
//     const userId =
//       req.user.id;

//     const { amount } =
//       req.body;

//     const numericAmount =
//       Number(amount);

//     if (
//       !Number.isFinite(
//         numericAmount
//       ) ||
//       numericAmount <= 0
//     ) {
//       return res.status(400).json({
//         success: false,

//         message:
//           "Valid amount is required",
//       });
//     }

//     const result =
//       await addMoneyToWallet(
//         userId,
//         numericAmount,
//         "CREDIT",
//         "Development wallet credit"
//       );

//     return res.status(200).json({
//       success: true,

//       message:
//         "Money added to wallet successfully",

//       data: result,
//     });
//   } catch (error) {
//     console.error(
//       "ADD WALLET MONEY ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         error.message ||
//         "Failed to add money",
//     });
//   }
// };

// // =====================================================
// // GET TRANSACTIONS
// // =====================================================

// const getMyTransactions = async (
//   req,
//   res
// ) => {
//   try {
//     const userId =
//       req.user.id;

//     const transactions =
//       await getWalletTransactions(
//         userId
//       );

//     return res.status(200).json({
//       success: true,

//       message:
//         "Wallet transactions fetched successfully",

//       data: transactions,
//     });
//   } catch (error) {
//     console.error(
//       "GET WALLET TRANSACTIONS ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         "Failed to fetch wallet transactions",
//     });
//   }
// };

// // =====================================================
// // GENERIC WALLET PAYMENT
// // =====================================================

// const payWithWallet = async (
//   req,
//   res
// ) => {
//   try {
//     const userId =
//       req.user.id;

//     const {
//       amount,
//       description,
//     } = req.body;

//     const numericAmount =
//       Number(amount);

//     if (
//       !Number.isFinite(
//         numericAmount
//       ) ||
//       numericAmount <= 0
//     ) {
//       return res.status(400).json({
//         success: false,

//         message:
//           "Valid payment amount is required",
//       });
//     }

//     const result =
//       await payFromWallet(
//         userId,
//         numericAmount,
//         description ||
//           "Wallet payment"
//       );

//     return res.status(200).json({
//       success: true,

//       message:
//         "Payment successful",

//       data: result,
//     });
//   } catch (error) {
//     console.error(
//       "WALLET PAYMENT ERROR:",
//       error
//     );

//     if (
//       error.message ===
//       "Insufficient wallet balance"
//     ) {
//       return res.status(400).json({
//         success: false,

//         message:
//           "Insufficient wallet balance",
//       });
//     }

//     return res.status(500).json({
//       success: false,

//       message:
//         error.message ||
//         "Wallet payment failed",
//     });
//   }
// };

// // =====================================================
// // PAY FOR QR PRODUCT
// // =====================================================

// const payForQRProductController =
//   async (
//     req,
//     res
//   ) => {
//     try {
//       const userId =
//         req.user.id;

//       const {
//         productId,
//         qrCode,
//         description,
//       } = req.body;

//       console.log(
//         "================================"
//       );

//       console.log(
//         "QR WALLET PAYMENT"
//       );

//       console.log(
//         "USER ID:",
//         userId
//       );

//       console.log(
//         "PRODUCT ID:",
//         productId
//       );

//       console.log(
//         "QR CODE:",
//         qrCode
//       );

//       console.log(
//         "================================"
//       );

//       // =================================================
//       // VALIDATION
//       // =================================================

//       if (!productId) {
//         return res.status(400).json({
//           success: false,

//           message:
//             "Product ID is required",
//         });
//       }

//       if (
//         !qrCode ||
//         !String(qrCode).trim()
//       ) {
//         return res.status(400).json({
//           success: false,

//           message:
//             "QR code is required",
//         });
//       }

//       // =================================================
//       // PROCESS PAYMENT
//       // =================================================

//       const result =
//         await payForQRProduct(
//           userId,
//           productId,
//           qrCode,
//           description
//         );

//       console.log(
//         "================================"
//       );

//       console.log(
//         "QR PAYMENT SUCCESS"
//       );

//       console.log(
//         "PRODUCT:",
//         result.product.name
//       );

//       console.log(
//         "PAID:",
//         result.paid_amount
//       );

//       console.log(
//         "PREVIOUS BALANCE:",
//         result.previous_balance
//       );

//       console.log(
//         "REMAINING BALANCE:",
//         result.remaining_balance
//       );

//       console.log(
//         "REWARD CLAIMED:",
//         result.reward_claimed
//       );

//       console.log(
//         "================================"
//       );

//       return res.status(200).json({
//         success: true,

//         message:
//           "QR payment successful",

//         data: {
//           success: true,

//           product:
//             result.product,

//           wallet:
//             result.wallet,

//           transaction:
//             result.transaction,

//           previous_balance:
//             result.previous_balance,

//           paid_amount:
//             result.paid_amount,

//           remaining_balance:
//             result.remaining_balance,

//           reward_claimed:
//             false,

//           reward:
//             result.qr
//               ?.reward_amount,

//           qr:
//             result.qr,
//         },
//       });
//     } catch (error) {
//       console.error(
//         "================================"
//       );

//       console.error(
//         "QR PAYMENT ERROR:",
//         error
//       );

//       console.error(
//         "MESSAGE:",
//         error.message
//       );

//       console.error(
//         "================================"
//       );

//       // =================================================
//       // CLIENT ERRORS
//       // =================================================

//       const clientErrors = [
//         "Invalid product ID",
//         "QR code is required",
//         "QR code not found",
//         "QR code does not belong to this product",
//         "QR code has already been claimed",
//         "This QR payment has already been completed",
//         "Wallet not found",
//         "Insufficient wallet balance",
//         "Invalid product price",
//       ];

//       if (
//         clientErrors.includes(
//           error.message
//         )
//       ) {
//         return res.status(400).json({
//           success: false,

//           message:
//             error.message,
//         });
//       }

//       // =================================================
//       // SERVER ERROR
//       // =================================================

//       return res.status(500).json({
//         success: false,

//         message:
//           error.message ||
//           "QR payment failed",
//       });
//     }
//   };

// // =====================================================
// // EXPORTS
// // =====================================================

// module.exports = {
//   getMyWallet,
//   addMoney,
//   getMyTransactions,
//   payWithWallet,
//   payForQRProductController,
// };
const {
  getOrCreateWallet,
  addMoneyToWallet,
  getWalletTransactions,
  payFromWallet,
  payForQRProduct,
  payForQRProductSplit,
} = require("../models/walletModel");

// =====================================================
// GET MY WALLET
// =====================================================

const getMyWallet = async (req, res) => {
  try {
    const userId = req.user.id;

    const wallet = await getOrCreateWallet(userId);

    return res.status(200).json({
      success: true,
      message: "Wallet fetched successfully",
      data: wallet,
    });
  } catch (error) {
    console.error("GET WALLET ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch wallet",
    });
  }
};

// =====================================================
// ADD MONEY
// DEVELOPMENT ONLY
// =====================================================

const addMoney = async (req, res) => {
  try {
    const userId = req.user.id;

    const { amount } = req.body;

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const result = await addMoneyToWallet(
      userId,
      numericAmount,
      "CREDIT",
      "Development wallet credit"
    );

    return res.status(200).json({
      success: true,
      message: "Money added to wallet successfully",
      data: result,
    });
  } catch (error) {
    console.error("ADD WALLET MONEY ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to add money",
    });
  }
};

// =====================================================
// GET TRANSACTIONS
// =====================================================

const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions =
      await getWalletTransactions(userId);

    return res.status(200).json({
      success: true,
      message:
        "Wallet transactions fetched successfully",
      data: transactions,
    });
  } catch (error) {
    console.error(
      "GET WALLET TRANSACTIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch wallet transactions",
    });
  }
};

// =====================================================
// GENERIC WALLET PAYMENT
// =====================================================

const payWithWallet = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      amount,
      description,
    } = req.body;

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid payment amount is required",
      });
    }

    const result = await payFromWallet(
      userId,
      numericAmount,
      description || "Wallet payment"
    );

    return res.status(200).json({
      success: true,
      message: "Payment successful",
      data: result,
    });
  } catch (error) {
    console.error(
      "WALLET PAYMENT ERROR:",
      error
    );

    if (
      error.message ===
      "Insufficient wallet balance"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Insufficient wallet balance",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Wallet payment failed",
    });
  }
};

// =====================================================
// PAY FOR QR PRODUCT - WALLET ONLY
// =====================================================

const payForQRProductController = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const {
      productId,
      qrCode,
      description,
    } = req.body;

    console.log(
      "================================"
    );

    console.log(
      "QR WALLET PAYMENT"
    );

    console.log(
      "USER ID:",
      userId
    );

    console.log(
      "PRODUCT ID:",
      productId
    );

    console.log(
      "QR CODE:",
      qrCode
    );

    console.log(
      "================================"
    );

    if (!productId) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID is required",
      });
    }

    if (
      !qrCode ||
      !String(qrCode).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "QR code is required",
      });
    }

    const result =
      await payForQRProduct(
        userId,
        productId,
        qrCode,
        description
      );

    console.log(
      "================================"
    );

    console.log(
      "QR PAYMENT SUCCESS"
    );

    console.log(
      "PRODUCT:",
      result.product.name
    );

    console.log(
      "PAID:",
      result.paid_amount
    );

    console.log(
      "PREVIOUS BALANCE:",
      result.previous_balance
    );

    console.log(
      "REMAINING BALANCE:",
      result.remaining_balance
    );

    console.log(
      "REWARD CLAIMED:",
      result.reward_claimed
    );

    console.log(
      "================================"
    );

    return res.status(200).json({
      success: true,

      message:
        "QR payment successful",

      data: {
        success: true,

        product:
          result.product,

        wallet:
          result.wallet,

        transaction:
          result.transaction,

        previous_balance:
          result.previous_balance,

        paid_amount:
          result.paid_amount,

        remaining_balance:
          result.remaining_balance,

        reward_claimed:
          false,

        reward:
          result.qr?.reward_amount,

        qr:
          result.qr,
      },
    });
  } catch (error) {
    console.error(
      "================================"
    );

    console.error(
      "QR PAYMENT ERROR:",
      error
    );

    console.error(
      "MESSAGE:",
      error.message
    );

    console.error(
      "================================"
    );

    const clientErrors = [
      "Invalid product ID",
      "QR code is required",
      "QR code not found",
      "QR code does not belong to this product",
      "QR code has already been claimed",
      "This QR payment has already been completed",
      "Wallet not found",
      "Insufficient wallet balance",
      "Invalid product price",
    ];

    if (
      clientErrors.includes(
        error.message
      )
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "QR payment failed",
    });
  }
};

// =====================================================
// PRACTICE QR SPLIT PAYMENT
// =====================================================
//
// Supports:
//
// WALLET
// UPI
// SPLIT
//
// Example:
//
// Product = ₹500
// Wallet = ₹300
// UPI = ₹200
//
// This is a PRACTICE payment.
// UPI success is simulated in walletModel.js.
//
// =====================================================

const payForQRProductSplitController =
  async (req, res) => {
    try {
      const userId = req.user.id;

      const {
        productId,
        qrCode,
        walletAmount,
        paymentMethod,
        description,
      } = req.body;

      console.log(
        "================================"
      );

      console.log(
        "PRACTICE QR PAYMENT"
      );

      console.log(
        "USER ID:",
        userId
      );

      console.log(
        "PRODUCT ID:",
        productId
      );

      console.log(
        "QR CODE:",
        qrCode
      );

      console.log(
        "WALLET AMOUNT:",
        walletAmount
      );

      console.log(
        "PAYMENT METHOD:",
        paymentMethod
      );

      console.log(
        "================================"
      );

      // =================================================
      // VALIDATE PRODUCT
      // =================================================

      if (!productId) {
        return res.status(400).json({
          success: false,
          message:
            "Product ID is required",
        });
      }

      // =================================================
      // VALIDATE QR
      // =================================================

      if (
        !qrCode ||
        !String(qrCode).trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "QR code is required",
        });
      }

      // =================================================
      // VALIDATE PAYMENT METHOD
      // =================================================

      const method = String(
        paymentMethod || "WALLET"
      )
        .trim()
        .toUpperCase();

      const allowedMethods = [
        "WALLET",
        "UPI",
        "SPLIT",
      ];

      if (
        !allowedMethods.includes(method)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment method",
        });
      }

      // =================================================
      // WALLET AMOUNT
      // =================================================

      const numericWalletAmount =
        Number(walletAmount || 0);

      if (
        !Number.isFinite(
          numericWalletAmount
        ) ||
        numericWalletAmount < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid wallet amount",
        });
      }

      // =================================================
      // PROCESS PAYMENT
      // =================================================

      const result =
        await payForQRProductSplit(
          userId,
          productId,
          qrCode,
          numericWalletAmount,
          method,
          description
        );

      // =================================================
      // SUCCESS LOGS
      // =================================================

      console.log(
        "================================"
      );

      console.log(
        "PRACTICE PAYMENT SUCCESS"
      );

      console.log(
        "PRODUCT:",
        result.product.name
      );

      console.log(
        "PRODUCT AMOUNT:",
        result.paid_amount
      );

      console.log(
        "WALLET PAID:",
        result.wallet_paid_amount
      );

      console.log(
        "UPI PAID:",
        result.upi_paid_amount
      );

      console.log(
        "PAYMENT METHOD:",
        result.payment.payment_method
      );

      console.log(
        "PAYMENT STATUS:",
        result.payment.payment_status
      );

      console.log(
        "REMAINING WALLET:",
        result.remaining_balance
      );

      console.log(
        "MOCK UPI ID:",
        result.payment.gateway_payment_id
      );

      console.log(
        "================================"
      );

      return res.status(200).json({
        success: true,

        message:
          "Practice payment successful",

        data: {
          success: true,

          product:
            result.product,

          payment:
            result.payment,

          wallet:
            result.wallet,

          transaction:
            result.transaction,

          previous_balance:
            result.previous_balance,

          paid_amount:
            result.paid_amount,

          wallet_paid_amount:
            result.wallet_paid_amount,

          upi_paid_amount:
            result.upi_paid_amount,

          remaining_balance:
            result.remaining_balance,

          reward_claimed:
            false,

          reward:
            result.qr?.reward_amount,

          qr:
            result.qr,
        },
      });
    } catch (error) {
      console.error(
        "================================"
      );

      console.error(
        "PRACTICE PAYMENT ERROR:"
      );

      console.error(
        error
      );

      console.error(
        "MESSAGE:",
        error.message
      );

      console.error(
        "================================"
      );

      const clientErrors = [
        "Invalid product ID",
        "QR code is required",
        "QR code not found",
        "QR code does not belong to this product",
        "QR code has already been claimed",
        "This QR payment has already been completed",
        "Wallet not found",
        "Insufficient wallet balance",
        "Invalid product price",
        "Invalid payment method",
        "Invalid wallet amount",
        "Wallet amount cannot exceed product amount",
        "Invalid wallet payment amount",
        "Invalid UPI payment amount",
        "Split payment requires wallet and UPI amounts",
      ];

      if (
        clientErrors.includes(
          error.message
        )
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Practice payment failed",
      });
    }
  };

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getMyWallet,
  addMoney,
  getMyTransactions,
  payWithWallet,
  payForQRProductController,
  payForQRProductSplitController,
};