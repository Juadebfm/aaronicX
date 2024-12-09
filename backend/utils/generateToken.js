const jwt = require("jsonwebtoken");

const generateToken = (user, type = "access") => {
  const payload = {
    id: user._id,
    email: user.email,
  };

  let expiresIn, secret;

  if (type === "access") {
    expiresIn = "1d"; // Short-lived access token
    secret = process.env.JWT_ACCESS_SECRET;
  } else {
    expiresIn = "7d"; // Longer-lived refresh token
    secret = process.env.JWT_REFRESH_SECRET;
  }

  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = generateToken;
