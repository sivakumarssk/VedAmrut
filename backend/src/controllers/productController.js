


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
  normalizeRewardTiers,
} = require("../models/qrCodeModel");

// ========================================
// PARSE REWARD TIERS FROM REQUEST BODY
//
// Admin sends reward tiers as a JSON string inside the
// multipart form, e.g.
// reward_tiers = '[{"amount":1,"quantity":10},{"amount":2,"quantity":5}]'
// ========================================

const parseRewardTiers = (rawRewardTiers) => {
  if (!rawRewardTiers) {
    return null;
  }

  if (Array.isArray(rawRewardTiers)) {
    return rawRewardTiers;
  }

  try {
    const parsed = JSON.parse(rawRewardTiers);

    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
};

// ========================================
// NORMALIZE IMAGE BACKGROUND COLOR
//
// Accepts "transparent", a hex color (#RGB / #RRGGBB),
// or an rgba()/rgb() string. Falls back to "transparent"
// for anything empty or invalid so the image never ends
// up with an unusable background value.
// ========================================

const BG_COLOR_PATTERN =
  /^(transparent|#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})|rgba?\([^)]+\))$/i;

const normalizeBgColor = (rawBgColor) => {
  const value = String(rawBgColor || "").trim();

  if (!value) {
    return "transparent";
  }

  return BG_COLOR_PATTERN.test(value)
    ? value
    : "transparent";
};
// ========================================
// PARSE IMAGE BACKGROUNDS
// ========================================

const parseImageBackgrounds = (rawBackgrounds) => {
  if (!rawBackgrounds) {
    return [];
  }

  try {
    const parsed = Array.isArray(rawBackgrounds)
      ? rawBackgrounds
      : JSON.parse(rawBackgrounds);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((item) => ({
      image: String(item.image || ""),
      bg_color: normalizeBgColor(item.bg_color),
    }));
  } catch (error) {
    return [];
  }
};
const mapImageBackgrounds = (images, backgrounds) => {
  return images.map((image, index) => ({
    image,
    bg_color: normalizeBgColor(
      backgrounds[index]?.bg_color
    ),
  }));
};
// ========================================
// CREATE PRODUCT
// ========================================

const addProduct = async (req, res) => {
  try {
const {
  name,
  description,
  price,
  old_price,
  stock,
  category_id,
  reward_amount,
  reward_tiers,
  bg_color,
  image_backgrounds,
} = req.body;
  

const images = req.files
  ? req.files.map((file) => file.filename)
  : [];

const image = images[0] || null;

const normalizedBgColor = normalizeBgColor(bg_color);

const parsedImageBackgrounds =
  parseImageBackgrounds(image_backgrounds);

const finalImageBackgrounds = mapImageBackgrounds(
  images,
  parsedImageBackgrounds
);

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
    // REWARD TIERS (MANDATORY)
    //
    // Admin defines how many QR codes should get
    // each reward amount, e.g.
    // ₹1 x 10 units, ₹2 x 5 units, ...
    //
    // Tiers must exactly account for every QR code
    // being generated - no silent fallback to random
    // rewards. Use a ₹0 tier for no-gift units.
    // ------------------------------------

    const rewardTiers = parseRewardTiers(
      reward_tiers
    );

    if (numericStock > 0) {
      if (!rewardTiers || rewardTiers.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "QR reward tiers are required",
        });
      }

      const tiersTotal = rewardTiers.reduce(
        (sum, tier) =>
          sum + Number(tier?.quantity || 0),
        0
      );

      if (tiersTotal !== numericStock) {
        return res.status(400).json({
          success: false,
          message:
            "Reward tier quantities must add up to exactly the total stock",
        });
      }
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
  numericReward,
  normalizedBgColor,
  images,
  finalImageBackgrounds
);

    // ------------------------------------
    // CREATE QR FOR EACH STOCK UNIT
    // ------------------------------------

    let qrCodes = [];

    if (numericStock > 0) {
      qrCodes = await createProductQRCodes(
        product.id,
        numericStock,
        rewardTiers
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
  reward_tiers,
  bg_color,
  image_backgrounds,
} = req.body;
const normalizedBgColor = normalizeBgColor(bg_color);
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
    // REWARD TIERS (MANDATORY)
    //
    // These describe how the newly added QR
    // codes (stock increase only) should be
    // distributed across reward amounts. They
    // must exactly account for every new QR code -
    // no silent fallback to random rewards. Use a
    // ₹0 tier for no-gift units.
    // ------------------------------------

    const newUnitsCount = Math.max(
      numericStock -
        Number(existingProduct.stock || 0),
      0
    );

    const rewardTiers = parseRewardTiers(
      reward_tiers
    );

    if (newUnitsCount > 0) {
      if (!rewardTiers || rewardTiers.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "QR reward tiers are required",
        });
      }

      const tiersTotal = rewardTiers.reduce(
        (sum, tier) =>
          sum + Number(tier?.quantity || 0),
        0
      );

      if (tiersTotal !== newUnitsCount) {
        return res.status(400).json({
          success: false,
          message:
            "Reward tier quantities must add up to exactly the newly added stock",
        });
      }
    }

   // ------------------------------------
// IMAGE
// ------------------------------------

const newImages = req.files
  ? req.files.map((file) => file.filename)
  : [];

const existingImages =
  Array.isArray(existingProduct.images) &&
  existingProduct.images.length > 0
    ? existingProduct.images
    : existingProduct.image
    ? [existingProduct.image]
    : [];

const images =
  newImages.length > 0
    ? newImages
    : existingImages;

const image = images[0] || null;

const parsedImageBackgrounds =
  parseImageBackgrounds(image_backgrounds);

let finalImageBackgrounds;

if (newImages.length > 0) {
  // New images: map the submitted colors to the new files.
  finalImageBackgrounds = mapImageBackgrounds(
    newImages,
    parsedImageBackgrounds
  );
} else {
  // No new images: preserve the existing backgrounds.
  const existingBackgrounds =
    Array.isArray(existingProduct.image_backgrounds)
      ? existingProduct.image_backgrounds
      : [];

  finalImageBackgrounds = images.map((image, index) => {
    const existingBackground = existingBackgrounds.find(
      (item) => item.image === image
    );

    return {
      image,
      bg_color: normalizeBgColor(
        existingBackground?.bg_color
      ),
    };
  });
}

   

    // ------------------------------------
    // UPDATE PRODUCT
    // ------------------------------------

  const product = await updateProduct(
  id,
  name.trim(),
  description || "",
  numericPrice,
  numericOldPrice,
  image,
  numericStock,
  category_id,
  numericReward,
  normalizedBgColor,
  images,
  finalImageBackgrounds
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
          numericStock,
          rewardTiers
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