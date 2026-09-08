
// const crypto = require("crypto");
// const pool = require("../config/db");

// // =====================================================
// // CONFIG
// // =====================================================

// const GIFT_QR_COUNT_PER_PRODUCT = 5;
// const MIN_GIFT_REWARD = 1;
// const MAX_GIFT_REWARD = 100;

// // =====================================================
// // GENERATE 5 DIFFERENT RANDOM REWARDS
// // =====================================================

// const generateUniqueRewards = (count) => {
//   const rewards = new Set();

//   while (rewards.size < count) {
//     const reward =
//       Math.floor(
//         Math.random() *
//           (MAX_GIFT_REWARD - MIN_GIFT_REWARD + 1)
//       ) + MIN_GIFT_REWARD;

//     rewards.add(reward);
//   }

//   return Array.from(rewards);
// };

// // =====================================================
// // GENERATE RANDOM UNIT NUMBERS
// // =====================================================

// const generateRandomGiftUnits = (
//   startUnit,
//   quantity,
//   giftCount
// ) => {
//   const units = new Set();

//   while (units.size < giftCount) {
//     const randomOffset =
//       Math.floor(Math.random() * quantity);

//     units.add(
//       startUnit + randomOffset
//     );
//   }

//   return Array.from(units);
// };

// // =====================================================
// // GENERATE QR TOKEN
// // =====================================================

// const generateQRToken = () => {
//   return `VA-${crypto
//     .randomBytes(24)
//     .toString("hex")}`;
// };

// // =====================================================
// // CREATE QR CODES FOR ONE PRODUCT
// // =====================================================

// const createProductQRCodes = async (
//   productId,
//   requestedStock = null
// ) => {
//   const client = await pool.connect();

//   try {
//     await client.query("BEGIN");

//     const numericProductId = Number(productId);

//     if (
//       !Number.isInteger(numericProductId) ||
//       numericProductId <= 0
//     ) {
//       throw new Error("Invalid product ID");
//     }

//     // =================================================
//     // PRODUCT
//     // =================================================

//     const productResult = await client.query(
//       `
//       SELECT
//         id,
//         name,
//         stock
//       FROM products
//       WHERE id = $1
//       LIMIT 1
//       `,
//       [numericProductId]
//     );

//     if (productResult.rows.length === 0) {
//       throw new Error("Product not found");
//     }

//     const product = productResult.rows[0];

//     const quantity =
//       requestedStock !== null
//         ? Number(requestedStock)
//         : Number(product.stock);

//     if (
//       !Number.isInteger(quantity) ||
//       quantity < 0
//     ) {
//       throw new Error(
//         "Product stock must be a valid whole number"
//       );
//     }

//     // =================================================
//     // EXISTING QR COUNT
//     // =================================================

//     const existingResult = await client.query(
//       `
//       SELECT COUNT(*)::int AS count
//       FROM product_qr_codes
//       WHERE product_id = $1
//       `,
//       [numericProductId]
//     );

//     const existingCount =
//       Number(existingResult.rows[0].count);

//     // =================================================
//     // EXISTING GIFTS
//     // =================================================

//     const existingGiftResult =
//       await client.query(
//         `
//         SELECT
//           id,
//           unit_number,
//           reward_amount
//         FROM product_qr_codes
//         WHERE product_id = $1
//           AND reward_amount > 0
//         ORDER BY unit_number
//         `,
//         [numericProductId]
//       );

//     const existingGiftCount =
//       existingGiftResult.rows.length;

//     // =================================================
//     // HOW MANY QR CODES ARE MISSING
//     // =================================================

//     const missingCount =
//       quantity - existingCount;

//     if (missingCount <= 0) {
//       await client.query("COMMIT");

//       console.log(
//         `QR codes already exist for ${product.name}`
//       );

//       return [];
//     }

//     // =================================================
//     // LAST UNIT
//     // =================================================

//     const lastUnitResult =
//       await client.query(
//         `
//         SELECT
//           COALESCE(
//             MAX(unit_number),
//             0
//           )::int AS last_unit
//         FROM product_qr_codes
//         WHERE product_id = $1
//         `,
//         [numericProductId]
//       );

//     let nextUnitNumber =
//       Number(
//         lastUnitResult.rows[0].last_unit
//       ) + 1;

//     // =================================================
//     // TARGET 5 GIFTS
//     // =================================================

//     const targetGiftCount =
//       Math.min(
//         GIFT_QR_COUNT_PER_PRODUCT,
//         quantity
//       );

//     const remainingGiftCount =
//       Math.max(
//         0,
//         targetGiftCount -
//           existingGiftCount
//       );

//     // =================================================
//     // NEW GIFTS
//     // =================================================

//     const newGiftCount =
//       Math.min(
//         remainingGiftCount,
//         missingCount
//       );

//     // =================================================
//     // DIFFERENT RANDOM AMOUNTS
//     // =================================================

//     const giftRewards =
//       generateUniqueRewards(
//         newGiftCount
//       );

//     // =================================================
//     // RANDOM POSITIONS
//     // =================================================

//     const giftUnits =
//       generateRandomGiftUnits(
//         nextUnitNumber,
//         missingCount,
//         newGiftCount
//       );

//     const giftUnitSet =
//       new Set(giftUnits);

//     // =================================================
//     // RANDOMIZE REWARDS
//     // =================================================

//     const shuffledRewards =
//       [...giftRewards].sort(
//         () => Math.random() - 0.5
//       );

//     const rewardMap = new Map();

//     giftUnits.forEach(
//       (unitNumber, index) => {
//         rewardMap.set(
//           unitNumber,
//           shuffledRewards[index]
//         );
//       }
//     );

//     // =================================================
//     // INSERT QR CODES
//     // =================================================

//     const qrCodes = [];

//     for (
//       let i = 0;
//       i < missingCount;
//       i++
//     ) {
//       let qrCode;

//       // -----------------------------------------------
//       // UNIQUE QR
//       // -----------------------------------------------

//       while (true) {
//         qrCode =
//           generateQRToken();

//         const duplicate =
//           await client.query(
//             `
//             SELECT id
//             FROM product_qr_codes
//             WHERE qr_code = $1
//             LIMIT 1
//             `,
//             [qrCode]
//           );

//         if (
//           duplicate.rows.length === 0
//         ) {
//           break;
//         }
//       }

