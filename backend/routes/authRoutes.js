const express = require("express");
const router = express.Router();
const { signup, login, updateUser } = require("../controllers/authControllers");
const {
  validateSignup,
  validateLogin,
  protect,
  validateUpdate,
} = require("../middleware/authMiddleware");
const { getLoginHistory } = require("../controllers/loginHistoryController");
const { trackLogin } = require("../middleware/trackLogin");

// Auth routes
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login, trackLogin);
router.put("/update", protect, validateUpdate, updateUser);
router.get("/login-history", protect, getLoginHistory);

module.exports = router;
