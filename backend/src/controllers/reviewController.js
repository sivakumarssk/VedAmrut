const {
  createReview,
  getReviewsByProductId,
  getUserReviewForProduct,
  updateReview,
  deleteReview,
  getProductRating,
} = require("../models/reviewModel");

// ========================================
// CREATE REVIEW
// ========================================

const addReview = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;

    // Get logged-in user ID from JWT
    const user_id =
      req.user?.id ||
      req.user?.userId ||
      req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check whether user already reviewed this product
    const existingReview =
      await getUserReviewForProduct(
        user_id,
        product_id
      );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = await createReview(
      product_id,
      user_id,
      rating,
      comment || null
    );

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error(
      "ADD REVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to add review",
    });
  }
};

// ========================================
// GET PRODUCT REVIEWS
// ========================================

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const reviews =
      await getReviewsByProductId(
        productId
      );

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error(
      "GET REVIEWS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// ========================================
// GET PRODUCT RATING
// ========================================

const getProductRatingController =
  async (req, res) => {
    try {
      const { productId } = req.params;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required",
        });
      }

      const rating =
        await getProductRating(
          productId
        );

      return res.status(200).json({
        success: true,
        rating: Number(
          rating.average_rating
        ),
        review_count: Number(
          rating.review_count
        ),
      });
    } catch (error) {
      console.error(
        "GET RATING ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch product rating",
      });
    }
  };

// ========================================
// GET MY REVIEW FOR PRODUCT
// ========================================

const getMyReview = async (req, res) => {
  try {
    const { productId } = req.params;

    const user_id =
      req.user?.id ||
      req.user?.userId ||
      req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const review =
      await getUserReviewForProduct(
        user_id,
        productId
      );

    return res.status(200).json({
      success: true,
      review: review || null,
    });
  } catch (error) {
    console.error(
      "GET MY REVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your review",
    });
  }
};

// ========================================
// UPDATE REVIEW
// ========================================

const editReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const user_id =
      req.user?.id ||
      req.user?.userId ||
      req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const review =
      await updateReview(
        id,
        user_id,
        rating,
        comment || null
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error(
      "UPDATE REVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update review",
    });
  }
};

// ========================================
// DELETE REVIEW
// ========================================

const removeReview = async (req, res) => {
  try {
    const { id } = req.params;

    const user_id =
      req.user?.id ||
      req.user?.userId ||
      req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const review =
      await deleteReview(
        id,
        user_id
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE REVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

module.exports = {
  addReview,
  getProductReviews,
  getProductRatingController,
  getMyReview,
  editReview,
  removeReview,
};