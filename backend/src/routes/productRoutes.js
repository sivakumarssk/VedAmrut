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


// // Create Product with Image
// router.post(
//   "/",
//   upload.single("image"),
//   addProduct
// );

// router.get("/search", searchProductsController);
// // Get All Products
// router.get("/", getProducts);


// // Get Product By ID
// router.get("/:id", getProduct);


// // Update Product with Image
// router.put(
//   "/:id",
//   upload.single("image"),
//   editProduct
// );


// // Delete Product
// router.delete("/:id", removeProduct);


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
// CREATE PRODUCT
// ========================================

router.post(
  "/",
  upload.single("image"),
  addProduct
);

// ========================================
// UPDATE PRODUCT
// ========================================

router.put(
  "/:id",
  upload.single("image"),
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