const pool = require("../config/db");

// =====================================================
// GET OR CREATE WALLET
// =====================================================

const getOrCreateWallet = async (userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM wallets
    WHERE user_id = $1
    LIMIT 1
    `,
    [userId]
  );

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  const createResult = await pool.query(
    `
    INSERT INTO wallets
    (
      user_id,
      balance
    )
    VALUES
    ($1, 0)
    RETURNING *
    `,
    [userId]
  );

  return createResult.rows[0];
};

// =====================================================
// GET WALLET BY USER ID
// =====================================================

const getWalletByUserId = async (userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM wallets
    WHERE user_id = $1
    LIMIT 1
    `,
    [userId]
  );

  return result.rows[0];
};

// =====================================================
// ADD MONEY TO WALLET
// DEVELOPMENT ONLY
// =====================================================

const addMoneyToWallet = async (
  userId,
  amount,
  transactionType = "CREDIT",
  description = "Wallet credited"
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      throw new Error("Invalid wallet amount");
    }

    let walletResult = await client.query(
      `
      SELECT *
      FROM wallets
      WHERE user_id = $1
      FOR UPDATE
      `,
      [userId]
    );

    let wallet;

    if (walletResult.rows.length === 0) {
      const createResult = await client.query(
        `
        INSERT INTO wallets
        (
          user_id,
          balance
        )
        VALUES
        ($1, 0)
        RETURNING *
        `,
        [userId]
      );

      wallet = createResult.rows[0];
    } else {
      wallet = walletResult.rows[0];
    }

    // =================================================
    // CREDIT WALLET
    // =================================================

    const updateResult = await client.query(
      `
      UPDATE wallets
      SET
        balance = balance + $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [
        numericAmount,
        wallet.id,
      ]
    );

    const updatedWallet =
      updateResult.rows[0];

    const balanceAfter =
      Number(updatedWallet.balance);

    // =================================================
    // TRANSACTION
    // =================================================

    const transactionResult =
      await client.query(
        `
        INSERT INTO wallet_transactions
        (
          wallet_id,
          user_id,
          amount,
          transaction_type,
          description,
          balance_after
        )
        VALUES
        ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [
          wallet.id,
          userId,
          numericAmount,
          transactionType,
          description,
          balanceAfter,
        ]
      );

    await client.query("COMMIT");

    return {
      wallet: updatedWallet,
      transaction:
        transactionResult.rows[0],
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// =====================================================
// GET WALLET TRANSACTIONS
// =====================================================

const getWalletTransactions = async (
  userId
) => {
  const result = await pool.query(
    `
    SELECT
      wt.id,
      wt.wallet_id,
      wt.user_id,
      wt.amount,
      wt.transaction_type,
      wt.description,
      wt.created_at,
      wt.balance_after
    FROM wallet_transactions wt
    WHERE wt.user_id = $1
    ORDER BY wt.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

// =====================================================
// GENERIC WALLET PAYMENT
// =====================================================

const payFromWallet = async (
  userId,
  amount,
  description = "Wallet payment"
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const paymentAmount = Number(amount);

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      throw new Error(
        "Invalid payment amount"
      );
    }

    const walletResult = await client.query(
      `
      SELECT *
      FROM wallets
      WHERE user_id = $1
      FOR UPDATE
      `,
      [userId]
    );

    if (walletResult.rows.length === 0) {
      throw new Error(
        "Wallet not found"
      );
    }

    const wallet =
      walletResult.rows[0];

    const currentBalance =
      Number(wallet.balance);

    if (
      currentBalance <
      paymentAmount
    ) {
      throw new Error(
        "Insufficient wallet balance"
      );
    }

    const updateResult =
      await client.query(
        `
        UPDATE wallets
        SET
          balance = balance - $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
        `,
        [
          paymentAmount,
          wallet.id,
        ]
      );

    const updatedWallet =
      updateResult.rows[0];

    const balanceAfter =
      Number(updatedWallet.balance);

    const transactionResult =
      await client.query(
        `
        INSERT INTO wallet_transactions
        (
          wallet_id,
          user_id,
          amount,
          transaction_type,
          description,
          balance_after
        )
        VALUES
        ($1, $2, $3, 'DEBIT', $4, $5)
        RETURNING *
        `,
        [
          wallet.id,
          userId,
          paymentAmount,
          description,
          balanceAfter,
        ]
      );

    await client.query("COMMIT");

    return {
      wallet: updatedWallet,

      transaction:
        transactionResult.rows[0],

      previous_balance:
        currentBalance,

      paid_amount:
        paymentAmount,

      remaining_balance:
        balanceAfter,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// =====================================================
// QR PAYMENT USING WALLET
// =====================================================
//
// IMPORTANT:
//
// This function:
// - validates QR
// - validates product
// - validates price from DB
// - checks QR is not claimed
// - checks QR hasn't already been paid
// - debits wallet
// - creates wallet transaction
// - DOES NOT claim QR reward
//
// =====================================================

const payForQRProduct = async (
  userId,
  productId,
  qrCode,
  description
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // =================================================
    // VALIDATE PRODUCT ID
    // =================================================

    const numericProductId =
      Number(productId);

    if (
      !Number.isInteger(
        numericProductId
      ) ||
      numericProductId <= 0
    ) {
      throw new Error(
        "Invalid product ID"
      );
    }

    // =================================================
    // VALIDATE QR CODE
    // =================================================

    if (
      !qrCode ||
      !String(qrCode).trim()
    ) {
      throw new Error(
        "QR code is required"
      );
    }

    const cleanQrCode =
      String(qrCode).trim();

    // =================================================
    // GET QR + PRODUCT
    //
    // IMPORTANT:
    // FOR UPDATE locks this QR row.
    // =================================================

    const qrResult =
      await client.query(
        `
        SELECT
          pqr.*,

          p.id AS product_id,
          p.name AS product_name,
          p.description AS product_description,
          p.price AS product_price,
          p.image AS product_image,
          p.stock AS product_stock,

          c.id AS category_id,
          c.name AS category_name

        FROM product_qr_codes pqr

        INNER JOIN products p
          ON p.id = pqr.product_id

        LEFT JOIN categories c
          ON c.id = p.category_id

        WHERE
          pqr.qr_code = $1

        FOR UPDATE OF pqr
        `,
        [cleanQrCode]
      );

    if (qrResult.rows.length === 0) {
      throw new Error(
        "QR code not found"
      );
    }

    const qr =
      qrResult.rows[0];

    // =================================================
    // VERIFY PRODUCT
    // =================================================

    if (
      Number(qr.product_id) !==
      numericProductId
    ) {
      throw new Error(
        "QR code does not belong to this product"
      );
    }

    // =================================================
    // CHECK QR CLAIM STATUS
    // =================================================

    if (qr.is_claimed) {
      throw new Error(
        "QR code has already been claimed"
      );
    }

    // =================================================
    // GET PRODUCT PRICE FROM DATABASE
    //
    // DO NOT TRUST FRONTEND PRICE
    // =================================================

    const productPrice =
      Number(qr.product_price);

    if (
      !Number.isFinite(
        productPrice
      ) ||
      productPrice <= 0
    ) {
      throw new Error(
        "Invalid product price"
      );
    }

    // =================================================
    // CHECK WHETHER THIS QR WAS ALREADY PAID
    //
    // We search wallet transactions using the
    // QR code stored inside description.
    //
    // =================================================

    const existingPayment =
      await client.query(
        `
        SELECT id
        FROM wallet_transactions
        WHERE
          user_id = $1
          AND transaction_type = 'DEBIT'
          AND description LIKE $2
        LIMIT 1
        `,
        [
          userId,
          `%QR payment - ${cleanQrCode}%`,
        ]
      );

    if (
      existingPayment.rows.length >
      0
    ) {
      throw new Error(
        "This QR payment has already been completed"
      );
    }

    // =================================================
    // GET USER WALLET
    // =================================================

    const walletResult =
      await client.query(
        `
        SELECT *
        FROM wallets
        WHERE user_id = $1
        FOR UPDATE
        `,
        [userId]
      );

    if (walletResult.rows.length === 0) {
      throw new Error(
        "Wallet not found"
      );
    }

    const wallet =
      walletResult.rows[0];

    const currentBalance =
      Number(wallet.balance);

    // =================================================
    // CHECK BALANCE
    // =================================================

    if (
      currentBalance <
      productPrice
    ) {
      throw new Error(
        "Insufficient wallet balance"
      );
    }

    // =================================================
    // DEBIT WALLET
    // =================================================

    const walletUpdateResult =
      await client.query(
        `
        UPDATE wallets
        SET
          balance =
            balance - $1,
          updated_at =
            CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
        `,
        [
          productPrice,
          wallet.id,
        ]
      );

    const updatedWallet =
      walletUpdateResult.rows[0];

    const balanceAfter =
      Number(
        updatedWallet.balance
      );

    // =================================================
    // CREATE WALLET TRANSACTION
    // =================================================

    const transactionDescription =
      `QR payment - ${cleanQrCode}`;

    const transactionResult =
      await client.query(
        `
        INSERT INTO wallet_transactions
        (
          wallet_id,
          user_id,
          amount,
          transaction_type,
          description,
          balance_after
        )
        VALUES
        (
          $1,
          $2,
          $3,
          'DEBIT',
          $4,
          $5
        )
        RETURNING *
        `,
        [
          wallet.id,
          userId,
          productPrice,
          transactionDescription,
          balanceAfter,
        ]
      );

    // =================================================
    // COMMIT
    // =================================================

    await client.query("COMMIT");

    return {
      wallet:
        updatedWallet,

      transaction:
        transactionResult.rows[0],

      previous_balance:
        currentBalance,

      paid_amount:
        productPrice,

      remaining_balance:
        balanceAfter,

      product: {
        id:
          Number(qr.product_id),

        name:
          qr.product_name,

        price:
          productPrice,

        description:
          qr.product_description,

        image:
          qr.product_image,

        stock:
          qr.product_stock,

        category_name:
          qr.category_name,
      },

      qr: {
        id:
          qr.id,

        qr_code:
          qr.qr_code,

        is_claimed:
          qr.is_claimed,

        reward_amount:
          qr.reward_amount,
      },

      reward_claimed:
        false,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
// =====================================================
// PRACTICE QR SPLIT PAYMENT
// =====================================================
//
// Supports:
//
// 1. WALLET
//    Product ₹500
//    Wallet ₹500
//    UPI ₹0
//
// 2. UPI
//    Product ₹500
//    Wallet ₹0
//    UPI ₹500
//
// 3. SPLIT
//    Product ₹500
//    Wallet ₹300
//    UPI ₹200
//
// IMPORTANT:
// This is a PRACTICE payment flow.
// UPI success is simulated.
// No real payment gateway is used.
//
// =====================================================

const payForQRProductSplit = async (
  userId,
  productId,
  qrCode,
  walletAmount,
  paymentMethod = "WALLET",
  description
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // =================================================
    // VALIDATE PRODUCT ID
    // =================================================

    const numericProductId = Number(productId);

    if (
      !Number.isInteger(numericProductId) ||
      numericProductId <= 0
    ) {
      throw new Error("Invalid product ID");
    }

    // =================================================
    // VALIDATE QR CODE
    // =================================================

    if (
      !qrCode ||
      !String(qrCode).trim()
    ) {
      throw new Error("QR code is required");
    }

    const cleanQrCode = String(qrCode).trim();

    // =================================================
    // NORMALIZE PAYMENT METHOD
    // =================================================

    const method = String(paymentMethod)
      .trim()
      .toUpperCase();

    const allowedMethods = [
      "WALLET",
      "UPI",
      "SPLIT",
    ];

    if (!allowedMethods.includes(method)) {
      throw new Error("Invalid payment method");
    }

    // =================================================
    // GET QR + PRODUCT
    // =================================================

    const qrResult = await client.query(
      `
      SELECT
        pqr.*,

        p.id AS product_id,
        p.name AS product_name,
        p.description AS product_description,
        p.price AS product_price,
        p.image AS product_image,
        p.stock AS product_stock,

        c.id AS category_id,
        c.name AS category_name

      FROM product_qr_codes pqr

      INNER JOIN products p
        ON p.id = pqr.product_id

      LEFT JOIN categories c
        ON c.id = p.category_id

      WHERE pqr.qr_code = $1

      FOR UPDATE OF pqr
      `,
      [cleanQrCode]
    );

    if (qrResult.rows.length === 0) {
      throw new Error("QR code not found");
    }

    const qr = qrResult.rows[0];

    // =================================================
    // VERIFY PRODUCT
    // =================================================

    if (
      Number(qr.product_id) !==
      numericProductId
    ) {
      throw new Error(
        "QR code does not belong to this product"
      );
    }

    // =================================================
    // CHECK REWARD CLAIM
    //
    // This is kept because your current system
    // doesn't allow payment after reward claim.
    // =================================================

    if (qr.is_claimed) {
      throw new Error(
        "QR code has already been claimed"
      );
    }

    // =================================================
    // PRODUCT PRICE FROM DATABASE
    // =================================================

    const productPrice =
      Number(qr.product_price);

    if (
      !Number.isFinite(productPrice) ||
      productPrice <= 0
    ) {
      throw new Error(
        "Invalid product price"
      );
    }

    // =================================================
    // CHECK EXISTING SUCCESSFUL PAYMENT
    // =================================================

    const existingPayment =
      await client.query(
        `
        SELECT id
        FROM qr_product_payments
        WHERE
          user_id = $1
          AND qr_code = $2
          AND payment_status = 'SUCCESS'
        LIMIT 1
        `,
        [
          userId,
          cleanQrCode,
        ]
      );

    if (existingPayment.rows.length > 0) {
      throw new Error(
        "This QR payment has already been completed"
      );
    }

    // =================================================
    // CALCULATE WALLET + UPI AMOUNTS
    // =================================================

    let requestedWalletAmount =
      Number(walletAmount);

    if (
      !Number.isFinite(
        requestedWalletAmount
      )
    ) {
      requestedWalletAmount = 0;
    }

    // Never allow negative wallet amount
    requestedWalletAmount =
      Math.max(
        requestedWalletAmount,
        0
      );

    // =================================================
    // PAYMENT METHOD RULES
    // =================================================

    if (method === "WALLET") {
      requestedWalletAmount =
        productPrice;
    }

    if (method === "UPI") {
      requestedWalletAmount = 0;
    }

    // Wallet cannot exceed product price
    if (
      requestedWalletAmount >
      productPrice
    ) {
      throw new Error(
        "Wallet amount cannot exceed product amount"
      );
    }

    // Round to 2 decimal places
    requestedWalletAmount =
      Math.round(
        requestedWalletAmount * 100
      ) / 100;

    const upiAmount =
      Math.round(
        (productPrice -
          requestedWalletAmount) *
          100
      ) / 100;

    // =================================================
    // VALIDATE PAYMENT METHOD + AMOUNTS
    // =================================================

    if (
      method === "WALLET" &&
      upiAmount !== 0
    ) {
      throw new Error(
        "Invalid wallet payment amount"
      );
    }

    if (
      method === "UPI" &&
      requestedWalletAmount !== 0
    ) {
      throw new Error(
        "Invalid UPI payment amount"
      );
    }

    if (
      method === "SPLIT" &&
      (
        requestedWalletAmount <= 0 ||
        upiAmount <= 0
      )
    ) {
      throw new Error(
        "Split payment requires wallet and UPI amounts"
      );
    }

    // =================================================
    // GET USER WALLET
    // =================================================

    const walletResult =
      await client.query(
        `
        SELECT *
        FROM wallets
        WHERE user_id = $1
        FOR UPDATE
        `,
        [userId]
      );

    if (walletResult.rows.length === 0) {
      throw new Error(
        "Wallet not found"
      );
    }

    const wallet =
      walletResult.rows[0];

    const currentBalance =
      Number(wallet.balance);

    // =================================================
    // CHECK WALLET BALANCE
    // =================================================

    if (
      requestedWalletAmount >
      currentBalance
    ) {
      throw new Error(
        "Insufficient wallet balance"
      );
    }

    // =================================================
    // PRACTICE UPI PAYMENT
    // =================================================
    //
    // Since this is a practice project:
    //
    // UPI is considered SUCCESS here.
    //
    // Later this section will be replaced
    // with Razorpay/PhonePe/etc verification.
    //
    // =================================================

    const mockUpiPaymentId =
      upiAmount > 0
        ? `MOCK_UPI_${Date.now()}`
        : null;

    // =================================================
    // DEBIT WALLET
    // =================================================

    let updatedWallet = wallet;
    let walletTransaction = null;
    let balanceAfter = currentBalance;

    if (requestedWalletAmount > 0) {
      const walletUpdateResult =
        await client.query(
          `
          UPDATE wallets
          SET
            balance =
              balance - $1,
            updated_at =
              CURRENT_TIMESTAMP
          WHERE id = $2
          RETURNING *
          `,
          [
            requestedWalletAmount,
            wallet.id,
          ]
        );

      updatedWallet =
        walletUpdateResult.rows[0];

      balanceAfter =
        Number(
          updatedWallet.balance
        );

      // =================================================
      // WALLET TRANSACTION
      // =================================================

      const transactionDescription =
        method === "SPLIT"
          ? `QR split payment - ${cleanQrCode}`
          : `QR payment - ${cleanQrCode}`;

      const transactionResult =
        await client.query(
          `
          INSERT INTO wallet_transactions
          (
            wallet_id,
            user_id,
            amount,
            transaction_type,
            description,
            balance_after
          )
          VALUES
          (
            $1,
            $2,
            $3,
            'DEBIT',
            $4,
            $5
          )
          RETURNING *
          `,
          [
            wallet.id,
            userId,
            requestedWalletAmount,
            transactionDescription,
            balanceAfter,
          ]
        );

      walletTransaction =
        transactionResult.rows[0];
    }

    // =================================================
    // CREATE PAYMENT RECORD
    // =================================================

    const paymentResult =
      await client.query(
        `
        INSERT INTO qr_product_payments
        (
          user_id,
          product_id,
          qr_code,
          product_amount,
          wallet_amount,
          upi_amount,
          payment_method,
          payment_status,
          gateway_payment_id,
          gateway_order_id,
          created_at,
          updated_at
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          'SUCCESS',
          $8,
          $9,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
        RETURNING *
        `,
        [
          userId,
          numericProductId,
          cleanQrCode,
          productPrice,
          requestedWalletAmount,
          upiAmount,
          method,
          mockUpiPaymentId,
          null,
        ]
      );

    const payment =
      paymentResult.rows[0];

    // =================================================
    // COMMIT
    // =================================================

    await client.query("COMMIT");

    return {
      success: true,

      product: {
        id:
          Number(qr.product_id),

        name:
          qr.product_name,

        price:
          productPrice,

        description:
          qr.product_description,

        image:
          qr.product_image,

        stock:
          qr.product_stock,

        category_name:
          qr.category_name,
      },

      payment: {
        id:
          payment.id,

        product_amount:
          Number(payment.product_amount),

        wallet_amount:
          Number(payment.wallet_amount),

        upi_amount:
          Number(payment.upi_amount),

        payment_method:
          payment.payment_method,

        payment_status:
          payment.payment_status,

        gateway_payment_id:
          payment.gateway_payment_id,
      },

      wallet: updatedWallet,

      transaction:
        walletTransaction,

      previous_balance:
        currentBalance,

      paid_amount:
        productPrice,

      wallet_paid_amount:
        requestedWalletAmount,

      upi_paid_amount:
        upiAmount,

      remaining_balance:
        balanceAfter,

      qr: {
        id:
          qr.id,

        qr_code:
          qr.qr_code,

        is_claimed:
          qr.is_claimed,

        reward_amount:
          qr.reward_amount,
      },

      reward_claimed:
        false,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getOrCreateWallet,
  getWalletByUserId,
  addMoneyToWallet,
  getWalletTransactions,
  payFromWallet,
  payForQRProduct,
   payForQRProductSplit,
};