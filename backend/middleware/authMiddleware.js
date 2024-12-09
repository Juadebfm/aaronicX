const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to validate access token
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      // Find user and attach to request
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found",
        });
      }

      next();
    } catch (error) {
      // Handle different types of token errors
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired, please login again",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Not authorized, invalid token",
      });
    }
  }

  // If no token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
};

// Validation Middleware
const validateSignup = (req, res, next) => {
  const { name, email, password, age, NIN } = req.body;

  // Validate required fields
  const requiredFields = ["name", "email", "password", "age", "NIN"];
  for (let field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({
        success: false,
        message: `${field} is required`,
      });
    }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  // Password strength validation
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long",
    });
  }

  // Age validation
  if (age < 18) {
    return res.status(400).json({
      success: false,
      message: "You must be at least 18 years old",
    });
  }

  next();
};

// Login validation middleware
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  next();
};

// Update validation middleware
const validateUpdate = (req, res, next) => {
  const allowedFields = ["name", "age", "profileImage"];
  const updates = Object.keys(req.body);

  // Check if all provided fields are allowed
  const isValidOperation = updates.every((field) =>
    allowedFields.includes(field)
  );
  if (!isValidOperation) {
    return res.status(400).json({
      success: false,
      message: "Invalid fields in update request",
    });
  }

  // Validate specific fields if necessary
  if (req.body.age && typeof req.body.age !== "number") {
    return res.status(400).json({
      success: false,
      message: "Age must be a number",
    });
  }

  next();
};

module.exports = {
  protect,
  validateSignup,
  validateLogin,
  validateUpdate,
};
