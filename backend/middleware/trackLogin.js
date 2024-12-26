const User = require("../models/User");

exports.trackLogin = async (req, res, next) => {
  try {
    console.log("Tracking login for user:", req.user.id); // Log User ID

    const user = await User.findById(req.user.id);
    console.log("User before update:", user); // Log User Data

    // Update login history
    user.loginHistory.push({
      timestamp: new Date(),
      device: req.headers["user-agent"] || "Unknown",
      browser: "Chrome", // Replace with actual detection logic
      ip: req.ip || "Unknown",
      location: req.body.location || "Unknown",
    });

    await user.save();
    console.log("Updated User:", user); // Log Updated User

    next();
  } catch (error) {
    console.error("Error tracking login:", error);
    next(); // Proceed without breaking login flow
  }
};
