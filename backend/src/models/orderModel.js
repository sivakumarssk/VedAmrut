

const pool = require("../config/db");

// =====================================================
// CREATE ORDER FROM CART
// =====================================================
  const createOrderFromCart = async (
  userId,
  address,
  paymentMethod = "COD",
  buyNowProductId = null,
  buyNowQuantity = 1
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("================================");
    console.log("CREATE ORDER FROM CART");
    console.log("USER ID:", userId);
    console.log("ADDRESS:", address);
    console.log("PAYMENT:", paymentMethod);
console.log("BUY NOW PRODUCT ID:", buyNowProductId);
console.log(
  "BUY NOW PRODUCT ID TYPE:",
  typeof buyNowProductId
);
console.log("BUY NOW QUANTITY:", buyNowQuantity);
    // =================================================
    // GET CART
    // =================================================
let cartItems;

if (
  buyNowProductId !== null &&
  buyNowProductId !== undefined
) {

  // =================================================
  // BUY NOW → GET ONLY SELECTED PRODUCT
  // DO NOT READ FROM CART
  // =================================================

  console.log("================================");
  console.log("BUY NOW ORDER");
  console.log("PRODUCT ID:", buyNowProductId);
  console.log("QUANTITY:", buyNowQuantity);

  const productResult = await client.query(
    `
    SELECT
      p.id AS product_id,
      p.name,
      p.price,
      p.stock
    FROM products p
    WHERE p.id = $1
    FOR UPDATE
    `,
    [Number(buyNowProductId)]
  );

  if (productResult.rows.length === 0) {
    throw new Error("Product not found");
  }

  const product = productResult.rows[0];

  cartItems = [
    {
      cart_item_id: null,
      product_id: product.product_id,
      quantity: Number(buyNowQuantity),
      name: product.name,
      price: product.price,
      stock: product.stock,
    },
  ];

  console.log(
    "BUY NOW ITEM:",
    cartItems
  );

} else {

  // =================================================
  // NORMAL CART CHECKOUT → GET ENTIRE CART
  // =================================================

  const cartResult = await client.query(
    `
    SELECT
      ci.id AS cart_item_id,
      ci.product_id,
      ci.quantity,
      p.name,
      p.price,
      p.stock
    FROM carts c
    INNER JOIN cart_items ci
      ON c.id = ci.cart_id
    INNER JOIN products p
      ON ci.product_id = p.id
    WHERE c.user_id = $1
    FOR UPDATE
    `,
    [userId]
  );

  cartItems = cartResult.rows;

  console.log(
    "CART ITEMS FOUND:",
    cartItems
  );
}
    // =================================================
    // CHECK CART
    // =================================================

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // =================================================
    // CHECK STOCK + TOTAL
    // =================================================

    let totalAmount = 0;

    for (const item of cartItems) {
      const quantity = Number(item.quantity);
      const price = Number(item.price);

      if (quantity <= 0) {
        throw new Error(
          `Invalid quantity for ${item.name}`
        );
      }

      if (
        item.stock !== null &&
        quantity > Number(item.stock)
      ) {
        throw new Error(
          `Insufficient stock for ${item.name}`
        );
      }

      totalAmount += price * quantity;
    }

    // Make sure total has normal money precision
    totalAmount = Number(
      totalAmount.toFixed(2)
    );

    console.log(
      "TOTAL AMOUNT:",
      totalAmount
    );

    // =================================================
    // FORMAT ADDRESS
    // =================================================

    const addressLine = [
      address.address_line1,
      address.address_line2,
    ]
      .filter(Boolean)
      .join(", ");

    const area = "";

    // =================================================
    // WALLET PAYMENT
    // IMPORTANT:
    // Wallet deduction happens INSIDE the SAME
    // database transaction as order creation.
    // =================================================

    let wallet = null;
    let previousWalletBalance = null;
    let walletTransaction = null;

    if (
      paymentMethod.toUpperCase() === "WALLET"
    ) {
      console.log(
        "================================"
      );

      console.log(
        "WALLET PAYMENT STARTED"
      );

      console.log(
        "USER ID:",
        userId
      );

      console.log(
        "PAYMENT AMOUNT:",
        totalAmount
      );

      // -----------------------------------------------
      // GET / LOCK WALLET
      // -----------------------------------------------

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

      if (
        walletResult.rows.length === 0
      ) {
        throw new Error(
          "Wallet not found"
        );
      }

      wallet =
        walletResult.rows[0];

      const currentBalance =
        Number(wallet.balance);

      previousWalletBalance =
        currentBalance;

      console.log(
        "CURRENT WALLET BALANCE:",
        currentBalance
      );

      // -----------------------------------------------
      // CHECK BALANCE
      // -----------------------------------------------

      if (
        currentBalance < totalAmount
      ) {
        throw new Error(
          `Insufficient wallet balance. Available: ₹${currentBalance.toFixed(
            2
          )}, Required: ₹${totalAmount.toFixed(
            2
          )}`
        );
      }

      // -----------------------------------------------
      // DEDUCT WALLET
      // -----------------------------------------------

      const walletUpdateResult =
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
            totalAmount,
            wallet.id,
          ]
        );

      wallet =
        walletUpdateResult.rows[0];

      console.log(
        "WALLET BALANCE AFTER PAYMENT:",
        wallet.balance
      );

      // -----------------------------------------------
      // CREATE WALLET DEBIT TRANSACTION
      // -----------------------------------------------

      const walletTransactionResult =
        await client.query(
          `
          INSERT INTO wallet_transactions
          (
            wallet_id,
            user_id,
            amount,
            transaction_type,
            description
          )
          VALUES
          (
            $1,
            $2,
            $3,
            'DEBIT',
            $4
          )
          RETURNING *
          `,
          [
            wallet.id,
            userId,
            totalAmount,
            "Wallet payment for order",
          ]
        );

      walletTransaction =
        walletTransactionResult.rows[0];

      console.log(
        "WALLET DEBIT TRANSACTION CREATED:",
        walletTransaction
      );

      console.log(
        "WALLET PAYMENT COMPLETED"
      );

      console.log(
        "================================"
      );
    }

    // =================================================
    // CREATE ORDER
    // =================================================

    const orderResult =
      await client.query(
        `
        INSERT INTO orders (
          user_id,
          full_name,
          phone,
          address_line,
          area,
          city,
          state,
          pincode,
          total_amount,
          payment_method,
          status
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          'pending'
        )
        RETURNING *
        `,
        [
          userId,
          address.full_name || "",
          address.phone || "",
          addressLine,
          area,
          address.city || "",
          address.state || "",
          address.pincode || "",
          totalAmount,
          paymentMethod.toUpperCase(),
        ]
      );

    const order =
      orderResult.rows[0];

    console.log(
      "ORDER CREATED:",
      order
    );

    // =================================================
    // UPDATE WALLET TRANSACTION DESCRIPTION
    // WITH ORDER ID
    // =================================================

    if (walletTransaction) {
      const updatedWalletTransaction =
        await client.query(
          `
          UPDATE wallet_transactions
          SET
            description = $1
          WHERE id = $2
          RETURNING *
          `,
          [
            `Wallet payment - Order #${order.id}`,
            walletTransaction.id,
          ]
        );

      walletTransaction =
        updatedWalletTransaction.rows[0];
    }

    // =================================================
    // CREATE ORDER ITEMS
    // =================================================

    for (const item of cartItems) {
      const price =
        Number(item.price);

      const quantity =
        Number(item.quantity);

      await client.query(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          quantity,
          price
        )
        VALUES (
          $1,
          $2,
          $3,
          $4
        )
        `,
        [
          order.id,
          item.product_id,
          quantity,
          price,
        ]
      );

      // =================================================
      // REDUCE STOCK
      // =================================================

      await client.query(
        `
        UPDATE products
        SET
          stock = stock - $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        `,
        [
          quantity,
          item.product_id,
        ]
      );
    }

    // =================================================
    // CLEAR CART
    // =================================================

    // await client.query(
    //   `
    //   DELETE FROM cart_items
    //   WHERE cart_id = (
    //     SELECT id
    //     FROM carts
    //     WHERE user_id = $1
    //   )
    //   `,
    //   [userId]
    // );

    // console.log(
    //   "CART CLEARED AFTER ORDER"
    // );
// =================================================
// CLEAR CART
// =================================================

if (
  buyNowProductId !== null &&
  buyNowProductId !== undefined
) {
  // -------------------------------------------------
  // BUY NOW
  // -------------------------------------------------
  // Do NOT remove anything from cart.
  // Existing cart must remain unchanged.
  // -------------------------------------------------

  console.log(
    "BUY NOW ORDER → CART LEFT UNCHANGED"
  );

} else {

  // -------------------------------------------------
  // NORMAL CART CHECKOUT
  // -------------------------------------------------

  await client.query(
    `
    DELETE FROM cart_items
    WHERE cart_id = (
      SELECT id
      FROM carts
      WHERE user_id = $1
    )
    `,
    [userId]
  );

  console.log(
    "NORMAL CART ORDER → CART CLEARED"
  );
}
    // =================================================
    // COMMIT
    // =================================================

    await client.query("COMMIT");

    console.log(
      "ORDER PLACED SUCCESSFULLY"
    );

    console.log("================================");

    return {
      order,
      items: cartItems,
      address,

      // Wallet information is returned
      // only when wallet payment was used.
      wallet: wallet
        ? {
            previous_balance:
              previousWalletBalance,

            paid_amount:
              totalAmount,

            remaining_balance:
              Number(wallet.balance),
          }
        : null,

      walletTransaction:
        walletTransaction || null,
    };

  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    throw error;

  } finally {
    client.release();
  }
};
// =====================================================
// GET MY ORDERS
// =====================================================

