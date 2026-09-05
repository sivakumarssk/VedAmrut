


    const pool = require("../config/db");

// ========================================
// CREATE PRODUCT
// ========================================
  const createProduct = async (
  name,
  description,
  price,
  old_price,
  image,
  stock,
  category_id,
  reward_amount = 0
) => {
  const result = await pool.query(
    `
   INSERT INTO products
(
  name,
  description,
  price,
  old_price,
  image,
  stock,
  category_id,
  reward_amount
)
VALUES
($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
    `,
   [
  name,
  description,
  price,
  old_price,
  image,
  stock,
  category_id,
  reward_amount,
]
  );

  return result.rows[0];
};

// ========================================
// GET ALL PRODUCTS
// ========================================

const getAllProducts = async () => {
  const result = await pool.query(
    `
    SELECT
      products.*,
      categories.name AS category_name,

      COALESCE(
        ROUND(AVG(reviews.rating)::numeric, 1),
        0
      ) AS rating,

      COUNT(reviews.id) AS review_count

    FROM products

    LEFT JOIN categories
      ON products.category_id = categories.id

    LEFT JOIN reviews
      ON products.id = reviews.product_id

    GROUP BY
      products.id,
      categories.name

    ORDER BY products.id ASC
    `
  );

  return result.rows;
};
// ========================================
// GET PRODUCT BY ID
// ========================================


const getProductById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      products.*,
      categories.name AS category_name,

      COALESCE(
        ROUND(AVG(reviews.rating)::numeric, 1),
        0
      ) AS rating,

      COUNT(reviews.id) AS review_count

    FROM products

    LEFT JOIN categories
      ON products.category_id = categories.id

    LEFT JOIN reviews
      ON products.id = reviews.product_id

    WHERE products.id = $1

    GROUP BY
      products.id,
      categories.name
    `,
    [id]
  );

  return result.rows[0];
};
// ========================================
// UPDATE PRODUCT
// ========================================

const updateProduct = async (
  id,
  name,
  description,
  price,
  old_price,
  image,
  stock,
  category_id,
  reward_amount = 0
) => {
  const result = await pool.query(
    `
    UPDATE products
   SET
  name = $1,
  description = $2,
  price = $3,
  old_price = $4,
  image = $5,
  stock = $6,
  category_id = $7,
  reward_amount = $8,
  updated_at = CURRENT_TIMESTAMP
WHERE id = $9
    RETURNING *
    `,
    [
  name,
  description,
  price,
  old_price,
  image,
  stock,
  category_id,
  reward_amount,
  id,
]
  );

  return result.rows[0];
};

// ========================================
// DELETE PRODUCT
// ========================================

const deleteProduct = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM products
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};

// ========================================
// SEARCH PRODUCTS
// ========================================


const searchProducts = async (query) => {
  const result = await pool.query(
    `
    SELECT
      products.*,
      categories.name AS category_name,

      COALESCE(
        ROUND(AVG(reviews.rating)::numeric, 1),
        0
      ) AS rating,

      COUNT(reviews.id) AS review_count

    FROM products

    LEFT JOIN categories
      ON products.category_id = categories.id

    LEFT JOIN reviews
      ON products.id = reviews.product_id

    WHERE
      products.name ILIKE $1
      OR products.description ILIKE $1
      OR categories.name ILIKE $1

    GROUP BY
      products.id,
      categories.name

    ORDER BY products.id ASC
    `,
    [`%${query}%`]
  );

  return result.rows;
};
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
};