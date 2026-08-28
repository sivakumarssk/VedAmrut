const pool = require("../config/db");

// ========================================
// CREATE REVIEW
// ========================================

const createReview = async (
  product_id,
  user_id,
  rating,
  comment
) => {
  const result = await pool.query(
    `
    INSERT INTO reviews
    (
      product_id,
      user_id,
      rating,
      comment
    )
    VALUES
    ($1, $2, $3, $4)
    RETURNING *
    `,
    [
      product_id,
      user_id,
      rating,
      comment,
    ]
  );

  return result.rows[0];
};

// ========================================
// GET REVIEWS BY PRODUCT
// ========================================

const getReviewsByProductId = async (product_id) => {
  const result = await pool.query(
    `
    SELECT
      reviews.id,
      reviews.product_id,
      reviews.user_id,
      reviews.rating,
      reviews.comment,
      reviews.created_at,
      reviews.updated_at,

      users.name AS user_name

    FROM reviews

    LEFT JOIN users
      ON reviews.user_id = users.id

    WHERE reviews.product_id = $1

    ORDER BY reviews.created_at DESC
    `,
    [product_id]
  );

  return result.rows;
};

// ========================================
// GET REVIEW BY USER + PRODUCT
// ========================================

const getUserReviewForProduct = async (
  user_id,
  product_id
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM reviews
    WHERE user_id = $1
      AND product_id = $2
    LIMIT 1
    `,
    [
      user_id,
      product_id,
    ]
  );

  return result.rows[0];
};

// ========================================
// UPDATE REVIEW
// ========================================

const updateReview = async (
  id,
  user_id,
  rating,
  comment
) => {
  const result = await pool.query(
    `
    UPDATE reviews
    SET
      rating = $1,
      comment = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
      AND user_id = $4
    RETURNING *
    `,
    [
      rating,
      comment,
      id,
      user_id,
    ]
  );

  return result.rows[0];
};

// ========================================
// DELETE REVIEW
// ========================================

const deleteReview = async (
  id,
  user_id
) => {
  const result = await pool.query(
    `
    DELETE FROM reviews
    WHERE id = $1
      AND user_id = $2
    RETURNING *
    `,
    [
      id,
      user_id,
    ]
  );

  return result.rows[0];
};

// ========================================
// GET PRODUCT RATING
// ========================================

const getProductRating = async (
  product_id
) => {
  const result = await pool.query(
    `
    SELECT
      COALESCE(
        ROUND(AVG(rating)::numeric, 1),
        0
      ) AS average_rating,

      COUNT(*) AS review_count

    FROM reviews

    WHERE product_id = $1
    `,
    [product_id]
  );

  return result.rows[0];
};

module.exports = {
  createReview,
  getReviewsByProductId,
  getUserReviewForProduct,
  updateReview,
  deleteReview,
  getProductRating,
};