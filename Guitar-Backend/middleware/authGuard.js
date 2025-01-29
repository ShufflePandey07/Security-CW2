const jwt = require("jsonwebtoken");

// Utility function to validate token format
const isValidJWT = (token) => {
  if (!token) return false;
  // Check if token follows JWT format (header.payload.signature)
  const parts = token.split(".");
  return parts.length === 3;
};

const authGuard = (req, res, next) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing or malformed",
      });
    }

    // Extract token from the header
    const token = authHeader.split(" ")[1];

    // if token is not found : stop the process (res)
    if (!token || token === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide a token",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if decoded token has necessary user information
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

const adminGuard = (req, res, next) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing or malformed",
      });
    }

    // Extract token from the header
    const token = authHeader.split(" ")[1];
    if (!token || !isValidJWT(token)) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if decoded token has necessary user information
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    req.user = decoded;

    // Check if the user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Permission denied - Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

module.exports = {
  authGuard,
  adminGuard,
};