//       // -----------------------------------------------
//       // UNIT
//       // -----------------------------------------------

//       const unitNumber =
//         nextUnitNumber;

//       // -----------------------------------------------
//       // REWARD
//       // -----------------------------------------------

//       const rewardAmount =
//         giftUnitSet.has(unitNumber)
//           ? Number(
//               rewardMap.get(
//                 unitNumber
//               )
//             )
//           : 0;

//       // -----------------------------------------------
//       // INSERT
//       // -----------------------------------------------

//       const insertResult =
//         await client.query(
//           `
//           INSERT INTO product_qr_codes
//           (
//             product_id,
//             qr_code,
//             reward_amount,
//             is_claimed,
//             unit_number
//           )
//           VALUES
//           (
//             $1,
//             $2,
//             $3,
//             FALSE,
//             $4
//           )
//           RETURNING *
//           `,
//           [
//             numericProductId,
//             qrCode,
//             rewardAmount,
//             unitNumber,
//           ]
//         );

//       qrCodes.push(
//         insertResult.rows[0]
//       );

//       nextUnitNumber++;
//     }

//     await client.query("COMMIT");

//     // =================================================
//     // LOG
//     // =================================================

//     console.log(
//       "================================"
//     );

//     console.log(
//       "QR GENERATION SUCCESS"
//     );

//     console.log(
//       "PRODUCT:",
//       product.name
//     );

//     console.log(
//       "PRODUCT ID:",
//       numericProductId
//     );

//     console.log(
//       "STOCK:",
//       quantity
//     );

//     console.log(
//       "EXISTING QR:",
//       existingCount
//     );

//     console.log(
//       "NEW QR:",
//       qrCodes.length
//     );

//     console.log(
//       "NEW GIFTS:",
//       newGiftCount
//     );

//     console.log(
//       "GIFT AMOUNTS:"
//     );

//     qrCodes
//       .filter(
//         (qr) =>
//           Number(
//             qr.reward_amount
//           ) > 0
//       )
//       .forEach((qr) => {
//         console.log(
//           `Unit ${qr.unit_number} → ₹${qr.reward_amount}`
//         );
//       });

//     console.log(
//       "================================"
//     );

//     return qrCodes;

//   } catch (error) {
//     await client.query("ROLLBACK");
//     throw error;
//   } finally {
//     client.release();
//   }
// };

// // =====================================================
// // CREATE QR FOR ALL PRODUCTS
// // =====================================================

// const createAllProductQRCodes = async () => {
//   const productsResult =
//     await pool.query(
//       `
//       SELECT
//         id,
//         name,
//         stock
//       FROM products
//       ORDER BY id ASC
//       `
//     );

//   const results = [];

//   for (
//     const product of productsResult.rows
//   ) {
//     const qrCodes =
//       await createProductQRCodes(
//         product.id,
//         Number(product.stock || 0)
//       );

//     const countResult =
//       await pool.query(
//         `
//         SELECT
//           COUNT(*)::int AS count
//         FROM product_qr_codes
//         WHERE product_id = $1
//         `,
//         [product.id]
//       );

//     const giftsResult =
//       await pool.query(
//         `
//         SELECT
//           id,
//           unit_number,
//           reward_amount,
//           is_claimed
//         FROM product_qr_codes
//         WHERE product_id = $1
//           AND reward_amount > 0
//         ORDER BY unit_number
//         `,
//         [product.id]
//       );

//     results.push({
//       productId: product.id,

//       productName: product.name,

//       stock:
//         Number(product.stock || 0),

//       generated:
//         qrCodes.length,

//       totalQRCodes:
//         Number(
//           countResult.rows[0].count
//         ),

//       giftQRCodes:
//         giftsResult.rows.length,

//       gifts:
//         giftsResult.rows.map(
//           (gift) => ({
//             qrId: gift.id,

//             unitNumber:
//               gift.unit_number,

//             rewardAmount:
//               Number(
//                 gift.reward_amount
//               ),

//             isClaimed:
//               gift.is_claimed,
//           })
//         ),
//     });
//   }

//   return {
//     totalProducts:
//       productsResult.rows.length,

//     products: results,
//   };
// };

// // =====================================================
// // GET QR CODES FOR PRODUCT
// // =====================================================

// const getQRCodesByProductId =
//   async (productId) => {

//     const numericProductId =
//       Number(productId);

//     if (
//       !Number.isInteger(
//         numericProductId
//       ) ||
//       numericProductId <= 0
//     ) {
//       throw new Error(
//         "Invalid product ID"
//       );
//     }

//     // =================================================
//     // PRODUCT
//     // =================================================

//     const productResult =
//       await pool.query(
//         `
//         SELECT
//           p.id,
//           p.name,
//           p.stock,
//           p.description,
//           p.price,
//           p.image,
//           p.category_id,
//           c.name AS category_name
//         FROM products p
//         LEFT JOIN categories c
//           ON p.category_id = c.id
//         WHERE p.id = $1
//         LIMIT 1
//         `,
//         [numericProductId]
//       );

//     if (
//       productResult.rows.length === 0
//     ) {
//       throw new Error(
//         "Product not found"
//       );
//     }

//     const product =
//       productResult.rows[0];

//     // =================================================
//     // QR CODES
//     // =================================================

//     const qrResult =
//       await pool.query(
//         `
//         SELECT
//           id,
//           product_id,
//           qr_code,
//           unit_number,
//           reward_amount,
//           is_claimed,
//           claimed_by,
//           claimed_at,
//           created_at
//         FROM product_qr_codes
//         WHERE product_id = $1
//         ORDER BY unit_number ASC
//         `,
//         [numericProductId]
//       );

//     return {
//       product: {
//         id:
//           Number(product.id),

//         name:
//           product.name,

//         stock:
//           Number(product.stock || 0),

//         description:
//           product.description,

//         price:
//           Number(product.price || 0),

//         image:
//           product.image,

//         category_id:
//           product.category_id,

//         category_name:
//           product.category_name,

//         gift_qr_count:
//           qrResult.rows.filter(
//             (qr) =>
//               Number(
//                 qr.reward_amount
//               ) > 0
//           ).length,
//       },

//       qrCodes:
//         qrResult.rows.map(
//           (qr) => ({
//             id:
//               Number(qr.id),

//             product_id:
//               Number(
//                 qr.product_id
//               ),