const getOrdersByUserId = async (
  userId
) => {
  const result = await pool.query(
    `
    SELECT
      o.*
    FROM orders o
    WHERE o.user_id = $1
    ORDER BY o.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

// =====================================================
// GET SINGLE ORDER
// =====================================================

const getOrderById = async (
  userId,
  orderId
) => {
  const orderResult = await pool.query(
    `
    SELECT
      *
    FROM orders
    WHERE id = $1
      AND user_id = $2
    `,
    [
      orderId,
      userId,
    ]
  );

  if (
    orderResult.rows.length === 0
  ) {
    return null;
  }

  const order =
    orderResult.rows[0];

  // =================================================
  // GET ORDER ITEMS
  // =================================================

  const itemsResult = await pool.query(
    `
    SELECT
      oi.id,
      oi.order_id,
      oi.product_id,
      oi.quantity,
      oi.price,
      oi.created_at,
      p.name,
      p.image
    FROM order_items oi
    LEFT JOIN products p
      ON oi.product_id = p.id
    WHERE oi.order_id = $1
    ORDER BY oi.id ASC
    `,
    [orderId]
  );

  return {
    ...order,
    items: itemsResult.rows,
  };
};

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

// const updateOrderStatus = async (
//   orderId,
//   status
// ) => {
//   const result = await pool.query(
//     `
//     UPDATE orders
//     SET
//       status = $1,
//       updated_at = CURRENT_TIMESTAMP
//     WHERE id = $2
//     RETURNING *
//     `,
//     [
//       status,
//       orderId,
//     ]
//   );

//   return result.rows[0];
// };

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const updateOrderStatus = async (orderId, status) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("================================");
    console.log("UPDATE ORDER STATUS");
    console.log("ORDER ID:", orderId);
    console.log("NEW STATUS:", status);

    // =================================================
    // GET ORDER
    // =================================================

    const orderResult = await client.query(
      `
      SELECT *
      FROM orders
      WHERE id = $1
      FOR UPDATE
      `,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      throw new Error("Order not found");
    }

    const order = orderResult.rows[0];

    console.log("CURRENT STATUS:", order.status);

    // =================================================
    // VALID STATUSES
    // =================================================

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid order status: ${status}`
      );
    }

    // =================================================
    // SAME STATUS
    // =================================================

    if (order.status === status) {
      throw new Error(
        `Order is already ${status}`
      );
    }

    // =================================================
    // CANCELLATION RULE
    // =================================================

    if (status === "cancelled") {

      // Only pending and confirmed can be cancelled

      if (
        order.status !== "pending" &&
        order.status !== "confirmed"
      ) {
        throw new Error(
          `Order cannot be cancelled because its current status is ${order.status}`
        );
      }

      console.log(
        "CANCELLING ORDER - RESTORING STOCK"
      );

      // =================================================
      // GET ORDER ITEMS
      // =================================================

      const itemsResult = await client.query(
        `
        SELECT
          product_id,
          quantity
        FROM order_items
        WHERE order_id = $1
        `,
        [orderId]
      );

      console.log(
        "ORDER ITEMS:",
        itemsResult.rows
      );

      // =================================================
      // RESTORE STOCK
      // =================================================

      for (const item of itemsResult.rows) {

        await client.query(
          `
          UPDATE products
          SET
            stock = COALESCE(stock, 0) + $1,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
          `,
          [
            item.quantity,
            item.product_id,
          ]
        );

        console.log(
          `RESTORED STOCK: Product ${item.product_id} +${item.quantity}`
        );
      }
    }

    // =================================================
    // DELIVERED ORDER PROTECTION
    // =================================================

    if (
      order.status === "delivered" &&
      status !== "delivered"
    ) {
      throw new Error(
        "Delivered order cannot be changed"
      );
    }

    // =================================================
    // CANCELLED ORDER PROTECTION
    // =================================================

    if (
      order.status === "cancelled"
    ) {
      throw new Error(
        "Cancelled order cannot be changed"
      );
    }

    // =================================================
    // UPDATE ORDER
    // =================================================

    const updateResult = await client.query(
      `
      UPDATE orders
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [
        status,
        orderId,
      ]
    );

    const updatedOrder =
      updateResult.rows[0];

    // =================================================
    // COMMIT
    // =================================================

    await client.query("COMMIT");

    console.log(
      "ORDER STATUS UPDATED SUCCESSFULLY"
    );

    console.log(
      "UPDATED ORDER:",
      updatedOrder
    );

    console.log("================================");

    return updatedOrder;

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(
      "UPDATE ORDER STATUS ERROR:",
      error
    );

    throw error;

  } finally {

    client.release();

  }
};
// =====================================================
// CANCEL ORDER
// =====================================================

