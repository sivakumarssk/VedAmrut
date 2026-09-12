// const crypto = require("crypto");
// const pool = require("../config/db");

// // =====================================================
// // CONFIG
// // =====================================================

// const WINNING_PERCENTAGE = 0.8;

// const REWARD_VALUES = [
//   1,
//   2,
//   3,
//   5,
//   7,
//   8,
//   10,
//   15,
// ];

// // =====================================================
// // SHUFFLE ARRAY
// // =====================================================

// const shuffleArray = (array) => {
//   const shuffled = [...array];

//   for (let i = shuffled.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));

//     [shuffled[i], shuffled[j]] = [
//       shuffled[j],
//       shuffled[i],
//     ];
//   }

//   return shuffled;
// };

// // =====================================================
// // GENERATE REWARDS BASED ON STOCK
// // =====================================================

// const generateRewardPattern = (quantity) => {
//   // 80% winning QR codes
//   const winningCount = Math.floor(
//     quantity * WINNING_PERCENTAGE
//   );

//   // Remaining 20% have no gift
//   const noGiftCount = quantity - winningCount;

//   const rewards = [];

//   // Generate winning rewards
//   for (let i = 0; i < winningCount; i++) {
//     const randomIndex = Math.floor(
//       Math.random() * REWARD_VALUES.length
//     );

//     rewards.push(REWARD_VALUES[randomIndex]);
//   }

//   // Generate Better Luck Next Time QR codes
//   for (let i = 0; i < noGiftCount; i++) {
//     rewards.push(0);
//   }

//   // Randomly distribute winners and no-gift QR codes
//   return shuffleArray(rewards);
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
//     // GET PRODUCT
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

//     // =================================================
//     // STOCK QUANTITY
//     // =================================================

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
//       SELECT
//         COUNT(*)::int AS count
//       FROM product_qr_codes
//       WHERE product_id = $1
//       `,
//       [numericProductId]
//     );

//     const existingCount =
//       Number(existingResult.rows[0].count);

//     // =================================================
//     // EXISTING GIFT QR COUNT
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
//     // MISSING QR COUNT
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
//     // LAST UNIT NUMBER
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
//     // TARGET GIFT COUNT
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
//     // NEW GIFT COUNT
//     // =================================================

//     const newGiftCount =
//       Math.min(
//         remainingGiftCount,
//         missingCount
//       );

//     // =================================================
//     // GENERATE UNIQUE REWARDS
//     // =================================================

//     const giftRewards =
//       newGiftCount > 0
//         ? generateUniqueRewards(
//             newGiftCount
//           )
//         : [];

//     // =================================================
//     // RANDOM GIFT POSITIONS
//     // =================================================

//     const giftUnits =
//       newGiftCount > 0
//         ? generateRandomGiftUnits(
//             nextUnitNumber,
//             missingCount,
//             newGiftCount
//           )
//         : [];

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

//       // ===============================================
//       // GENERATE UNIQUE QR TOKEN
//       // ===============================================

//       while (true) {
//         qrCode = generateQRToken();

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

//       // ===============================================
//       // UNIT NUMBER
//       // ===============================================

//       const unitNumber =
//         nextUnitNumber;

//       // ===============================================
//       // REWARD
//       // ===============================================

//       const rewardAmount =
//         giftUnitSet.has(unitNumber)
//           ? Number(
//               rewardMap.get(
//                 unitNumber
//               )
//             )
//           : 0;

//       // ===============================================
//       // INSERT
//       // ===============================================

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
// // CREATE QR CODES FOR ALL PRODUCTS
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
//       productId:
//         product.id,

//       productName:
//         product.name,

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
//             qrId:
//               gift.id,

//             unitNumber:
//               gift.unit_number,

//             rewardAmount:
//               Number(
//                 gift.reward_amount || 0
//               ),

//             isClaimed:
//               Boolean(
//                 gift.is_claimed
//               ),
//           })
//         ),
//     });
//   }

