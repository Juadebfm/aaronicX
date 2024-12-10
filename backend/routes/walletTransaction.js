const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addTransaction,
  getTransactions,
  getTransactionById,
} = require("../controllers/walletTransactionController");

// Add transaction route
router.post("/transactions", protect, addTransaction);

// Get user transactions route
router.get("/transactions", protect, getTransactions);

// Get a single transaction
router.get("/transactions/:id", protect, getTransactionById);

module.exports = router;
