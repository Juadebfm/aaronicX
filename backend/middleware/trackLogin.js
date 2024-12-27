const User = require("../models/User");

exports.trackLogin = async (req, res, next) => {
  try {
    console.log("Tracking login, user:", req.user); // Debug log

    const user = await User.findById(req.user.id);

    if (!user) {
      console.error("User not found for tracking");
      return next();
    }

    // Update login history
    user.loginHistory.push({
      timestamp: new Date(),
      device: req.headers["user-agent"] || "Unknown",
      browser: req.headers["sec-ch-ua"] || "Unknown",
      ip: req.ip || req.connection.remoteAddress || "Unknown",
      location: req.body.location || "Unknown",
    });

    await user.save();
    console.log("Login tracked successfully");
    next();
  } catch (error) {
    console.error("Error tracking login:", error);
    next();
  }
};