//   return {
//     totalProducts:
//       productsResult.rows.length,

//     products:
//       results,
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
//     // GET PRODUCT
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
//     // GET ALL QR CODES
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

//     // =================================================
//     // RESPONSE
//     // =================================================

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
//                 qr.reward_amount || 0
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

//             // IMPORTANT:
//             // Claimed status is independent
//             // from gift availability.
//             is_claimed:
//               Boolean(
//                 qr.is_claimed
//               ),

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
// // GET SINGLE QR DETAILS
// // =====================================================

// const getQRByCode = async (qrCode) => {
//   const normalizedQR =
//     String(
//       qrCode || ""
//     ).trim();

//   if (!normalizedQR) {
//     return null;
//   }

//   console.log(
//     "================================"
//   );

//   console.log(
//     "SEARCHING QR IN DATABASE"
//   );

//   console.log(
//     "QR CODE:",
//     normalizedQR
//   );

//   console.log(
//     "================================"
//   );

//   const result =
//     await pool.query(
//       `
//       SELECT
//         q.id,
//         q.product_id,
//         q.qr_code,
//         q.unit_number,
//         q.reward_amount,
//         q.is_claimed,
//         q.claimed_by,
//         q.claimed_at,
//         q.created_at,

//         p.name AS product_name,
//         p.description AS product_description,
//         p.price AS product_price,
//         p.image AS product_image,
//         p.stock AS product_stock,

//         p.category_id,
//         c.name AS category_name

//       FROM product_qr_codes q

//       INNER JOIN products p
//         ON q.product_id = p.id

//       LEFT JOIN categories c
//         ON p.category_id = c.id

//       WHERE TRIM(q.qr_code) = $1

//       LIMIT 1
//       `,
//       [normalizedQR]
//     );

//   // =================================================
//   // QR NOT FOUND
//   // =================================================

//   if (
//     result.rows.length === 0
//   ) {
//     console.log(
//       "❌ QR NOT FOUND"
//     );

//     console.log(
//       "SCANNED QR:",
//       normalizedQR
//     );

//     console.log(
//       "================================"
//     );

//     return null;
//   }

//   const row =
//     result.rows[0];

//   const reward =
//     Number(
//       row.reward_amount || 0
//     );

//   const isClaimed =
//     Boolean(
//       row.is_claimed
//     );

//   const hasGift =
//     Number.isFinite(reward) &&
//     reward > 0;

//   console.log(
//     "✅ QR FOUND"
//   );

//   console.log(
//     "QR ID:",
//     row.id
//   );

//   console.log(
//     "PRODUCT ID:",
//     row.product_id
//   );

//   console.log(
//     "PRODUCT:",
//     row.product_name
//   );

//   console.log(
//     "REWARD:",
//     reward
//   );

//   console.log(
//     "HAS GIFT:",
//     hasGift
//   );

//   console.log(
//     "CLAIMED:",
//     isClaimed
//   );

//   console.log(
//     "================================"
//   );

//   // =================================================
//   // RETURN
//   // =================================================

//   return {
//     id:
//       Number(row.id),

//     product_id:
//       Number(row.product_id),

//     qr_code:
//       row.qr_code,

//     unit_number:
//       Number(row.unit_number),

//     reward_amount:
//       reward,

//     gift_reward:
//       reward,

//     // IMPORTANT:
//     // Never calculate claimed from reward.
//     is_claimed:
//       isClaimed,

//     // Helpful frontend field
//     has_gift:
//       hasGift,

//     claimed_by:
//       row.claimed_by,

//     claimed_at:
//       row.claimed_at,

//     created_at:
//       row.created_at,

//     product: {
//       id:
//         Number(
//           row.product_id
//         ),

//       name:
//         row.product_name,

//       description:
//         row.product_description,

//       price:
//         Number(
//           row.product_price || 0
//         ),

//       image:
//         row.product_image,