//             qr_code:
//               qr.qr_code,

//             unit_number:
//               Number(
//                 qr.unit_number
//               ),

//             reward_amount:
//               Number(
//                 qr.reward_amount || 0
//               ),

//             is_claimed:
//               qr.is_claimed,

//             claimed_by:
//               qr.claimed_by,

//             claimed_at:
//               qr.claimed_at,

//             created_at:
//               qr.created_at,
//           })
//         ),
//     };
//   };

// // =====================================================
// // GET SINGLE QR
// // =====================================================

// // const getQRByCode = async (qrCode) => {

// //     const normalizedQR =
// //       String(
// //         qrCode || ""
// //       ).trim();

// //     if (!normalizedQR) {
// //       return null;
// //     }

// //     const result =
// //       await pool.query(
// //         `
// //         SELECT
// //           q.id,
// //           q.product_id,
// //           q.qr_code,
// //           q.unit_number,
// //           q.reward_amount,
// //           q.is_claimed,
// //           q.claimed_by,
// //           q.claimed_at,
// //           q.created_at,

// //           p.name AS product_name,
// //           p.description AS product_description,
// //           p.price AS product_price,
// //           p.image AS product_image,
// //           p.stock AS product_stock,

// //           p.category_id,
// //           c.name AS category_name

// //         FROM product_qr_codes q

// //         INNER JOIN products p
// //           ON q.product_id = p.id

// //         LEFT JOIN categories c
// //           ON p.category_id = c.id

// //         WHERE TRIM(q.qr_code) = $1

// //         LIMIT 1
// //         `,
// //         [normalizedQR]
// //       );

// //     const row =
// //       result.rows[0];

// //     if (!row) {
// //       return null;
// //     }

// //     const reward =
// //       Number(
// //         row.reward_amount || 0
// //       );

// //     return {
// //       id:
// //         Number(row.id),

// //       product_id:
// //         Number(row.product_id),

// //       qr_code:
// //         row.qr_code,

// //       unit_number:
// //         Number(row.unit_number),

// //       reward_amount:
// //         reward,

// //       gift_reward:
// //         reward,

// //       is_claimed:
// //         row.is_claimed,

// //       claimed_by:
// //         row.claimed_by,

// //       claimed_at:
// //         row.claimed_at,

// //       created_at:
// //         row.created_at,

// //       product: {
// //         id:
// //           Number(row.product_id),

// //         name:
// //           row.product_name,

// //         description:
// //           row.product_description,

// //         price:
// //           Number(
// //             row.product_price || 0
// //           ),

// //         image:
// //           row.product_image,

// //         category_name:
// //           row.category_name,
// //       },

// //       gift: {
// //         amount:
// //           reward,
// //       },
// //     };
// //   };
// // =====================================================
// // GET SINGLE QR
// // =====================================================

// const getQRByCode = async (qrCode) => {
//   const normalizedQR = String(qrCode || "").trim();

//   if (!normalizedQR) {
//     return null;
//   }

//   console.log("================================");
//   console.log("SEARCHING QR IN DATABASE");
//   console.log("QR CODE:", normalizedQR);
//   console.log("================================");

//   const result = await pool.query(
//     `
//     SELECT
//       q.id,
//       q.product_id,
//       q.qr_code,
//       q.unit_number,
//       q.reward_amount,
//       q.is_claimed,
//       q.claimed_by,
//       q.claimed_at,
//       q.created_at,

//       p.name AS product_name,
//       p.description AS product_description,
//       p.price AS product_price,
//       p.image AS product_image,
//       p.stock AS product_stock,

//       p.category_id,
//       c.name AS category_name

//     FROM product_qr_codes q

//     INNER JOIN products p
//       ON q.product_id = p.id

//     LEFT JOIN categories c
//       ON p.category_id = c.id

//     WHERE q.qr_code = $1

//     LIMIT 1
//     `,
//     [normalizedQR]
//   );

//   // =====================================================
//   // QR NOT FOUND
//   // =====================================================

//   if (result.rows.length === 0) {
//     console.log("❌ QR NOT FOUND");
//     console.log("SCANNED QR:", normalizedQR);
//     console.log("================================");

//     return null;
//   }

//   const row = result.rows[0];

//   const reward = Number(row.reward_amount || 0);

//   console.log("✅ QR FOUND");
//   console.log("QR ID:", row.id);
//   console.log("PRODUCT ID:", row.product_id);
//   console.log("PRODUCT:", row.product_name);
//   console.log("REWARD:", reward);
//   console.log("CLAIMED:", row.is_claimed);
//   console.log("================================");

//   return {
//     id: Number(row.id),

//     product_id: Number(row.product_id),

//     qr_code: row.qr_code,

//     unit_number: Number(row.unit_number),

//     reward_amount: reward,

//     gift_reward: reward,

//     is_claimed: Boolean(row.is_claimed),

//     claimed_by: row.claimed_by,

//     claimed_at: row.claimed_at,

//     created_at: row.created_at,

//     product: {
//       id: Number(row.product_id),

//       name: row.product_name,

//       description: row.product_description,

//       price: Number(row.product_price || 0),

//       image: row.product_image,

//       stock: Number(row.product_stock || 0),

//       category_id: row.category_id,

//       category_name: row.category_name,
//     },

//     gift: {
//       amount: reward,
//     },
//   };
// };
// // =====================================================
// // CLAIM QR REWARD
// // =====================================================

// const claimQRCodeAndReward =
//   async (
//     qrCode,
//     userId
//   ) => {

//     const client =
//       await pool.connect();

//     try {
//       await client.query(
//         "BEGIN"
//       );

//       const normalizedQR =
//         String(
//           qrCode || ""
//         ).trim();

//       const numericUserId =
//         Number(userId);

//       if (!normalizedQR) {
//         await client.query(
//           "ROLLBACK"
//         );

//         return {
//           success: false,
//           reason:
//             "INVALID_QR",
//         };
//       }

//       if (
//         !Number.isInteger(
//           numericUserId
//         ) ||
//         numericUserId <= 0
//       ) {
//         throw new Error(
//           "Invalid user ID"
//         );
//       }

//       // =================================================
//       // VERIFY USER
//       // =================================================

//       const userResult =
//         await client.query(
//           `
//           SELECT id
//           FROM users
//           WHERE id = $1
//           LIMIT 1
//           `,
//           [numericUserId]
//         );

