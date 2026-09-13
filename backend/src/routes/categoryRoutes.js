const express = require("express");
const router = express.Router();

const {
  addCategory,
  getCategories,
  getCategory,
  editCategory,
  removeCategory,
} = require("../controllers/categoryController");

const upload = require("../middleware/uploadMiddleware");


// Create Category
router.post(
  "/",
  upload.categoryImage.single("image"),
  addCategory
);


// Get All Categories
router.get("/", getCategories);


// Get Category By ID
router.get("/:id", getCategory);


// Update Category
router.put(
  "/:id",
  upload.categoryImage.single("image"),
  editCategory
);


// Delete Category
router.delete("/:id", removeCategory);


module.exports = router;