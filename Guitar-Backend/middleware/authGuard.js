// const jwt = require("jsonwebtoken");
// const authGuard = (req, res, next) => {
//   // check incoming data
//   console.log(req.headers); //pass

//   // get authorization data from headers
//   const authHeader = req.headers.authorization;

//   // check or validate
//   if (!authHeader) {
//     return res.status(400).json({
//       success: false,
//       message: "Auth header is missing",
//     });
//   }

//   // Split the data (Format : 'Bearer token-joyboy') -> only token
//   const token = authHeader.split(" ")[1];

//   // if token is not found : stop the process (res)
//   if (!token || token === "") {
//     return res.status(400).json({
//       success: false,
//       message: "Please provide a token",
//     });
//   }

//   // if token is found then verify
//   try {
//     const decodeUserData = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decodeUserData; //user info : id onlyf
//     next();
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({
//       success: false,
//       message: "Not Authenticated",
//     });
//   }

//   // if verified : next (function in controller)
//   // if not verified : not auth
// };

// // Admin guard
// const adminGuard = (req, res, next) => {
//   // check incoming data
//   console.log(req.headers); //pass

//   // get authorization data from headers
//   const authHeader = req.headers.authorization;

//   // check or validate
//   if (!authHeader) {
//     return res.status(400).json({
//       success: false,
//       message: "Auth header is missing",
//     });
//   }

//   // Split the data (Format : 'Bearer token-joyboy') -> only token
//   const token = authHeader.split(" ")[1];

//   // if token is not found : stop the process (res)
//   if (!token || token === "") {
//     return res.status(400).json({
//       success: false,
//       message: "Please provide a token",
//     });
//   }

//   // if token is found then verify
//   try {
//     const decodeUserData = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decodeUserData; // id, isadmin
//     if (!req.user.isAdmin) {
//       return res.status(400).json({
//         success: false,
//         message: "Permission Denied",
//       });
//     }
//     next();
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({
//       success: false,
//       message: "Not Authenticated",
//     });
//   }

//   // if verified : next (function in controller)
//   // if not verified : not auth
// };

// module.exports = {
//   authGuard,
//   adminGuard,
// };

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
