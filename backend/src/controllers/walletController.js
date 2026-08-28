// const {
//   getOrCreateWallet,
//   addMoneyToWallet,
//   getWalletTransactions,
//   payFromWallet,
// } = require("../models/walletModel");

// // =====================================================
// // GET MY WALLET
// // =====================================================

// const getMyWallet = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const wallet =
//       await getOrCreateWallet(userId);

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

// const addMoney = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const { amount } = req.body;

//     const numericAmount = Number(amount);

//     if (
//       !Number.isFinite(numericAmount) ||
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
//     const userId = req.user.id;

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
// // PAY USING WALLET
// // =====================================================

// const payWithWallet = async (
//   req,
//   res
// ) => {
//   try {
//     const userId = req.user.id;

//     const {
//       amount,
//       description,
//     } = req.body;

//     const numericAmount =
//       Number(amount);

//     if (
//       !Number.isFinite(numericAmount) ||
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

// module.exports = {
//   getMyWallet,
//   addMoney,
//   getMyTransactions,
//   payWithWallet,
// };

const {
  getOrCreateWallet,
  addMoneyToWallet,
  getWalletTransactions,
  payFromWallet,
  payForQRProduct,
} = require("../models/walletModel");

// =====================================================
// GET MY WALLET
// =====================================================

const getMyWallet = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.id;

    const wallet =
      await getOrCreateWallet(
        userId
      );

    return res.status(200).json({
      success: true,

      message:
        "Wallet fetched successfully",

      data: wallet,
    });
  } catch (error) {
    console.error(
      "GET WALLET ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch wallet",
    });
  }
};

// =====================================================
// ADD MONEY
// DEVELOPMENT ONLY
// =====================================================

const addMoney = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.id;

    const { amount } =
      req.body;

    const numericAmount =
      Number(amount);

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Valid amount is required",
      });
    }

    const result =
      await addMoneyToWallet(
        userId,
        numericAmount,
        "CREDIT",
        "Development wallet credit"
      );

    return res.status(200).json({
      success: true,

      message:
        "Money added to wallet successfully",

      data: result,
    });
  } catch (error) {
    console.error(
      "ADD WALLET MONEY ERROR:",
      error
    );

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

const getMyTransactions = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.id;

    const transactions =
      await getWalletTransactions(
        userId
      );

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

const payWithWallet = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.id;

    const {
      amount,
      description,
    } = req.body;

    const numericAmount =
      Number(amount);

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Valid payment amount is required",
      });
    }

    const result =
      await payFromWallet(
        userId,
        numericAmount,
        description ||
          "Wallet payment"
      );

    return res.status(200).json({
      success: true,

      message:
        "Payment successful",

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
// PAY FOR QR PRODUCT
// =====================================================

const payForQRProductController =
  async (
    req,
    res
  ) => {
    try {
      const userId =
        req.user.id;

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

      // =================================================
      // VALIDATION
      // =================================================

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

      // =================================================
      // PROCESS PAYMENT
      // =================================================

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
            result.qr
              ?.reward_amount,

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

      // =================================================
      // CLIENT ERRORS
      // =================================================

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

          message:
            error.message,
        });
      }

      // =================================================
      // SERVER ERROR
      // =================================================

      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "QR payment failed",
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
};