//       if (
//         userResult.rows.length === 0
//       ) {
//         throw new Error(
//           "User not found"
//         );
//       }

//       // =================================================
//       // LOCK QR
//       // =================================================

//       const qrResult =
//         await client.query(
//           `
//           SELECT
//             q.*,

//             p.name AS product_name,
//             p.price AS product_price,
//             p.description AS product_description,
//             p.image AS product_image,

//             c.name AS category_name

//           FROM product_qr_codes q

//           INNER JOIN products p
//             ON q.product_id = p.id

//           LEFT JOIN categories c
//             ON p.category_id = c.id

//           WHERE TRIM(q.qr_code) = $1

//           FOR UPDATE OF q
//           `,
//           [normalizedQR]
//         );

//       if (
//         qrResult.rows.length === 0
//       ) {
//         await client.query(
//           "ROLLBACK"
//         );

//         return {
//           success: false,
//           reason:
//             "NOT_FOUND",
//         };
//       }

//       const qr =
//         qrResult.rows[0];

//       // =================================================
//       // ALREADY CLAIMED
//       // =================================================

//       if (
//         qr.is_claimed === true
//       ) {
//         await client.query(
//           "ROLLBACK"
//         );

//         return {
//           success: false,

//           reason:
//             "ALREADY_CLAIMED",

//           productName:
//             qr.product_name,

//           claimedBy:
//             qr.claimed_by,

//           claimedAt:
//             qr.claimed_at,
//         };
//       }

//       // =================================================
//       // REWARD
//       // =================================================

//       const rewardAmount =
//         Number(
//           qr.reward_amount || 0
//         );

//       if (
//         !Number.isFinite(
//           rewardAmount
//         ) ||
//         rewardAmount <= 0
//       ) {
//         await client.query(
//           "ROLLBACK"
//         );

//         return {
//           success: false,

//           reason:
//             "NO_GIFT",

//           productName:
//             qr.product_name,

//           reward: 0,
//         };
//       }

//       // =================================================
//       // GET / CREATE WALLET
//       // =================================================

//       let walletResult =
//         await client.query(
//           `
//           SELECT *
//           FROM wallets
//           WHERE user_id = $1
//           FOR UPDATE
//           `,
//           [numericUserId]
//         );

//       let wallet;

//       if (
//         walletResult.rows.length === 0
//       ) {
//         const createWalletResult =
//           await client.query(
//             `
//             INSERT INTO wallets
//             (
//               user_id,
//               balance
//             )
//             VALUES
//             ($1, 0)
//             RETURNING *
//             `,
//             [numericUserId]
//           );

//         wallet =
//           createWalletResult
//             .rows[0];
//       } else {
//         wallet =
//           walletResult.rows[0];
//       }

//       const previousBalance =
//         Number(
//           wallet.balance || 0
//         );

//       // =================================================
//       // MARK CLAIMED
//       // =================================================

//       const claimResult =
//         await client.query(
//           `
//           UPDATE product_qr_codes
//           SET
//             is_claimed = TRUE,
//             claimed_by = $1,
//             claimed_at =
//               CURRENT_TIMESTAMP
//           WHERE id = $2
//           RETURNING *
//           `,
//           [
//             numericUserId,
//             qr.id,
//           ]
//         );

//       if (
//         claimResult.rows.length === 0
//       ) {
//         throw new Error(
//           "Failed to claim QR"
//         );
//       }

//       // =================================================
//       // UPDATE WALLET
//       // =================================================

//       const walletUpdateResult =
//         await client.query(
//           `
//           UPDATE wallets
//           SET
//             balance =
//               balance + $1,

//             updated_at =
//               CURRENT_TIMESTAMP

//           WHERE id = $2

//           RETURNING *
//           `,
//           [
//             rewardAmount,
//             wallet.id,
//           ]
//         );

//       const updatedWallet =
//         walletUpdateResult
//           .rows[0];

//       const remainingBalance =
//         Number(
//           updatedWallet.balance
//         );

//       // =================================================
//       // TRANSACTION
//       // =================================================

//       const transactionResult =
//         await client.query(
//           `
//           INSERT INTO wallet_transactions
//           (
//             wallet_id,
//             user_id,
//             amount,
//             transaction_type,
//             description,
//             balance_after
//           )
//           VALUES
//           (
//             $1,
//             $2,
//             $3,
//             'CREDIT',
//             $4,
//             $5
//           )
//           RETURNING *
//           `,
//           [
//             wallet.id,
//             numericUserId,
//             rewardAmount,
//             `Gift reward - ${qr.product_name}`,
//             remainingBalance,
//           ]
//         );

//       // =================================================
//       // COMMIT
//       // =================================================

//       await client.query(
//         "COMMIT"
//       );

//       console.log(
//         "================================"
//       );

//       console.log(
//         "GIFT CLAIM SUCCESS"
//       );

//       console.log(
//         "USER:",
//         numericUserId
//       );

//       console.log(
//         "PRODUCT:",
//         qr.product_name
//       );

//       console.log(
//         "PRODUCT ID:",
//         qr.product_id
//       );

//       console.log(
//         "QR:",
//         normalizedQR
//       );

//       console.log(
//         "REWARD:",
//         rewardAmount
//       );

//       console.log(
//         "PREVIOUS BALANCE:",
//         previousBalance
//       );

//       console.log(
//         "NEW BALANCE:",
//         remainingBalance
//       );

//       console.log(
//         "================================"
//       );

//       return {
//         success: true,

//         product: {
//           id:
//             Number(
//               qr.product_id
//             ),

//           name:
//             qr.product_name,

//           description:
//             qr.product_description,

//           price:
//             Number(
//               qr.product_price || 0
//             ),

//           image:
//             qr.product_image,

//           category_name:
//             qr.category_name,
//         },

//         gift: {
//           amount:
//             rewardAmount,
//         },

//         reward:
//           rewardAmount,

//         wallet: {
//           id:
//             updatedWallet.id,

//           user_id:
//             updatedWallet.user_id,

//           balance:
//             remainingBalance,
//         },

//         transaction:
//           transactionResult
//             .rows[0],

//         previous_balance:
//           previousBalance,

//         reward_amount:
//           rewardAmount,

//         remaining_balance:
//           remainingBalance,