// const cancelOrder = async (userId, orderId) => {
//   const client = await pool.connect();

//   try {
//     await client.query("BEGIN");

//     console.log("================================");
//     console.log("CANCEL ORDER");
//     console.log("USER ID:", userId);
//     console.log("ORDER ID:", orderId);

//     // =================================================
//     // GET ORDER
//     // =================================================

//     const orderResult = await client.query(
//       `
//       SELECT *
//       FROM orders
//       WHERE id = $1
//         AND user_id = $2
//       FOR UPDATE
//       `,
//       [orderId, userId]
//     );

//     if (orderResult.rows.length === 0) {
//       throw new Error("Order not found");
//     }

//     const order = orderResult.rows[0];

//     console.log("ORDER FOUND:", order);

//     // =================================================
//     // CHECK STATUS
//     // =================================================

//     const currentStatus = order.status.toLowerCase();

//     if (
//       currentStatus === "cancelled"
//     ) {
//       throw new Error("Order is already cancelled");
//     }

//     if (
//       currentStatus === "shipped" ||
//       currentStatus === "delivered"
//     ) {
//       throw new Error(
//         "This order cannot be cancelled"
//       );
//     }

//     // =================================================
//     // GET ORDER ITEMS
//     // =================================================

//     const itemsResult = await client.query(
//       `
//       SELECT
//         product_id,
//         quantity
//       FROM order_items
//       WHERE order_id = $1
//       `,
//       [orderId]
//     );

