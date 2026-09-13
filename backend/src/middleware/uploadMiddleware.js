const multer = require("multer");
const path = require("path");

const MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "src/uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  }

});


const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_UPLOAD_SIZE_BYTES,
  },
});

// =====================================================
// CATEGORY IMAGES
//
// The app reads category images from
// /uploads/categories/<file> (CategoryGrid.tsx), unlike
// every other image which is served flat from
// /uploads/<file>. This uploader writes into that
// categories/ subfolder so category images resolve
// without touching the app's UI code.
// =====================================================

const categoryStorage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "src/uploads/categories/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  }

});

const uploadCategoryImage = multer({
  storage: categoryStorage,
  limits: {
    fileSize: MAX_UPLOAD_SIZE_BYTES,
  },
});


module.exports = upload;
module.exports.categoryImage = uploadCategoryImage;