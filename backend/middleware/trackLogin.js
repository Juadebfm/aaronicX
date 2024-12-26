const User = require("../models/User");

const trackLogin = async (req, res, next) => {
  try {
    const userAgent = req.headers["user-agent"];
    const ip = req.ip || req.connection.remoteAddress;

    // Parse user agent for browser info
    const browser = userAgent
      ? userAgent.split(" ")[userAgent.split(" ").length - 1]
      : "Unknown";

    await User.findByIdAndUpdate(req.body.userId, {
      $push: {
        loginHistory: {
          device: userAgent,
          browser,
          ip,
          location: req.body.location,
        },
      },
    });

    next();
  } catch (error) {
    console.error("Login tracking error:", error);
    next();
  }
};

module.exports = { trackLogin };