//     const items = itemsResult.rows;

//     console.log("ORDER ITEMS:", items);

//     // =================================================
//     // RESTORE STOCK
//     // =================================================

//     for (const item of items) {
//       await client.query(
//         `
//         UPDATE products
//         SET
//           stock = stock + $1,
//           updated_at = CURRENT_TIMESTAMP
//         WHERE id = $2
//         `,
//         [
//           Number(item.quantity),
//           item.product_id,
//         ]
//       );

//       console.log(
//         "STOCK RESTORED:",
//         item.product_id,
//         item.quantity
//       );
//     }

//     // =================================================
//     // UPDATE ORDER STATUS
//     // =================================================

//     const updateResult = await client.query(
//       `
//       UPDATE orders
//       SET
//         status = 'cancelled',
//         updated_at = CURRENT_TIMESTAMP
//       WHERE id = $1
//         AND user_id = $2
//       RETURNING *
//       `,
//       [orderId, userId]
//     );

//     // =================================================
//     // COMMIT
//     // =================================================

//     await client.query("COMMIT");

//     console.log(
//       "ORDER CANCELLED SUCCESSFULLY"
//     );

//     console.log("================================");

//     return updateResult.rows[0];

//   } catch (error) {
//     await client.query("ROLLBACK");

//     console.error(
//       "CANCEL ORDER ERROR:",
//       error
//     );

