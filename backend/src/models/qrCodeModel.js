
const crypto = require("crypto");
const pool = require("../config/db");

const WINNING_PERCENTAGE = 0.8;

const REWARD_VALUES = [
  1,
  2,
  3,
  5,
  7,
  8,
  10,
  15,
];

const shuffleArray = (array) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled;
};

const generateRewardPattern = (quantity) => {
  const winningCount = Math.floor(
    quantity * WINNING_PERCENTAGE
  );

  const noGiftCount = quantity - winningCount;

  const rewards = [];

  // Generate winning QR rewards
  for (let i = 0; i < winningCount; i++) {
    const randomIndex = Math.floor(
      Math.random() * REWARD_VALUES.length
    );

    rewards.push(REWARD_VALUES[randomIndex]);
  }

  // Generate Better Luck Next Time QR codes
  for (let i = 0; i < noGiftCount; i++) {
    rewards.push(0);
  }

  // Randomly mix winning and non-winning QR codes
  return shuffleArray(rewards);
};

// =====================================================
// NORMALIZE ADMIN-DEFINED REWARD TIERS
//
// Accepts an array like:
// [{ amount: 1, quantity: 10 }, { amount: 2, quantity: 5 }]
//
// Returns a cleaned array of { amount, quantity } with
// invalid rows removed, or null when nothing usable
// was provided (caller should fall back to the legacy
// random pattern in that case).
// =====================================================

const normalizeRewardTiers = (rewardTiers) => {
  if (!Array.isArray(rewardTiers)) {
    return null;
  }

  const cleaned = rewardTiers
    .map((tier) => ({
      amount: Number(tier?.amount),
      quantity: Number(tier?.quantity),
    }))
    .filter(
      (tier) =>
        Number.isFinite(tier.amount) &&
        tier.amount >= 0 &&
        Number.isInteger(tier.quantity) &&
        tier.quantity > 0
    );

  return cleaned.length > 0 ? cleaned : null;
};

// =====================================================
// BUILD REWARD LIST FROM ADMIN-DEFINED TIERS
//
// Expands each tier into `quantity` copies of `amount`,
// pads/truncates to match the exact number of QR codes
// being generated, and shuffles so reward amounts are
// randomly distributed across the physical units.
// =====================================================

const buildRewardsFromTiers = (
  rewardTiers,
  quantity
) => {
  const rewards = [];

  rewardTiers.forEach((tier) => {
    for (let i = 0; i < tier.quantity; i++) {
      rewards.push(tier.amount);
    }
  });

  // Tiers did not add up to the full quantity requested -
  // treat the remaining units as "no gift" (0).
  while (rewards.length < quantity) {
    rewards.push(0);
  }

  // Tiers added up to more than the quantity requested -
  // only take as many as are actually needed.
  rewards.length = quantity;

  return shuffleArray(rewards);
};

const generateQRToken = () => {
  return `VA-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
};

const createProductQRCodes = async (
  productId,
  requestedStock = null,
  rewardTiers = null
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check whether product exists
    const productResult = await client.query(
      `
      SELECT id, name, stock
      FROM products
      WHERE id = $1
      `,
      [productId]
    );

    if (productResult.rows.length === 0) {
      throw new Error("Product not found");
    }

    const product = productResult.rows[0];

    // Use requested stock if provided; otherwise use product stock
    const quantity =
      requestedStock !== null
        ? Number(requestedStock)
        : Number(product.stock);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(
        "Stock quantity must be a positive integer"
      );
    }

    // Count already existing QR codes
    const existingResult = await client.query(
      `
      SELECT COUNT(*)::int AS count
      FROM product_qr_codes
      WHERE product_id = $1
      `,
      [productId]
    );

    const existingCount = existingResult.rows[0].count;

    // Calculate how many new QR codes are required
    const missingCount = Math.max(
      quantity - existingCount,
      0
    );

    if (missingCount === 0) {
      await client.query("COMMIT");

      return {
        success: true,
        message: "QR codes already exist for the requested stock",
        productId,
        quantity,
        existingCount,
        createdCount: 0,
      };
    }

    // Find the last generated unit number
    const lastUnitResult = await client.query(
      `
      SELECT COALESCE(MAX(unit_number), 0)::int AS last_unit
      FROM product_qr_codes
      WHERE product_id = $1
      `,
      [productId]
    );

    const lastUnitNumber =
      lastUnitResult.rows[0].last_unit;

    // Generate rewards for the missing QR codes.
    //
    // If the admin defined explicit reward tiers
    // (e.g. ₹1 x 10, ₹2 x 5), use those. Otherwise fall
    // back to the legacy random reward pattern so older
    // flows (like "Generate All QR") keep working.
    const normalizedTiers =
      normalizeRewardTiers(rewardTiers);

    const rewards = normalizedTiers
      ? buildRewardsFromTiers(
          normalizedTiers,
          missingCount
        )
      : generateRewardPattern(missingCount);

    let createdCount = 0;

    for (let i = 0; i < missingCount; i++) {
      const unitNumber = lastUnitNumber + i + 1;
      const rewardAmount = rewards[i];

      const qrCode = generateQRToken();

      await client.query(
        `
        INSERT INTO product_qr_codes
        (
          product_id,
          qr_code,
          unit_number,
          reward_amount,
          is_claimed
        )
        VALUES ($1, $2, $3, $4, false)
        `,
        [
          productId,
          qrCode,
          unitNumber,
          rewardAmount,
        ]
      );

      createdCount++;
    }

    await client.query("COMMIT");

    console.log(
      `Created ${createdCount} QR codes for product ${productId}`
    );

    return {
      success: true,
      message: "QR codes generated successfully",
      productId,
      quantity,
      existingCount,
      createdCount,
    };
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Error creating product QR codes:",
      error.message
    );

    throw error;
  } finally {
    client.release();
  }
};

const createAllProductQRCodes = async () => {
  const client = await pool.connect();

  try {
    const productsResult = await client.query(
      `
      SELECT id, stock
      FROM products
      WHERE stock > 0
      `
    );

    const results = [];

    for (const product of productsResult.rows) {
      try {
        const result = await createProductQRCodes(
          product.id,
          product.stock
        );

        results.push(result);
      } catch (error) {
        results.push({
          productId: product.id,
          success: false,
          error: error.message,
        });
      }
    }

    return {
      success: true,
      results,
    };
  } finally {
    client.release();
  }
};

const getQRCodesByProductId = async (productId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      product_id,
      qr_code,
      unit_number,
      reward_amount,
      is_claimed,
      claimed_by,
      claimed_at,
      created_at
    FROM product_qr_codes
    WHERE product_id = $1
    ORDER BY unit_number ASC
    `,
    [productId]
  );

  return result.rows;
};

