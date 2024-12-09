const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addTransaction,
  getTransactions,
} = require("../controllers/walletTransactionController");

// Add transaction route
router.post("/transactions", protect, addTransaction);

// Get user transactions route
router.get("/transactions", protect, getTransactions);

module.exports = router;