//       stock:
//         Number(
//           row.product_stock || 0
//         ),

//       category_id:
//         row.category_id,

//       category_name:
//         row.category_name,
//     },

//     gift: {
//       amount:
//         reward,

//       available:
//         hasGift,
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

//       // =================================================
//       // NORMALIZE QR
//       // =================================================

//       const normalizedQR =
//         String(
//           qrCode || ""
//         ).trim();

//       // =================================================
//       // USER ID
//       // =================================================

//       const numericUserId =
//         Number(userId);

//       // =================================================
//       // VALIDATE QR
//       // =================================================

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

//       // =================================================
//       // VALIDATE USER
//       // =================================================

//       if (
//         !Number.isInteger(
//           numericUserId
//         ) ||
//         numericUserId <= 0
//       ) {
//         await client.query(
//           "ROLLBACK"
//         );

//         return {
//           success: false,
//           reason:
//             "INVALID_USER",
//         };
//       }

//       // =================================================
//       // VERIFY USER
//       // =================================================

//       const userResult =
//         await client.query(
//           `
//           SELECT
//             id
//           FROM users
//           WHERE id = $1
//           LIMIT 1
//           `,
//           [numericUserId]
//         );

//       if (
//         userResult.rows.length === 0
//       ) {
//         await client.query(
//           "ROLLBACK"
//         );

//         return {
//           success: false,
//           reason:
//             "USER_NOT_FOUND",
//         };
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
//             p.stock AS product_stock,

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

//       // =================================================
//       // QR NOT FOUND
//       // =================================================

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
//         Boolean(
//           qr.is_claimed
//         )
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

//           reward:
//             Number(
//               qr.reward_amount || 0
//             ),
//         };
//       }

//       // =================================================
//       // GET REWARD
//       // =================================================

//       const rewardAmount =
//         Number(
//           qr.reward_amount || 0
//         );

//       // =================================================
//       // NO GIFT
//       // =================================================

//       // if ( !Number.isFinite(
//       //     rewardAmount
//       //   ) ||
//       //   rewardAmount <= 0
//       // ) {
//       //   await client.query(
//       //     "ROLLBACK"
//       //   );

//       //   return {
//       //     success: false,

//       //     reason:
//       //       "NO_GIFT",

//       //     productName:
//       //       qr.product_name,

//       //     reward: 0,

//       //     is_claimed:
//       //       false,

//       //     has_gift:
//       //       false,
//       //   };
//       // }
// // =================================================
// // NO GIFT
// // =================================================

// if (
//   !Number.isFinite(rewardAmount) ||
//   rewardAmount <= 0
// ) {
//   // Mark QR as claimed even though
//   // there is no gift/reward.
//   const claimNoGiftResult =
//     await client.query(
//       `
//       UPDATE product_qr_codes
//       SET
//         is_claimed = TRUE,
//         claimed_by = $1,
//         claimed_at = CURRENT_TIMESTAMP
//       WHERE id = $2
//         AND is_claimed = FALSE
//       RETURNING *
//       `,
//       [
//         numericUserId,
//         qr.id,
//       ]
//     );

//   // Another request may have claimed it
//   if (
//     claimNoGiftResult.rows.length === 0
//   ) {
//     await client.query("ROLLBACK");

//     return {
//       success: false,
//       reason: "ALREADY_CLAIMED",
//     };
//   }

//   await client.query("COMMIT");

//   console.log(
//     "================================"
//   );

//   console.log(
//     "QR MARKED AS CLAIMED - NO GIFT"
//   );

//   console.log(
//     "USER:",
//     numericUserId
//   );

//   console.log(
//     "PRODUCT:",
//     qr.product_name
//   );

//   console.log(
//     "QR:",
//     normalizedQR
//   );

//   console.log(
//     "REWARD: 0"
//   );

//   console.log(
//     "================================"
//   );

//   return {
//     success: true,

