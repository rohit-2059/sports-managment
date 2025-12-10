const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/config");

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  console.log("=== PROTECT MIDDLEWARE ===");
  try {
    let token;

    // Check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Make sure token exists
    if (!token) {
      console.log("No token found");
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this route",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);

      // Get user from token
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        console.log("User not found");
        return res.status(401).json({
          success: false,
          error: "Not authorized to access this route",
        });
      }

      console.log("User authenticated:", req.user._id, "Role:", req.user.role);
      next();
    } catch (error) {
      console.log("Token verification error:", error.message);
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this route",
      });
    }
  } catch (error) {
    console.error("Protect middleware error:", error);
    next(error);
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  console.log("=== AUTHORIZE MIDDLEWARE CREATED ===");
  console.log("Allowed roles:", roles);
  return (req, res, next) => {
    console.log("=== AUTHORIZE MIDDLEWARE EXECUTING ===");
    console.log("User role:", req.user ? req.user.role : "NO USER");

    if (!req.user) {
      console.log("No user found");
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this route",
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log("Access denied");
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    console.log("Access granted");
    next();
  };
};

module.exports = { protect, authorize };
