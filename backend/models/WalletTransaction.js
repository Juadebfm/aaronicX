const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["sent", "received"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    cryptocurrency: {
      type: String,
      required: true,
      enum: ["BTC", "XRP", "ETH", "USDT"],
    },
    walletAddress: {
      type: String,
      required: true,
    },
    transactionDate: {
      type: Date,
      required: true, // Make it required
      default: Date.now, // Fallback to current date if not provided
    },
    timestamp: {
      type: Date,
      default: Date.now, // Keep this for internal tracking
    },
  },
  {
    timestamps: true,
  }
);

const WalletTransaction = mongoose.model(
  "WalletTransaction",
  walletTransactionSchema
);

module.exports = WalletTransaction;
