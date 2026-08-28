const pool = require("../config/db");

// ==========================================
// GET CART FOR USER
// ==========================================

const getCartByUserId = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      c.id AS cart_id,
      ci.id AS cart_item_id,
      ci.product_id,
      ci.quantity,

      p.name,
      p.description,
      p.price,
      p.image,
      p.stock,
      p.category_id,

      cat.name AS category_name

    FROM carts c

    LEFT JOIN cart_items ci
      ON c.id = ci.cart_id

    LEFT JOIN products p
      ON ci.product_id = p.id

    LEFT JOIN categories cat
      ON p.category_id = cat.id

    WHERE c.user_id = $1

    ORDER BY ci.created_at ASC
    `,
    [userId]
  );

  return result.rows;
};


// ==========================================
// CREATE CART FOR USER
// ==========================================

const createCart = async (userId) => {
  const result = await pool.query(
    `
    INSERT INTO carts (user_id)
    VALUES ($1)
    ON CONFLICT (user_id)
    DO UPDATE SET updated_at = CURRENT_TIMESTAMP
    RETURNING *
    `,
    [userId]
  );

  return result.rows[0];
};


// ==========================================
// GET OR CREATE CART
// ==========================================

const getOrCreateCart = async (userId) => {
  let result = await pool.query(
    `
    SELECT *
    FROM carts
    WHERE user_id = $1
    `,
    [userId]
  );

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  return await createCart(userId);
};


// ==========================================
// ADD PRODUCT TO CART
// ==========================================

const addItemToCart = async (
  userId,
  productId,
  quantity
) => {
  const cart = await getOrCreateCart(userId);

  const result = await pool.query(
    `
    INSERT INTO cart_items
      (cart_id, product_id, quantity)

    VALUES
      ($1, $2, $3)

    ON CONFLICT (cart_id, product_id)

    DO UPDATE SET
      quantity = cart_items.quantity + EXCLUDED.quantity,
      updated_at = CURRENT_TIMESTAMP

    RETURNING *
    `,
    [
      cart.id,
      productId,
      quantity,
    ]
  );

  await pool.query(
    `
    UPDATE carts
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    `,
    [cart.id]
  );

  return result.rows[0];
};


// ==========================================
// UPDATE CART ITEM QUANTITY
// ==========================================

const updateCartItem = async (
  userId,
  productId,
  quantity
) => {
  const result = await pool.query(
    `
    UPDATE cart_items ci

    SET
      quantity = $1,
      updated_at = CURRENT_TIMESTAMP

    FROM carts c

    WHERE ci.cart_id = c.id
      AND c.user_id = $2
      AND ci.product_id = $3

    RETURNING ci.*
    `,
    [
      quantity,
      userId,
      productId,
    ]
  );

  return result.rows[0];
};


// ==========================================
// REMOVE PRODUCT FROM CART
// ==========================================

const removeCartItem = async (
  userId,
  productId
) => {
  const result = await pool.query(
    `
    DELETE FROM cart_items ci

    USING carts c

    WHERE ci.cart_id = c.id
      AND c.user_id = $1
      AND ci.product_id = $2

    RETURNING ci.*
    `,
    [
      userId,
      productId,
    ]
  );

  return result.rows[0];
};


// ==========================================
// CLEAR CART
// ==========================================

const clearUserCart = async (userId) => {
  const result = await pool.query(
    `
    DELETE FROM cart_items ci

    USING carts c

    WHERE ci.cart_id = c.id
      AND c.user_id = $1

    RETURNING ci.*
    `,
    [userId]
  );

  return result.rows;
};


module.exports = {
  getCartByUserId,
  createCart,
  getOrCreateCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearUserCart,
};