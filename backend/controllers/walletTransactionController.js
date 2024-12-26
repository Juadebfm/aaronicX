const mongoose = require("mongoose");
const WalletTransaction = require("../models/WalletTransaction");
const User = require("../models/User");

// Add Transaction (Sent/Received)
exports.addTransaction = async (req, res) => {
  try {
    const { type, amount, walletAddress, cryptocurrency } = req.body;

    // Validation checks
    if (!["sent", "received"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction type",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero",
      });
    }

    const updateOperation = type === "received" ? amount : -amount;

    // Get current user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // For "sent" transactions, verify sufficient balance
    if (type === "sent") {
      const cryptoCoin = user.cryptoCoins.find(
        (coin) => coin.coinName === cryptocurrency
      );
      if (!cryptoCoin || cryptoCoin.amount < amount) {
        return res.status(400).json({
          success: false,
          message: "Insufficient cryptocurrency balance",
        });
      }
    }

    // Create the transaction first
    const transaction = await WalletTransaction.create({
      user: req.user.id,
      type,
      amount,
      cryptocurrency,
      walletAddress,
    });

    // Update user balances and add transaction to history
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: {
          balance: updateOperation,
          "cryptoCoins.$[coin].amount": updateOperation,
        },
        $push: { transactionHistory: transaction._id },
      },
      {
        arrayFilters: [{ "coin.coinName": cryptocurrency }],
        new: true,
      }
    );

    if (!updatedUser) {
      // If update fails, delete the created transaction
      await WalletTransaction.findByIdAndDelete(transaction._id);
      return res.status(400).json({
        success: false,
        message: "Failed to update user balance",
      });
    }

    res.status(201).json({
      success: true,
      message: "Transaction recorded successfully",
      transaction,
      balance: updatedUser.balance,
      cryptoCoins: updatedUser.cryptoCoins,
    });
  } catch (error) {
    console.error("Transaction Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get User Transactions - rest of your code remains the same
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await WalletTransaction.find({
      user: req.user.id,
    }).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getUserWithTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("transactionHistory")
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await WalletTransaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view this transaction",
      });
    }

    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