//         qr:
//           claimResult.rows[0],
//       };

//     } catch (error) {
//       await client.query(
//         "ROLLBACK"
//       );

//       throw error;

//     } finally {
//       client.release();
//     }
//   };

// // =====================================================
// // DELETE PRODUCT QR
// // =====================================================

// const deleteQRCodesByProductId =
//   async (productId) => {

//     const result =
//       await pool.query(
//         `
//         DELETE FROM product_qr_codes
//         WHERE product_id = $1
//         RETURNING *
//         `,
//         [Number(productId)]
//       );

//     return result.rows;
//   };

// // =====================================================
// // EXPORT
// // =====================================================

// module.exports = {
//   createProductQRCodes,
//   createAllProductQRCodes,
//   getQRCodesByProductId,
//   getQRByCode,
//   claimQRCodeAndReward,
//   deleteQRCodesByProductId,
// };

const crypto = require("crypto");
const pool = require("../config/db");

// =====================================================
// CONFIG
// =====================================================

const GIFT_QR_COUNT_PER_PRODUCT = 5;
const MIN_GIFT_REWARD = 1;
const MAX_GIFT_REWARD = 100;

// =====================================================
// GENERATE UNIQUE RANDOM REWARDS
// =====================================================

const generateUniqueRewards = (count) => {
  const rewards = new Set();

  while (rewards.size < count) {
    const reward =
      Math.floor(
        Math.random() *
          (MAX_GIFT_REWARD - MIN_GIFT_REWARD + 1)
      ) + MIN_GIFT_REWARD;

    rewards.add(reward);
  }

  return Array.from(rewards);
};

// =====================================================
// GENERATE RANDOM GIFT UNITS
// =====================================================

const generateRandomGiftUnits = (
  startUnit,
  quantity,
  giftCount
) => {
  const units = new Set();

  while (units.size < giftCount) {
    const randomOffset =
      Math.floor(Math.random() * quantity);

    units.add(startUnit + randomOffset);
  }

  return Array.from(units);
};

// =====================================================
// GENERATE QR TOKEN
// =====================================================

const generateQRToken = () => {
  return `VA-${crypto
    .randomBytes(24)
    .toString("hex")}`;
};

// =====================================================
// CREATE QR CODES FOR ONE PRODUCT
// =====================================================

