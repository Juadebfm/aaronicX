const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, age, profileImage, NIN } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      age,
      profileImage,
      NIN,
    });

    // Save the new user
    await newUser.save();

    // Generate tokens
    const accessToken = generateToken(newUser, "access");
    const refreshToken = generateToken(newUser, "refresh");

    res.status(201).json({
      success: true,
      message: "Signup successful",
      tokens: {
        accessToken,
        refreshToken,
      },
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        age: newUser.age,
        profileImage: newUser.profileImage,
        NIN: newUser.NIN,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during signup",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and select password, then populate transaction history
    const user = await User.findOne({ email })
      .select("+password")
      .populate({
        path: "transactionHistory",
        model: "WalletTransaction",
        options: {
          sort: { createdAt: -1 },
        },
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate tokens
    const accessToken = generateToken(user, "access");
    const refreshToken = generateToken(user, "refresh");

    // Prepare user object without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      profileImage: user.profileImage,
      NIN: user.NIN,
      balance: user.balance,
      cryptoCoins: user.cryptoCoins,
      transactionHistory: user.transactionHistory,
      isActive: user.isActive,
      loginHistory: user.loginHistory,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      tokens: {
        accessToken,
        refreshToken,
      },
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;

    // Update user fields
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true, // Return the updated document
      runValidators: true, // Enforce schema validators on updates
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during update",
      error: error.message,
    });
  }
};

// Backend: Create tracking controller
const UserActivity = {
  trackLogin: async (req, res, next) => {
    try {
      const userAgent = req.headers["user-agent"];
      const ip = req.ip || req.connection.remoteAddress;

      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          loginHistory: {
            device: userAgent,
            ip: ip,
            location: req.body.location, // From frontend
          },
        },
      });

      next();
    } catch (error) {
      console.error("Login tracking error:", error);
      next(); // Continue even if tracking fails
    }
  },
};