//     message:
//       "QR scanned successfully. No gift is available.",

//     product: {
//       id:
//         Number(qr.product_id),

//       name:
//         qr.product_name,

//       description:
//         qr.product_description,

//       price:
//         Number(
//           qr.product_price || 0
//         ),

//       image:
//         qr.product_image,

//       stock:
//         Number(
//           qr.product_stock || 0
//         ),

//       category_name:
//         qr.category_name,
//     },

//     gift: {
//       amount: 0,
//       available: false,
//     },

//     reward: 0,

//     reward_amount: 0,

//     is_claimed: true,

//     has_gift: false,

//     qr:
//       claimNoGiftResult.rows[0],
//   };
// }
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

//       // =================================================
//       // CREATE WALLET IF NEEDED
//       // =================================================

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

//       // =================================================
//       // PREVIOUS BALANCE
//       // =================================================

//       const previousBalance =
//         Number(
//           wallet.balance || 0
//         );

//       // =================================================
//       // MARK QR AS CLAIMED
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
//             AND is_claimed = FALSE
//           RETURNING *
//           `,
//           [
//             numericUserId,
//             qr.id,
//           ]
//         );

//       // =================================================
//       // CLAIM FAILED
//       // =================================================

//       if (
//         claimResult.rows.length === 0
//       ) {
//         await client.query(
//           "ROLLBACK"
//         );

//         return {
//           success: false,
//           reason:
//             "ALREADY_CLAIMED",
//         };
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

//       if (
//         walletUpdateResult.rows.length === 0
//       ) {
//         throw new Error(
//           "Failed to update wallet"
//         );
//       }

//       const updatedWallet =
//         walletUpdateResult
//           .rows[0];

//       // =================================================
//       // REMAINING BALANCE
//       // =================================================

//       const remainingBalance =
//         Number(
//           updatedWallet.balance || 0
//         );

//       // =================================================
//       // WALLET TRANSACTION
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

//       // =================================================
//       // LOG
//       // =================================================

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

//       // =================================================
//       // SUCCESS RESPONSE
//       // =================================================

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

//           stock:
//             Number(
//               qr.product_stock || 0
//             ),

//           category_name:
//             qr.category_name,
//         },

//         gift: {
//           amount:
//             rewardAmount,

//           available:
//             true,
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
// // MARK QR CODE AS CLAIMED AFTER SCRATCHING
// // =====================================================

// const markQRCodeClaimed = async (
//   qrCode,
//   userId
// ) => {
//   const client = await pool.connect();

//   try {
//     await client.query("BEGIN");

//     const normalizedQR =
//       String(qrCode || "").trim();

//     const numericUserId =
//       Number(userId);

//     // =================================================
//     // VALIDATE QR
//     // =================================================

//     if (!normalizedQR) {
//       await client.query("ROLLBACK");

//       return {
//         success: false,
//         reason: "INVALID_QR",
//       };
//     }

//     // =================================================
//     // VALIDATE USER
//     // =================================================

//     if (
//       !Number.isInteger(numericUserId) ||
//       numericUserId <= 0
//     ) {
//       await client.query("ROLLBACK");

//       return {
//         success: false,
//         reason: "INVALID_USER",
//       };
//     }

//     // =================================================
//     // VERIFY USER
//     // =================================================

//     const userResult =
//       await client.query(
//         `
//         SELECT id
//         FROM users
//         WHERE id = $1
//         LIMIT 1
//         `,
//         [numericUserId]
//       );

//     if (userResult.rows.length === 0) {
//       await client.query("ROLLBACK");

//       return {
//         success: false,
//         reason: "USER_NOT_FOUND",
//       };
//     }

//     // =================================================
//     // GET AND LOCK QR
//     // =================================================

//     const qrResult =
//       await client.query(
//         `
//         SELECT
//           q.*,
//           p.name AS product_name
//         FROM product_qr_codes q
//         INNER JOIN products p
//           ON q.product_id = p.id
//         WHERE TRIM(q.qr_code) = $1
//         FOR UPDATE OF q
//         `,
//         [normalizedQR]
//       );