const createProductQRCodes = async (
  productId,
  requestedStock = null
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const numericProductId = Number(productId);

    if (
      !Number.isInteger(numericProductId) ||
      numericProductId <= 0
    ) {
      throw new Error("Invalid product ID");
    }

    // =================================================
    // GET PRODUCT
    // =================================================

    const productResult = await client.query(
      `
      SELECT
        id,
        name,
        stock
      FROM products
      WHERE id = $1
      LIMIT 1
      `,
      [numericProductId]
    );

    if (productResult.rows.length === 0) {
      throw new Error("Product not found");
    }

    const product = productResult.rows[0];

    // =================================================
    // STOCK QUANTITY
    // =================================================

    const quantity =
      requestedStock !== null
        ? Number(requestedStock)
        : Number(product.stock);

    if (
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      throw new Error(
        "Product stock must be a valid whole number"
      );
    }

    // =================================================
    // EXISTING QR COUNT
    // =================================================

    const existingResult = await client.query(
      `
      SELECT
        COUNT(*)::int AS count
      FROM product_qr_codes
      WHERE product_id = $1
      `,
      [numericProductId]
    );

    const existingCount =
      Number(existingResult.rows[0].count);

    // =================================================
    // EXISTING GIFT QR COUNT
    // =================================================

    const existingGiftResult =
      await client.query(
        `
        SELECT
          id,
          unit_number,
          reward_amount
        FROM product_qr_codes
        WHERE product_id = $1
          AND reward_amount > 0
        ORDER BY unit_number
        `,
        [numericProductId]
      );

    const existingGiftCount =
      existingGiftResult.rows.length;

    // =================================================
    // MISSING QR COUNT
    // =================================================

    const missingCount =
      quantity - existingCount;

    if (missingCount <= 0) {
      await client.query("COMMIT");

      console.log(
        `QR codes already exist for ${product.name}`
      );

      return [];
    }

    // =================================================
    // LAST UNIT NUMBER
    // =================================================

    const lastUnitResult =
      await client.query(
        `
        SELECT
          COALESCE(
            MAX(unit_number),
            0
          )::int AS last_unit
        FROM product_qr_codes
        WHERE product_id = $1
        `,
        [numericProductId]
      );

    let nextUnitNumber =
      Number(
        lastUnitResult.rows[0].last_unit
      ) + 1;

    // =================================================
    // TARGET GIFT COUNT
    // =================================================

    const targetGiftCount =
      Math.min(
        GIFT_QR_COUNT_PER_PRODUCT,
        quantity
      );

    const remainingGiftCount =
      Math.max(
        0,
        targetGiftCount -
          existingGiftCount
      );

    // =================================================
    // NEW GIFT COUNT
    // =================================================

    const newGiftCount =
      Math.min(
        remainingGiftCount,
        missingCount
      );

    // =================================================
    // GENERATE UNIQUE REWARDS
    // =================================================

    const giftRewards =
      newGiftCount > 0
        ? generateUniqueRewards(
            newGiftCount
          )
        : [];

    // =================================================
    // RANDOM GIFT POSITIONS
    // =================================================

    const giftUnits =
      newGiftCount > 0
        ? generateRandomGiftUnits(
            nextUnitNumber,
            missingCount,
            newGiftCount
          )
        : [];

    const giftUnitSet =
      new Set(giftUnits);

    // =================================================
    // RANDOMIZE REWARDS
    // =================================================

    const shuffledRewards =
      [...giftRewards].sort(
        () => Math.random() - 0.5
      );

    const rewardMap = new Map();

    giftUnits.forEach(
      (unitNumber, index) => {
        rewardMap.set(
          unitNumber,
          shuffledRewards[index]
        );
      }
    );

    // =================================================
    // INSERT QR CODES
    // =================================================

    const qrCodes = [];

    for (
      let i = 0;
      i < missingCount;
      i++
    ) {
      let qrCode;

      // ===============================================
      // GENERATE UNIQUE QR TOKEN
      // ===============================================

      while (true) {
        qrCode = generateQRToken();

        const duplicate =
          await client.query(
            `
            SELECT id
            FROM product_qr_codes
            WHERE qr_code = $1
            LIMIT 1
            `,
            [qrCode]
          );

        if (
          duplicate.rows.length === 0
        ) {
          break;
        }
      }

      // ===============================================
      // UNIT NUMBER
      // ===============================================

      const unitNumber =
        nextUnitNumber;

      // ===============================================
      // REWARD
      // ===============================================

      const rewardAmount =
        giftUnitSet.has(unitNumber)
          ? Number(
              rewardMap.get(
                unitNumber
              )
            )
          : 0;

      // ===============================================
      // INSERT
      // ===============================================

      const insertResult =
        await client.query(
          `
          INSERT INTO product_qr_codes
          (
            product_id,
            qr_code,
            reward_amount,
            is_claimed,
            unit_number
          )
          VALUES
          (
            $1,
            $2,
            $3,
            FALSE,
            $4
          )
          RETURNING *
          `,
          [
            numericProductId,
            qrCode,
            rewardAmount,
            unitNumber,
          ]
        );

      qrCodes.push(
        insertResult.rows[0]
      );

      nextUnitNumber++;
    }

    await client.query("COMMIT");

    // =================================================
    // LOG
    // =================================================

    console.log(
      "================================"
    );

    console.log(
      "QR GENERATION SUCCESS"
    );

    console.log(
      "PRODUCT:",
      product.name
    );

    console.log(
      "PRODUCT ID:",
      numericProductId
    );

    console.log(
      "STOCK:",
      quantity
    );

    console.log(
      "EXISTING QR:",
      existingCount
    );

    console.log(
      "NEW QR:",
      qrCodes.length
    );

    console.log(
      "NEW GIFTS:",
      newGiftCount
    );

    console.log(
      "GIFT AMOUNTS:"
    );

    qrCodes
      .filter(
        (qr) =>
          Number(
            qr.reward_amount
          ) > 0
      )
      .forEach((qr) => {
        console.log(
          `Unit ${qr.unit_number} → ₹${qr.reward_amount}`
        );
      });

    console.log(
      "================================"
    );

    return qrCodes;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// =====================================================
// CREATE QR CODES FOR ALL PRODUCTS
// =====================================================

const createAllProductQRCodes = async () => {
  const productsResult =
    await pool.query(
      `
      SELECT
        id,
        name,
        stock
      FROM products
      ORDER BY id ASC
      `
    );

  const results = [];

  for (
    const product of productsResult.rows
  ) {
    const qrCodes =
      await createProductQRCodes(
        product.id,
        Number(product.stock || 0)
      );

    const countResult =
      await pool.query(
        `
        SELECT
          COUNT(*)::int AS count
        FROM product_qr_codes
        WHERE product_id = $1
        `,
        [product.id]
      );

    const giftsResult =
      await pool.query(
        `
        SELECT
          id,
          unit_number,
          reward_amount,
          is_claimed
        FROM product_qr_codes
        WHERE product_id = $1
          AND reward_amount > 0
        ORDER BY unit_number
        `,
        [product.id]
      );

    results.push({
      productId:
        product.id,

      productName:
        product.name,

      stock:
        Number(product.stock || 0),

      generated:
        qrCodes.length,

      totalQRCodes:
        Number(
          countResult.rows[0].count
        ),

      giftQRCodes:
        giftsResult.rows.length,

      gifts:
        giftsResult.rows.map(
          (gift) => ({
            qrId:
              gift.id,

            unitNumber:
              gift.unit_number,

            rewardAmount:
              Number(
                gift.reward_amount || 0
              ),

            isClaimed:
              Boolean(
                gift.is_claimed
              ),
          })
        ),
    });
  }

  return {
    totalProducts:
      productsResult.rows.length,

    products:
      results,
  };
};

// =====================================================
// GET QR CODES FOR PRODUCT
// =====================================================

const getQRCodesByProductId =
  async (productId) => {
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
    // GET PRODUCT
    // =================================================

    const productResult =
      await pool.query(
        `
        SELECT
          p.id,
          p.name,
          p.stock,
          p.description,
          p.price,
          p.image,
          p.category_id,
          c.name AS category_name
        FROM products p
        LEFT JOIN categories c
          ON p.category_id = c.id
        WHERE p.id = $1
        LIMIT 1
        `,
        [numericProductId]
      );

    if (
      productResult.rows.length === 0
    ) {
      throw new Error(
        "Product not found"
      );
    }

    const product =
      productResult.rows[0];

    // =================================================
    // GET ALL QR CODES
    // =================================================

    const qrResult =
      await pool.query(
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
        [numericProductId]
      );

    // =================================================
    // RESPONSE
    // =================================================

    return {
      product: {
        id:
          Number(product.id),

        name:
          product.name,

        stock:
          Number(product.stock || 0),

        description:
          product.description,

        price:
          Number(product.price || 0),

        image:
          product.image,

        category_id:
          product.category_id,

        category_name:
          product.category_name,

        gift_qr_count:
          qrResult.rows.filter(
            (qr) =>
              Number(
                qr.reward_amount || 0
              ) > 0
          ).length,
      },

      qrCodes:
        qrResult.rows.map(
          (qr) => ({
            id:
              Number(qr.id),

            product_id:
              Number(
                qr.product_id
              ),

            qr_code:
              qr.qr_code,

            unit_number:
              Number(
                qr.unit_number
              ),

            reward_amount:
              Number(
                qr.reward_amount || 0
              ),

            // IMPORTANT:
            // Claimed status is independent
            // from gift availability.
            is_claimed:
              Boolean(
                qr.is_claimed
              ),

            claimed_by:
              qr.claimed_by,

            claimed_at:
              qr.claimed_at,

            created_at:
              qr.created_at,
          })
        ),
    };
  };

// =====================================================
// GET SINGLE QR DETAILS
// =====================================================

const getQRByCode = async (qrCode) => {
  const normalizedQR =
    String(
      qrCode || ""
    ).trim();

  if (!normalizedQR) {
    return null;
  }

  console.log(
    "================================"
  );

  console.log(
    "SEARCHING QR IN DATABASE"
  );

  console.log(
    "QR CODE:",
    normalizedQR
  );

  console.log(
    "================================"
  );

  const result =
    await pool.query(
      `
      SELECT
        q.id,
        q.product_id,
        q.qr_code,
        q.unit_number,
        q.reward_amount,
        q.is_claimed,
        q.claimed_by,
        q.claimed_at,
        q.created_at,

        p.name AS product_name,
        p.description AS product_description,
        p.price AS product_price,
        p.image AS product_image,
        p.stock AS product_stock,

        p.category_id,
        c.name AS category_name

      FROM product_qr_codes q

      INNER JOIN products p
        ON q.product_id = p.id

      LEFT JOIN categories c
        ON p.category_id = c.id

      WHERE TRIM(q.qr_code) = $1

      LIMIT 1
      `,
      [normalizedQR]
    );

  // =================================================
  // QR NOT FOUND
  // =================================================

  if (
    result.rows.length === 0
  ) {
    console.log(
      "❌ QR NOT FOUND"
    );

    console.log(
      "SCANNED QR:",
      normalizedQR
    );

    console.log(
      "================================"
    );

    return null;
  }

  const row =
    result.rows[0];

  const reward =
    Number(
      row.reward_amount || 0
    );

  const isClaimed =
    Boolean(
      row.is_claimed
    );

  const hasGift =
    Number.isFinite(reward) &&
    reward > 0;

  console.log(
    "✅ QR FOUND"
  );

  console.log(
    "QR ID:",
    row.id
  );

  console.log(
    "PRODUCT ID:",
    row.product_id
  );

  console.log(
    "PRODUCT:",
    row.product_name
  );

  console.log(
    "REWARD:",
    reward
  );

  console.log(
    "HAS GIFT:",
    hasGift
  );

  console.log(
    "CLAIMED:",
    isClaimed
  );

  console.log(
    "================================"
  );

  // =================================================
  // RETURN
  // =================================================

  return {
    id:
      Number(row.id),

    product_id:
      Number(row.product_id),

    qr_code:
      row.qr_code,

    unit_number:
      Number(row.unit_number),

    reward_amount:
      reward,

    gift_reward:
      reward,

    // IMPORTANT:
    // Never calculate claimed from reward.
    is_claimed:
      isClaimed,

    // Helpful frontend field
    has_gift:
      hasGift,

    claimed_by:
      row.claimed_by,

    claimed_at:
      row.claimed_at,

    created_at:
      row.created_at,

    product: {
      id:
        Number(
          row.product_id
        ),

      name:
        row.product_name,

      description:
        row.product_description,

      price:
        Number(
          row.product_price || 0
        ),

      image:
        row.product_image,

      stock:
        Number(
          row.product_stock || 0
        ),

      category_id:
        row.category_id,

      category_name:
        row.category_name,
    },

    gift: {
      amount:
        reward,

      available:
        hasGift,
    },
  };
};

// =====================================================
// CLAIM QR REWARD
// =====================================================

const claimQRCodeAndReward =
  async (
    qrCode,
    userId
  ) => {
    const client =
      await pool.connect();

    try {
      await client.query(
        "BEGIN"
      );

      // =================================================
      // NORMALIZE QR
      // =================================================

      const normalizedQR =
        String(
          qrCode || ""
        ).trim();

      // =================================================
      // USER ID
      // =================================================

      const numericUserId =
        Number(userId);

      // =================================================
      // VALIDATE QR
      // =================================================

      if (!normalizedQR) {
        await client.query(
          "ROLLBACK"
        );

        return {
          success: false,
          reason:
            "INVALID_QR",
        };
      }

      // =================================================
      // VALIDATE USER
      // =================================================

      if (
        !Number.isInteger(
          numericUserId
        ) ||
        numericUserId <= 0
      ) {
        await client.query(
          "ROLLBACK"
        );

        return {
          success: false,
          reason:
            "INVALID_USER",
        };
      }

      // =================================================
      // VERIFY USER
      // =================================================

      const userResult =
        await client.query(
          `
          SELECT
            id
          FROM users
          WHERE id = $1
          LIMIT 1
          `,
          [numericUserId]
        );

      if (
        userResult.rows.length === 0
      ) {
        await client.query(
          "ROLLBACK"
        );

        return {
          success: false,
          reason:
            "USER_NOT_FOUND",
        };
      }

      // =================================================
      // LOCK QR
      // =================================================

      const qrResult =
        await client.query(
          `
          SELECT
            q.*,

            p.name AS product_name,
            p.price AS product_price,
            p.description AS product_description,
            p.image AS product_image,
            p.stock AS product_stock,

            c.name AS category_name

          FROM product_qr_codes q

          INNER JOIN products p
            ON q.product_id = p.id

          LEFT JOIN categories c
            ON p.category_id = c.id

          WHERE TRIM(q.qr_code) = $1

          FOR UPDATE OF q
          `,
          [normalizedQR]
        );

      // =================================================
      // QR NOT FOUND
      // =================================================

      if (
        qrResult.rows.length === 0
      ) {
        await client.query(
          "ROLLBACK"
        );

        return {
          success: false,
          reason:
            "NOT_FOUND",
        };
      }

      const qr =
        qrResult.rows[0];

      // =================================================
      // ALREADY CLAIMED
      // =================================================

      if (
        Boolean(
          qr.is_claimed
        )
      ) {
        await client.query(
          "ROLLBACK"
        );

        return {
          success: false,

          reason:
            "ALREADY_CLAIMED",

          productName:
            qr.product_name,

          claimedBy:
            qr.claimed_by,

          claimedAt:
            qr.claimed_at,

          reward:
            Number(
              qr.reward_amount || 0
            ),
        };
      }

      // =================================================
      // GET REWARD
      // =================================================

      const rewardAmount =
        Number(
          qr.reward_amount || 0
        );

      // =================================================
      // NO GIFT
      // =================================================

      // if ( !Number.isFinite(
      //     rewardAmount
      //   ) ||
      //   rewardAmount <= 0
      // ) {
      //   await client.query(
      //     "ROLLBACK"
      //   );

      //   return {
      //     success: false,

      //     reason:
      //       "NO_GIFT",

      //     productName:
      //       qr.product_name,

      //     reward: 0,

      //     is_claimed:
      //       false,

      //     has_gift:
      //       false,
      //   };
      // }
// =================================================
// NO GIFT
// =================================================

if (
  !Number.isFinite(rewardAmount) ||
  rewardAmount <= 0
) {
  // Mark QR as claimed even though
  // there is no gift/reward.
  const claimNoGiftResult =
    await client.query(
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
      [
        numericUserId,
        qr.id,
      ]
    );

  // Another request may have claimed it
  if (
    claimNoGiftResult.rows.length === 0
  ) {
    await client.query("ROLLBACK");

    return {
      success: false,
      reason: "ALREADY_CLAIMED",
    };
  }

  await client.query("COMMIT");

  console.log(
    "================================"
  );

  console.log(
    "QR MARKED AS CLAIMED - NO GIFT"
  );

  console.log(
    "USER:",
    numericUserId
  );

  console.log(
    "PRODUCT:",
    qr.product_name
  );

  console.log(
    "QR:",
    normalizedQR
  );

  console.log(
    "REWARD: 0"
  );

  console.log(
    "================================"
  );

  return {
    success: true,

    message:
      "QR scanned successfully. No gift is available.",

    product: {
      id:
        Number(qr.product_id),

      name:
        qr.product_name,

      description:
        qr.product_description,

      price:
        Number(
          qr.product_price || 0
        ),

      image:
        qr.product_image,

      stock:
        Number(
          qr.product_stock || 0
        ),

      category_name:
        qr.category_name,
    },

    gift: {
      amount: 0,
      available: false,
    },

    reward: 0,

    reward_amount: 0,

    is_claimed: true,

    has_gift: false,

    qr:
      claimNoGiftResult.rows[0],
  };
}
      // =================================================
      // GET / CREATE WALLET
      // =================================================

      let walletResult =
        await client.query(
          `
          SELECT *
          FROM wallets
          WHERE user_id = $1
          FOR UPDATE
          `,
          [numericUserId]
        );

      let wallet;

      // =================================================
      // CREATE WALLET IF NEEDED
      // =================================================

      if (
        walletResult.rows.length === 0
      ) {
        const createWalletResult =
          await client.query(
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
            [numericUserId]
          );

        wallet =
          createWalletResult
            .rows[0];
      } else {
        wallet =
          walletResult.rows[0];
      }

      // =================================================
      // PREVIOUS BALANCE
      // =================================================

      const previousBalance =
        Number(
          wallet.balance || 0
        );

      // =================================================
      // MARK QR AS CLAIMED
      // =================================================

      const claimResult =
        await client.query(
          `
          UPDATE product_qr_codes
          SET
            is_claimed = TRUE,
            claimed_by = $1,
            claimed_at =
              CURRENT_TIMESTAMP
          WHERE id = $2
            AND is_claimed = FALSE
          RETURNING *
          `,
          [
            numericUserId,
            qr.id,
          ]
        );

      // =================================================
      // CLAIM FAILED
      // =================================================

      if (
        claimResult.rows.length === 0
      ) {
        await client.query(
          "ROLLBACK"
        );

        return {
          success: false,
          reason:
            "ALREADY_CLAIMED",
        };
      }

      // =================================================
      // UPDATE WALLET
      // =================================================

      const walletUpdateResult =
        await client.query(
          `
          UPDATE wallets
          SET
            balance =
              balance + $1,

            updated_at =
              CURRENT_TIMESTAMP

          WHERE id = $2

          RETURNING *
          `,
          [
            rewardAmount,
            wallet.id,
          ]
        );

      if (
        walletUpdateResult.rows.length === 0
      ) {
        throw new Error(
          "Failed to update wallet"
        );
      }

      const updatedWallet =
        walletUpdateResult
          .rows[0];

      // =================================================
      // REMAINING BALANCE
      // =================================================

      const remainingBalance =
        Number(
          updatedWallet.balance || 0
        );

      // =================================================
      // WALLET TRANSACTION
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
          (
            $1,
            $2,
            $3,
            'CREDIT',
            $4,
            $5
          )
          RETURNING *
          `,
          [
            wallet.id,

            numericUserId,

            rewardAmount,

            `Gift reward - ${qr.product_name}`,

            remainingBalance,
          ]
        );

      // =================================================
      // COMMIT
      // =================================================

      await client.query(
        "COMMIT"
      );

      // =================================================
      // LOG
      // =================================================

      console.log(
        "================================"
      );

      console.log(
        "GIFT CLAIM SUCCESS"
      );

      console.log(
        "USER:",
        numericUserId
      );

      console.log(
        "PRODUCT:",
        qr.product_name
      );

      console.log(
        "PRODUCT ID:",
        qr.product_id
      );

      console.log(
        "QR:",
        normalizedQR
      );

      console.log(
        "REWARD:",
        rewardAmount
      );

      console.log(
        "PREVIOUS BALANCE:",
        previousBalance
      );

      console.log(
        "NEW BALANCE:",
        remainingBalance
      );

      console.log(
        "================================"
      );

      // =================================================
      // SUCCESS RESPONSE
      // =================================================

      return {
        success: true,

        product: {
          id:
            Number(
              qr.product_id
            ),

          name:
            qr.product_name,

          description:
            qr.product_description,

          price:
            Number(
              qr.product_price || 0
            ),

          image:
            qr.product_image,

          stock:
            Number(
              qr.product_stock || 0
            ),

          category_name:
            qr.category_name,
        },

        gift: {
          amount:
            rewardAmount,

          available:
            true,
        },

        reward:
          rewardAmount,

        wallet: {
          id:
            updatedWallet.id,

          user_id:
            updatedWallet.user_id,

          balance:
            remainingBalance,
        },

        transaction:
          transactionResult
            .rows[0],

        previous_balance:
          previousBalance,

        reward_amount:
          rewardAmount,

        remaining_balance:
          remainingBalance,

        qr:
          claimResult.rows[0],
      };
    } catch (error) {
      await client.query(
        "ROLLBACK"
      );

      throw error;
    } finally {
      client.release();
    }
  };

// =====================================================
// DELETE PRODUCT QR CODES
// =====================================================

const deleteQRCodesByProductId =
  async (productId) => {
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

    const result =
      await pool.query(
        `
        DELETE FROM product_qr_codes
        WHERE product_id = $1
        RETURNING *
        `,
        [numericProductId]
      );

    return result.rows;
  };

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createProductQRCodes,
  createAllProductQRCodes,
  getQRCodesByProductId,
  getQRByCode,
  claimQRCodeAndReward,
  deleteQRCodesByProductId,
};