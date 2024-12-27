const User = require("../models/User");

exports.trackLogin = async (req, res, next) => {
  try {
    console.log("TrackLogin middleware started");
    console.log("Request user:", req.user);
    console.log("Request body:", req.body);

    const userId = req.user?.id;

    if (!userId) {
      console.error("No user ID in request");
      return next();
    }

    const user = await User.findById(userId);

    if (!user) {
      console.error(`User not found with ID: ${userId}`);
      return next();
    }

    // Update login history
    const loginEntry = {
      timestamp: new Date(),
      device: req.headers["user-agent"] || "Unknown",
      browser: req.headers["sec-ch-ua"] || "Unknown",
      ip: req.ip || req.connection.remoteAddress || "Unknown",
      location: req.body.location || "Unknown",
    };

    console.log("Adding login entry:", loginEntry);
    user.loginHistory.push(loginEntry);

    const updatedUser = await user.save();
    console.log("Updated user loginHistory:", updatedUser.loginHistory);

    next();
  } catch (error) {
    console.error("Error in trackLogin middleware:", error);
    next();
  }
};