//     // =================================================
//     // QR NOT FOUND
//     // =================================================

//     if (qrResult.rows.length === 0) {
//       await client.query("ROLLBACK");

//       return {
//         success: false,
//         reason: "NOT_FOUND",
//       };
//     }

//     const qr = qrResult.rows[0];

//     // =================================================
//     // ALREADY CLAIMED
//     // =================================================

//     if (Boolean(qr.is_claimed)) {
//       await client.query("ROLLBACK");

//       return {
//         success: false,
//         reason: "ALREADY_CLAIMED",

//         productName:
//           qr.product_name,

//         claimedBy:
//           qr.claimed_by,

//         claimedAt:
//           qr.claimed_at,

//         reward:
//           Number(
//             qr.reward_amount || 0
//           ),
//       };
//     }

//     // =================================================
//     // MARK AS CLAIMED
//     // =================================================

//     const updateResult =
//       await client.query(
//         `
//         UPDATE product_qr_codes
//         SET
//           is_claimed = TRUE,
//           claimed_by = $1,
//           claimed_at = CURRENT_TIMESTAMP
//         WHERE id = $2
//           AND is_claimed = FALSE
//         RETURNING *
//         `,
//         [
//           numericUserId,
//           qr.id,
//         ]
//       );

//     if (updateResult.rows.length === 0) {
//       await client.query("ROLLBACK");

//       return {
//         success: false,
//         reason: "ALREADY_CLAIMED",
//       };
//     }

//     await client.query("COMMIT");

//     const updatedQR =
//       updateResult.rows[0];

//     const reward =
//       Number(
//         updatedQR.reward_amount || 0
//       );

//     const hasGift =
//       Number.isFinite(reward) &&
//       reward > 0;

//     console.log(
//       "================================"
//     );

//     console.log(
//       "QR MARKED AS CLAIMED AFTER SCRATCH"
//     );

//     console.log(
//       "QR:",
//       normalizedQR
//     );

//     console.log(
//       "USER:",
//       numericUserId
//     );

//     console.log(
//       "PRODUCT:",
//       qr.product_name
//     );

//     console.log(
//       "REWARD:",
//       reward
//     );

//     console.log(
//       "HAS GIFT:",
//       hasGift
//     );

//     console.log(
//       "================================"
//     );

//     return {
//       success: true,

//       message:
//         "QR marked as claimed successfully.",

//       is_claimed: true,

//       has_gift:
//         hasGift,

//       reward:
//         reward,

//       reward_amount:
//         reward,

//       claimed_by:
//         updatedQR.claimed_by,

//       claimed_at:
//         updatedQR.claimed_at,

//       qr:
//         updatedQR,
//     };
//   } catch (error) {
//     await client.query("ROLLBACK");
//     throw error;
//   } finally {
//     client.release();
//   }
// };

// // =====================================================
// // DELETE PRODUCT QR CODES
// // =====================================================

// const deleteQRCodesByProductId =
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

//     const result =
//       await pool.query(
//         `
//         DELETE FROM product_qr_codes
//         WHERE product_id = $1
//         RETURNING *
//         `,
//         [numericProductId]
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
//     markQRCodeClaimed,
//   deleteQRCodesByProductId,
// };

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

const generateQRToken = () => {
  return `VA-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
};

const createProductQRCodes = async (
  productId,
  requestedStock = null
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

    // Generate rewards based on the missing stock quantity
    const rewards = generateRewardPattern(
      missingCount
    );

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
          "credit",
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

module.exports = {
  createProductQRCodes,
  createAllProductQRCodes,
  getQRCodesByProductId,
  getQRByCode,
  claimQRCodeAndReward,
  markQRCodeClaimed,
  deleteQRCodesByProductId,
};