const getQRByCode = async (qrCode) => {
  const result = await pool.query(
    `
    SELECT
      qr.id,
      qr.product_id,
      qr.qr_code,
      qr.unit_number,
      qr.reward_amount,
      qr.is_claimed,
      qr.claimed_by,
      qr.claimed_at,
      qr.created_at,

      p.name AS product_name,
      p.price AS product_price,
      p.image AS product_image,
      p.bg_color AS product_bg_color,

      u.name AS claimed_by_name,
      u.email AS claimed_by_email

    FROM product_qr_codes qr

    JOIN products p
      ON p.id = qr.product_id

    LEFT JOIN users u
      ON u.id = qr.claimed_by

    WHERE TRIM(qr.qr_code) = $1
    `,
    [qrCode]
  );

  return result.rows[0] || null;
};

const claimQRCodeAndReward = async (qrCode, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const normalizedQR = String(qrCode || "").trim();
    const numericUserId = Number(userId);

    if (!normalizedQR) {
      throw new Error("QR code is required");
    }

    if (
      !Number.isInteger(numericUserId) ||
      numericUserId <= 0
    ) {
      throw new Error("Invalid user ID");
    }

    // Find QR code and lock it
    const qrResult = await client.query(
      `
      SELECT *
      FROM product_qr_codes
      WHERE TRIM(qr_code) = $1
      FOR UPDATE
      `,
      [normalizedQR]
    );

    if (qrResult.rows.length === 0) {
      throw new Error("QR code not found");
    }

    const qr = qrResult.rows[0];

    // Prevent claiming the same QR twice
    if (qr.is_claimed) {
      throw new Error("QR code already claimed");
    }

    const rewardAmount = Number(qr.reward_amount || 0);

    // Get or create wallet
    let walletResult = await client.query(
      `
      SELECT *
      FROM wallets
      WHERE user_id = $1
      FOR UPDATE
      `,
      [numericUserId]
    );

    let wallet;

    if (walletResult.rows.length === 0) {
      const newWalletResult = await client.query(
        `
        INSERT INTO wallets (user_id, balance)
        VALUES ($1, 0)
        RETURNING *
        `,
        [numericUserId]
      );

      wallet = newWalletResult.rows[0];
    } else {
      wallet = walletResult.rows[0];
    }

    const previousBalance = Number(wallet.balance || 0);

    // Mark QR claimed only now
    await client.query(
      `
      UPDATE product_qr_codes
      SET
        is_claimed = TRUE,
        claimed_by = $1,
        claimed_at = NOW()
      WHERE id = $2
      `,
      [numericUserId, qr.id]
    );

    // Add reward to wallet
    if (rewardAmount > 0) {
      const updatedWalletResult = await client.query(
        `
        UPDATE wallets
        SET
          balance = balance + $1,
          updated_at = NOW()
        WHERE user_id = $2
        RETURNING *
        `,
        [rewardAmount, numericUserId]
      );

      wallet = updatedWalletResult.rows[0];

      // IMPORTANT:
      // Your wallet_transactions table must contain
      // these column names:
      // wallet_id, user_id, amount, transaction_type,
      // description, balance_after

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
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          wallet.id,
          numericUserId,
          rewardAmount,
          "CREDIT",
          "QR Code Reward",
          Number(wallet.balance),
        ]
      );
    }

    await client.query("COMMIT");

    return {
      success: true,
      message:
        rewardAmount > 0
          ? "QR claimed and reward added to wallet"
          : "QR claimed successfully. Better Luck Next Time!",

      qrCode: normalizedQR,

      reward: rewardAmount,
      reward_amount: rewardAmount,

      previous_balance: previousBalance,
      remaining_balance: Number(wallet.balance),

      wallet,
    };
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Error claiming QR code:",
      error.message
    );

    throw error;
  } finally {
    client.release();
  }
};

