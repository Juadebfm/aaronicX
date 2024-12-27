const User = require("../models/User");

exports.trackLogin = async (req, res, next) => {
  try {
    const loginEntry = {
      timestamp: new Date(),
      device: req.headers["user-agent"] || "Unknown",
      browser: req.headers["sec-ch-ua"] || "Unknown",
      ip: req.ip || req.connection.remoteAddress || "Unknown",
      location: req.body.location || "Unknown",
    };

    // Store login entry in request object to be used by login controller
    req.loginEntry = loginEntry;
    next();
  } catch (error) {
    console.error("Error in trackLogin middleware:", error);
    next();
  }
};
