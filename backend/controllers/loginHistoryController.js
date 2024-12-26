const User = require("../models/User");

exports.getLoginHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("loginHistory")
      .sort({ "loginHistory.timestamp": -1 });

    res.status(200).json({
      success: true,
      loginHistory: user.loginHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching login history",
    });
  }
};