const markQRCodeClaimed = async (qrCode, userId) => {
  const normalizedQR = String(qrCode || "").trim();
  const numericUserId = Number(userId);

  if (!normalizedQR) {
    return {
      success: false,
      reason: "INVALID_QR",
    };
  }

  if (
    !Number.isInteger(numericUserId) ||
    numericUserId <= 0
  ) {
    return {
      success: false,
      reason: "INVALID_USER",
    };
  }

  const userResult = await pool.query(
    `
    SELECT id
    FROM users
    WHERE id = $1
    LIMIT 1
    `,
    [numericUserId]
  );

  if (userResult.rows.length === 0) {
    return {
      success: false,
      reason: "USER_NOT_FOUND",
    };
  }

  const qrResult = await pool.query(
    `
    SELECT *
    FROM product_qr_codes
    WHERE TRIM(qr_code) = $1
    LIMIT 1
    `,
    [normalizedQR]
  );

  if (qrResult.rows.length === 0) {
    return {
      success: false,
      reason: "NOT_FOUND",
    };
  }

  const qr = qrResult.rows[0];

  if (Boolean(qr.is_claimed)) {
    return {
      success: false,
      reason: "ALREADY_CLAIMED",
      reward: Number(qr.reward_amount || 0),
      claimed_by: qr.claimed_by,
      claimed_at: qr.claimed_at,
    };
  }

  const updateResult = await pool.query(
    `
    UPDATE product_qr_codes
    SET
      is_claimed = TRUE,
      claimed_by = $1,
      claimed_at = CURRENT_TIMESTAMP
    WHERE id = $2
      AND is_claimed = FALSE
    RETURNING *
    `,
    [numericUserId, qr.id]
  );

  if (updateResult.rows.length === 0) {
    return {
      success: false,
      reason: "ALREADY_CLAIMED",
    };
  }

  const updatedQR = updateResult.rows[0];
  const reward = Number(updatedQR.reward_amount || 0);

  return {
    success: true,
    message: "QR marked as claimed successfully.",
    reward,
    reward_amount: reward,
    is_claimed: true,
    qr: updatedQR,
  };
};

const deleteQRCodesByProductId = async (productId) => {
  const result = await pool.query(
    `
    DELETE FROM product_qr_codes
    WHERE product_id = $1
    RETURNING *
    `,
    [productId]
  );

  return result.rows;
};
// ========================================
// GET PRODUCT-WISE REWARDS SUMMARY
// ========================================

const getRewardsSummary = async () => {
  const result = await pool.query(`
    SELECT
      p.id AS product_id,
      p.name AS product_name,

      COUNT(q.id)::int AS total_qr_codes,

      COUNT(q.id) FILTER (
        WHERE q.is_claimed = true
      )::int AS claimed,

      COUNT(q.id) FILTER (
        WHERE COALESCE(q.is_claimed, false) = false
      )::int AS unclaimed,

      COALESCE(
        SUM(q.reward_amount) FILTER (
          WHERE q.is_claimed = true
        ),
        0
      ) AS claimed_amount,

      COALESCE(
        SUM(q.reward_amount) FILTER (
          WHERE COALESCE(q.is_claimed, false) = false
        ),
        0
      ) AS unclaimed_amount

    FROM products p

    LEFT JOIN product_qr_codes q
      ON p.id = q.product_id

    GROUP BY p.id, p.name

    ORDER BY p.name ASC
  `);

  return result.rows;
};
// ========================================
// GET CUSTOMER-WISE CLAIMED REWARDS
// ========================================

const getClaimedRewards = async () => {
  const result = await pool.query(`
    SELECT
      qr.id AS qr_id,
      qr.qr_code,
      qr.reward_amount,
      qr.claimed_at,

      p.id AS product_id,
      p.name AS product_name,

      u.id AS user_id,
      u.name AS customer_name,
      u.email AS customer_email

    FROM product_qr_codes qr

    JOIN products p
      ON p.id = qr.product_id

    LEFT JOIN users u
      ON u.id = qr.claimed_by

    WHERE qr.is_claimed = TRUE

    ORDER BY qr.claimed_at DESC
  `);

  return result.rows;
};
module.exports = {
  createProductQRCodes,
  createAllProductQRCodes,
  getQRCodesByProductId,
  getQRByCode,
  claimQRCodeAndReward,
  markQRCodeClaimed,
  deleteQRCodesByProductId,
  normalizeRewardTiers,
   getRewardsSummary,
   getClaimedRewards,
};