//     throw error;

//   } finally {
//     client.release();
//   }
// };

const cancelOrder = async (
  userId,
  orderId
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("================================");
    console.log("CANCEL ORDER");
    console.log("USER ID:", userId);
    console.log("ORDER ID:", orderId);

    // =================================================
    // GET ORDER
    // =================================================

    const orderResult =
      await client.query(
        `
        SELECT *
        FROM orders
        WHERE id = $1
          AND user_id = $2
        FOR UPDATE
        `,
        [
          orderId,
          userId,
        ]
      );

    if (
      orderResult.rows.length === 0
    ) {
      throw new Error(
        "Order not found"
      );
    }

    const order =
      orderResult.rows[0];

    console.log(
      "ORDER FOUND:",
      order
    );

    // =================================================
    // CHECK STATUS
    // =================================================

    const currentStatus =
      String(order.status).toLowerCase();

    if (
      currentStatus === "cancelled"
    ) {
      throw new Error(
        "Order is already cancelled"
      );
    }

    if (
      currentStatus === "shipped" ||
      currentStatus === "delivered"
    ) {
      throw new Error(
        "This order cannot be cancelled"
      );
    }

    // =================================================
    // GET ORDER ITEMS
    // =================================================

    const itemsResult =
      await client.query(
        `
        SELECT
          product_id,
          quantity
        FROM order_items
        WHERE order_id = $1
        `,
        [orderId]
      );

    const items =
      itemsResult.rows;

    console.log(
      "ORDER ITEMS:",
      items
    );

    // =================================================
    // RESTORE STOCK
    // =================================================

    for (const item of items) {
      await client.query(
        `
        UPDATE products
        SET
          stock =
            COALESCE(stock, 0) + $1,
          updated_at =
            CURRENT_TIMESTAMP
        WHERE id = $2
        `,
        [
          Number(item.quantity),
          item.product_id,
        ]
      );

      console.log(
        "STOCK RESTORED:",
        item.product_id,
        item.quantity
      );
    }

    // =================================================
    // REFUND WALLET
    // =================================================

    let walletRefund = null;

    if (
      String(order.payment_method).toUpperCase() ===
      "WALLET"
    ) {
      console.log(
        "================================"
      );

      console.log(
        "WALLET REFUND STARTED"
      );

      const refundAmount =
        Number(order.total_amount);

      // -----------------------------------------------
      // LOCK USER WALLET
      // -----------------------------------------------

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

      if (
        walletResult.rows.length === 0
      ) {
        throw new Error(
          "Wallet not found for refund"
        );
      }

      const wallet =
        walletResult.rows[0];

      const previousBalance =
        Number(wallet.balance);

      // -----------------------------------------------
      // ADD MONEY BACK
      // -----------------------------------------------

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
            refundAmount,
            wallet.id,
          ]
        );

      const updatedWallet =
        walletUpdateResult.rows[0];

      // -----------------------------------------------
      // CREATE CREDIT TRANSACTION
      // -----------------------------------------------

      const transactionResult =
        await client.query(
          `
          INSERT INTO wallet_transactions
          (
            wallet_id,
            user_id,
            amount,
            transaction_type,
            description
          )
          VALUES
          (
            $1,
            $2,
            $3,
            'CREDIT',
            $4
          )
          RETURNING *
          `,
          [
            wallet.id,
            userId,
            refundAmount,
            `Wallet refund - Order #${order.id}`,
          ]
        );

      walletRefund = {
        previous_balance:
          previousBalance,

        refund_amount:
          refundAmount,

        remaining_balance:
          Number(
            updatedWallet.balance
          ),

        transaction:
          transactionResult.rows[0],
      };

      console.log(
        "WALLET REFUND COMPLETED:",
        walletRefund
      );

      console.log(
        "================================"
      );
    }

    // =================================================
    // UPDATE ORDER STATUS
    // =================================================

    const updateResult =
      await client.query(
        `
        UPDATE orders
        SET
          status = 'cancelled',
          updated_at =
            CURRENT_TIMESTAMP
        WHERE id = $1
          AND user_id = $2
        RETURNING *
        `,
        [
          orderId,
          userId,
        ]
      );

    // =================================================
    // COMMIT
    // =================================================

    await client.query("COMMIT");

    console.log(
      "ORDER CANCELLED SUCCESSFULLY"
    );

    console.log("================================");

    return {
      order:
        updateResult.rows[0],

      walletRefund,
    };

  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "CANCEL ORDER ERROR:",
      error
    );

    throw error;

  } finally {
    client.release();
  }
};
// =====================================================
// GET ALL ORDERS - ADMIN
// =====================================================

