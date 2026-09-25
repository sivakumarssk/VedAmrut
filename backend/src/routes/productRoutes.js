

// const express = require("express");

// const router = express.Router();

// const {
//   addProduct,
//   getProducts,
//   getProduct,
//   editProduct,
//   removeProduct,
//   searchProductsController,
// } = require("../controllers/productController");

// const upload = require("../middleware/uploadMiddleware");

// // ========================================
// // SEARCH PRODUCTS
// // IMPORTANT: MUST COME BEFORE /:id
// // ========================================

// router.get(
//   "/search",
//   searchProductsController
// );

// // ========================================
// // GET ALL PRODUCTS
// // ========================================

// router.get(
//   "/",
//   getProducts
// );

// // ========================================
// // GET PRODUCT BY ID
// // ========================================

// router.get(
//   "/:id",
//   getProduct
// );

// // ========================================
// // CREATE PRODUCT
// // ========================================

// router.post(
//   "/",
//   upload.single("image"),
//   addProduct
// );

// // ========================================
// // UPDATE PRODUCT
// // ========================================

// router.put(
//   "/:id",
//   upload.single("image"),
//   editProduct
// );

// // ========================================
// // DELETE PRODUCT
// // ========================================

// router.delete(
//   "/:id",
//   removeProduct
// );

// module.exports = router;


const express = require("express");

const router = express.Router();

const {
  addProduct,
  getProducts,
  getProduct,
  editProduct,
  removeProduct,
  searchProductsController,
} = require("../controllers/productController");

const upload = require("../middleware/uploadMiddleware");

// ========================================
// SEARCH PRODUCTS
// IMPORTANT: MUST COME BEFORE /:id
// ========================================

router.get(
  "/search",
  searchProductsController
);

// ========================================
// GET ALL PRODUCTS
// ========================================

router.get(
  "/",
  getProducts
);

// ========================================
// GET PRODUCT BY ID
// ========================================

router.get(
  "/:id",
  getProduct
);

// ========================================
// CREATE PRODUCT - MULTIPLE IMAGES
// Maximum 10 images
// ========================================

router.post(
  "/",
  upload.array("images", 10),
  addProduct
);

// ========================================
// UPDATE PRODUCT - MULTIPLE IMAGES
// Maximum 10 images
// ========================================

router.put(
  "/:id",
  upload.array("images", 10),
  editProduct
);

// ========================================
// DELETE PRODUCT
// ========================================

router.delete(
  "/:id",
  removeProduct
);

module.exports = router;

