const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../models/categoryModel");

// ========================================
// NORMALIZE IMAGE BACKGROUND COLOR
//
// Accepts "transparent", a hex color (#RGB / #RRGGBB),
// or an rgba()/rgb() string. Falls back to "transparent"
// for anything empty or invalid.
// ========================================

const BG_COLOR_PATTERN =
  /^(transparent|#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})|rgba?\([^)]+\))$/;

const normalizeBgColor = (rawBgColor) => {
  const value = String(rawBgColor || "").trim();

  if (!value) {
    return "transparent";
  }

  return BG_COLOR_PATTERN.test(value)
    ? value
    : "transparent";
};

// Create Category
const addCategory = async (req, res) => {
  try {
    const { name, description, bg_color } = req.body;

    const image = req.file
      ? req.file.filename
      : null;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await createCategory(
      name.trim(),
      description,
      image,
      normalizeBgColor(bg_color)
    );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// Get Category By ID
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// Update Category
const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, bg_color } = req.body;

    const existingCategory = await getCategoryById(id);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const image = req.file
      ? req.file.filename
      : existingCategory.image;

    const normalizedBgColor =
      bg_color !== undefined
        ? normalizeBgColor(bg_color)
        : existingCategory.bg_color || "transparent";

    const category = await updateCategory(
      id,
      name.trim(),
      description,
      image,
      normalizedBgColor
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// Delete Category
const removeCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await deleteCategory(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


module.exports = {
  addCategory,
  getCategories,
  getCategory,
  editCategory,
  removeCategory,
};