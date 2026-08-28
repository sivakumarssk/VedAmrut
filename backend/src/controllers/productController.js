


const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require("../models/productModel");

const {
  createProductQRCodes,
  deleteQRCodesByProductId,
} = require("../models/qrCodeModel");

// ========================================
// CREATE PRODUCT
// ========================================

const addProduct = async (req, res) => {
  try {
    // const {
    //   name,
    //   description,
    //   price,
    //   stock,
    //   category_id,
    //   reward_amount,
    // } = req.body;
const {
  name,
  description,
  price,
  old_price,
  stock,
  category_id,
  reward_amount,
} = req.body;
    const image = req.file
      ? req.file.filename
      : null;

    // ------------------------------------
    // VALIDATION
    // ------------------------------------

    if (
      !name ||
      !name.trim() ||
      price === undefined ||
      !category_id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, price and category are required",
      });
    }

    const numericPrice = Number(price);
    const numericOldPrice =
  old_price !== undefined &&
  old_price !== null &&
  old_price !== ''
    ? Number(old_price)
    : 0;
    const numericStock = Number(stock || 0);
    const numericReward = Number(
      reward_amount || 0
    );

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Price must be greater than 0",
      });
    }
    if (
  !Number.isFinite(numericOldPrice) ||
  numericOldPrice < 0
) {
  return res.status(400).json({
    success: false,
    message: "Old price must be a valid number",
  });
}

if (
  numericOldPrice > 0 &&
  numericOldPrice < numericPrice
) {
  return res.status(400).json({
    success: false,
    message:
      "Old price must be greater than or equal to current price",
  });
}

    if (
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Stock must be a valid whole number",
      });
    }

    if (
      !Number.isFinite(numericReward) ||
      numericReward < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Reward amount cannot be negative",
      });
    }

    // ------------------------------------
    // CREATE PRODUCT
    // ------------------------------------

   const product = await createProduct(
  name.trim(),
  description || "",
  numericPrice,
  numericOldPrice,
  image,
  numericStock,
  category_id,
  numericReward
);

    // ------------------------------------
    // CREATE QR FOR EACH STOCK UNIT
    // ------------------------------------

    let qrCodes = [];

    if (numericStock > 0) {
      qrCodes = await createProductQRCodes(
        product.id,
        numericStock
      );
    }

    return res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      data: {
        product,
        qrCodes,
      },
    });
  } catch (error) {
    console.error(
      "ADD PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create product",
    });
  }
};

// ========================================
// GET ALL PRODUCTS
// ========================================

const getProducts = async (req, res) => {
  try {
    const products =
      await getAllProducts();

    return res.status(200).json({
      success: true,
      message:
        "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error(
      "GET PRODUCTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch products",
    });
  }
};

// ========================================
// GET PRODUCT BY ID
// ========================================

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product =
      await getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error(
      "GET PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch product",
    });
  }
};

// ========================================
// UPDATE PRODUCT
// ========================================

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

  const {
  name,
  description,
  price,
  old_price,
  stock,
  category_id,
  reward_amount,
} = req.body;

    // ------------------------------------
    // GET EXISTING PRODUCT
    // ------------------------------------

    const existingProduct =
      await getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    // ------------------------------------
    // VALIDATION
    // ------------------------------------

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Product name is required",
      });
    }

    if (!category_id) {
      return res.status(400).json({
        success: false,
        message:
          "Category is required",
      });
    }

    const numericPrice = Number(price);
    const numericOldPrice =
  old_price !== undefined &&
  old_price !== null &&
  old_price !== ''
    ? Number(old_price)
    : 0;
    const numericStock = Number(stock);
    const numericReward = Number(
      reward_amount || 0
    );

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid price",
      });
    }
if (
  !Number.isFinite(numericOldPrice) ||
  numericOldPrice < 0
) {
  return res.status(400).json({
    success: false,
    message: "Old price must be a valid number",
  });
}

if (
  numericOldPrice > 0 &&
  numericOldPrice < numericPrice
) {
  return res.status(400).json({
    success: false,
    message:
      "Old price must be greater than or equal to current price",
  });
}
    if (
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Stock must be a valid whole number",
      });
    }

    if (
      !Number.isFinite(numericReward) ||
      numericReward < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid reward amount",
      });
    }

    // ------------------------------------
    // IMAGE
    // ------------------------------------

    const image = req.file
      ? req.file.filename
      : existingProduct.image;

    // ------------------------------------
    // UPDATE PRODUCT
    // ------------------------------------

   const product =
  await updateProduct(
    id,
    name.trim(),
    description || "",
    numericPrice,
    numericOldPrice,
    image,
    numericStock,
    category_id,
    numericReward
  );

    // ------------------------------------
    // CREATE MISSING QR CODES
    //
    // Example:
    // old stock = 5
    // new stock = 8
    // creates 3 new QR codes
    // ------------------------------------

    let newQRCodes = [];

    if (numericStock > 0) {
      newQRCodes =
        await createProductQRCodes(
          id,
          numericStock
        );
    }

    return res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      data: {
        product,
        newQRCodes,
      },
    });
  } catch (error) {
    console.error(
      "EDIT PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update product",
    });
  }
};

// ========================================
// DELETE PRODUCT
// ========================================

const removeProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    // ------------------------------------
    // CHECK PRODUCT
    // ------------------------------------

    const product =
      await getProductById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    // ------------------------------------
    // DELETE QR CODES FIRST
    // ------------------------------------

    await deleteQRCodesByProductId(
      productId
    );

    // ------------------------------------
    // DELETE PRODUCT
    // ------------------------------------

    const deletedProduct =
      await deleteProduct(productId);

    return res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    console.error(
      "DELETE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete product",
    });
  }
};

// ========================================
// SEARCH PRODUCTS
// ========================================

const searchProductsController =
  async (req, res) => {
    try {
      const { query } = req.query;

      if (!query || !query.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Search query is required",
        });
      }

      const products =
        await searchProducts(
          query.trim()
        );

      return res.status(200).json({
        success: true,
        message:
          "Products searched successfully",
        data: products,
      });
    } catch (error) {
      console.error(
        "SEARCH PRODUCTS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to search products",
      });
    }
  };

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  editProduct,
  removeProduct,
  searchProductsController,
};