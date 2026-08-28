// const pool = require("../config/db");

// // =====================================================
// // GET OR CREATE WALLET
// // =====================================================

// const getOrCreateWallet = async (userId) => {
//   const result = await pool.query(
//     `
//     SELECT *
//     FROM wallets
//     WHERE user_id = $1
//     LIMIT 1
//     `,
//     [userId]
//   );

//   if (result.rows.length > 0) {
//     return result.rows[0];
//   }

//   const createResult = await pool.query(
//     `
//     INSERT INTO wallets
//     (
//       user_id,
//       balance
//     )
//     VALUES
//     ($1, 0)
//     RETURNING *
//     `,
//     [userId]
//   );

//   return createResult.rows[0];
// };

// // =====================================================
// // GET WALLET BY USER ID
// // =====================================================

// const getWalletByUserId = async (userId) => {
//   const result = await pool.query(
//     `
//     SELECT *
//     FROM wallets
//     WHERE user_id = $1
//     LIMIT 1
//     `,
//     [userId]
//   );

//   return result.rows[0];
// };

// // =====================================================
// // ADD MONEY TO WALLET
// // =====================================================

// const addMoneyToWallet = async (
//   userId,
//   amount,
//   transactionType = "CREDIT",
//   description = "Wallet credited"
// ) => {
//   const client = await pool.connect();

//   try {
//     await client.query("BEGIN");

//     let walletResult = await client.query(
//       `
//       SELECT *
//       FROM wallets
//       WHERE user_id = $1
//       FOR UPDATE
//       `,
//       [userId]
//     );

//     let wallet;

//     if (walletResult.rows.length === 0) {
//       const createResult = await client.query(
//         `
//         INSERT INTO wallets
//         (
//           user_id,
//           balance
//         )
//         VALUES
//         ($1, 0)
//         RETURNING *
//         `,
//         [userId]
//       );

//       wallet = createResult.rows[0];
//     } else {
//       wallet = walletResult.rows[0];
//     }

//     const numericAmount = Number(amount);

//     if (
//       !Number.isFinite(numericAmount) ||
//       numericAmount <= 0
//     ) {
//       throw new Error("Invalid wallet amount");
//     }

//     // CREDIT
//     const updateResult = await client.query(
//       `
//       UPDATE wallets
//       SET
//         balance = balance + $1,
//         updated_at = CURRENT_TIMESTAMP
//       WHERE id = $2
//       RETURNING *
//       `,
//       [
//         numericAmount,
//         wallet.id,
//       ]
//     );

//     const updatedWallet = updateResult.rows[0];

//     const balanceAfter = Number(
//       updatedWallet.balance
//     );

//     const transactionResult = await client.query(
//       `
//       INSERT INTO wallet_transactions
//       (
//         wallet_id,
//         user_id,
//         amount,
//         transaction_type,
//         description,
//         balance_after
//       )
//       VALUES
//       ($1, $2, $3, $4, $5, $6)
//       RETURNING *
//       `,
//       [
//         wallet.id,
//         userId,
//         numericAmount,
//         transactionType,
//         description,
//         balanceAfter,
//       ]
//     );

//     await client.query("COMMIT");

//     return {
//       wallet: updatedWallet,
//       transaction: transactionResult.rows[0],
//     };

//   } catch (error) {
//     await client.query("ROLLBACK");
//     throw error;
//   } finally {
//     client.release();
//   }
// };
// // =====================================================
// // GET WALLET TRANSACTIONS
// // =====================================================
// const getWalletTransactions = async (
//   userId
// ) => {
//   const result = await pool.query(
//     `
//     SELECT
//       wt.id,
//       wt.wallet_id,
//       wt.user_id,
//       wt.amount,
//       wt.transaction_type,
//       wt.description,
//       wt.created_at,
//       wt.balance_after
//     FROM wallet_transactions wt

//     WHERE wt.user_id = $1

//     ORDER BY wt.created_at DESC
//     `,
//     [userId]
//   );

//   return result.rows;
// };
// // =====================================================
// // PAY USING WALLET
// // =====================================================


// const payFromWallet = async (
//   userId,
//   amount,
//   description = "Wallet payment"
// ) => {
//   const client = await pool.connect();

//   try {
//     await client.query("BEGIN");

//     const paymentAmount = Number(amount);

//     if (
//       !Number.isFinite(paymentAmount) ||
//       paymentAmount <= 0
//     ) {
//       throw new Error(
//         "Invalid payment amount"
//       );
//     }

//     const walletResult = await client.query(
//       `
//       SELECT *
//       FROM wallets
//       WHERE user_id = $1
//       FOR UPDATE
//       `,
//       [userId]
//     );

//     if (walletResult.rows.length === 0) {
//       throw new Error("Wallet not found");
//     }

//     const wallet = walletResult.rows[0];

//     const currentBalance = Number(
//       wallet.balance
//     );

//     if (currentBalance < paymentAmount) {
//       throw new Error(
//         "Insufficient wallet balance"
//       );
//     }

//     const updateResult = await client.query(
//       `
//       UPDATE wallets
//       SET
//         balance = balance - $1,
//         updated_at = CURRENT_TIMESTAMP
//       WHERE id = $2
//       RETURNING *
//       `,
//       [
//         paymentAmount,
//         wallet.id,
//       ]
//     );

//     const updatedWallet =
//       updateResult.rows[0];

//     const balanceAfter = Number(
//       updatedWallet.balance
//     );

//     const transactionResult =
//       await client.query(
//         `
//         INSERT INTO wallet_transactions
//         (
//           wallet_id,
//           user_id,
//           amount,
//           transaction_type,
//           description,
//           balance_after
//         )
//         VALUES
//         ($1, $2, $3, 'DEBIT', $4, $5)
//         RETURNING *
//         `,
//         [
//           wallet.id,
//           userId,
//           paymentAmount,
//           description,
//           balanceAfter,
//         ]
//       );

//     await client.query("COMMIT");

//     return {
//       wallet: updatedWallet,

//       transaction:
//         transactionResult.rows[0],

//       previous_balance:
//         currentBalance,

//       paid_amount:
//         paymentAmount,

//       remaining_balance:
//         balanceAfter,
//     };

//   } catch (error) {
//     await client.query("ROLLBACK");
//     throw error;
//   } finally {
//     client.release();
//   }
// };
// module.exports = {
//   getOrCreateWallet,
//   getWalletByUserId,
//   addMoneyToWallet,
//   getWalletTransactions,
//   payFromWallet,
// };

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
// EXPORTS
// =====================================================

module.exports = {
  getOrCreateWallet,
  getWalletByUserId,
  addMoneyToWallet,
  getWalletTransactions,
  payFromWallet,
  payForQRProduct,
};