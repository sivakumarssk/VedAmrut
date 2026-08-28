// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   try {
//     // Get token from header
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided",
//       });
//     }

//     // Format: Bearer token
//     const token = authHeader.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token",
//       });
//     }

//     // Verify token
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     // Store user data in request
//     req.user = decoded;

//     next();

//   } catch (error) {
//     console.error(error);

//     res.status(401).json({
//       success: false,
//       message: "Unauthorized",
//     });
//   }
// };


// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");

const authMiddleware = (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    // ------------------------------------
    // CHECK AUTH HEADER
    // ------------------------------------

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message:
          "No token provided",
      });
    }

    // ------------------------------------
    // CHECK BEARER
    // ------------------------------------

    if (
      !authHeader.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authorization format",
      });
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid token",
      });
    }

    // ------------------------------------
    // VERIFY TOKEN
    // ------------------------------------

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    // ------------------------------------
    // STORE USER
    // ------------------------------------

    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "AUTH ERROR:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Unauthorized",
    });
  }
};

module.exports =
  authMiddleware;