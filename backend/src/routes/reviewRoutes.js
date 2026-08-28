const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  addReview,
  getProductReviews,
  getProductRatingController,
  getMyReview,
  editReview,
  removeReview,
} = require("../controllers/reviewController");

const router = express.Router();

// ========================================
// PUBLIC ROUTES
// ========================================

// Get all reviews for a product
router.get(
  "/product/:productId",
  getProductReviews
);

// Get product rating
router.get(
  "/product/:productId/rating",
  getProductRatingController
);

// ========================================
// AUTHENTICATED ROUTES
// ========================================

// Get logged-in user's review
router.get(
  "/product/:productId/my-review",
  authMiddleware,
  getMyReview
);

// Create review
router.post(
  "/",
  authMiddleware,
  addReview
);

// Update review
router.put(
  "/:id",
  authMiddleware,
  editReview
);

// Delete review
router.delete(
  "/:id",
  authMiddleware,
  removeReview
);

module.exports = router;