const getAllOrders = async () => {
  const result = await pool.query(
    `
    SELECT
      o.id,
      o.user_id,
      o.full_name,
      o.phone,
      o.address_line,
      o.area,
      o.city,
      o.state,
      o.pincode,
      o.total_amount,
      o.payment_method,
      o.status,
      o.created_at,
      o.updated_at
    FROM orders o
    ORDER BY o.created_at DESC
    `
  );

  return result.rows;
};
// =====================================================
// GET SINGLE ORDER - ADMIN
// NO ADMIN LOGIN
// =====================================================

const getAdminOrderById = async (orderId) => {
  // ===================================================
  // GET ORDER
  // ===================================================

  const orderResult = await pool.query(
    `
    SELECT
      o.id,
      o.user_id,
      o.full_name,
      o.phone,
      o.address_line,
      o.area,
      o.city,
      o.state,
      o.pincode,
      o.total_amount,
      o.payment_method,
      o.status,
      o.created_at,
      o.updated_at
    FROM orders o
    WHERE o.id = $1
    `,
    [orderId]
  );

  if (orderResult.rows.length === 0) {
    return null;
  }

  const order = orderResult.rows[0];

  // ===================================================
  // GET ORDER ITEMS
  // ===================================================

  const itemsResult = await pool.query(
    `
    SELECT
      oi.id,
      oi.order_id,
      oi.product_id,
      oi.quantity,
      oi.price,
      oi.created_at,
      p.name,
      p.image
    FROM order_items oi
    LEFT JOIN products p
      ON oi.product_id = p.id
    WHERE oi.order_id = $1
    ORDER BY oi.id ASC
    `,
    [orderId]
  );

  return {
    ...order,
    items: itemsResult.rows,
  };
};
// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createOrderFromCart,
  getOrdersByUserId,
  getOrderById,
   getAllOrders,
    getAdminOrderById,
  updateOrderStatus,
  cancelOrder,
};