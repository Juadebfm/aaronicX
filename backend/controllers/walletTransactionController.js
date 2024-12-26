const WalletTransaction = require("../models/WalletTransaction");
const User = require("../models/User");

// Add Transaction (Sent/Received)
exports.addTransaction = async (req, res) => {
  try {
    const { type, amount, walletAddress, cryptocurrency } = req.body;

    // Validation checks
    if (!["sent", "received"].includes(type)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid transaction type" });
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Amount must be greater than zero" });
    }

    const updateOperation = type === "received" ? amount : -amount;

    // First, get the current user to check balances
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // For "sent" transactions, verify sufficient balance
    if (type === "sent") {
      const cryptoCoin = currentUser.cryptoCoins.find(
        (coin) => coin.coinName === cryptocurrency
      );
      if (!cryptoCoin || cryptoCoin.amount < amount) {
        return res.status(400).json({
          success: false,
          message: "Insufficient cryptocurrency balance",
        });
      }
    }

    // Update both balances atomically
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: req.user.id,
      },
      {
        $inc: {
          balance: updateOperation, // Update main balance
          "cryptoCoins.$[coin].amount": updateOperation, // Update crypto balance
        },
      },
      {
        arrayFilters: [{ "coin.coinName": cryptocurrency }],
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "Failed to update user balances",
      });
    }

    // Create and save the transaction
    const transaction = await WalletTransaction.create({
      user: req.user.id,
      type,
      amount,
      cryptocurrency,
      walletAddress,
    });

    // Update transaction history
    await User.findByIdAndUpdate(req.user.id, {
      $push: { transactionHistory: transaction._id },
    });

    // Double-check that balances match after update
    const finalUser = await User.findById(req.user.id)
      .populate("transactionHistory")
      .select("-password");

    // Calculate total from transaction history
    const totalFromTransactions = finalUser.transactionHistory.reduce(
      (acc, trans) => {
        return acc + (trans.type === "received" ? trans.amount : -trans.amount);
      },
      0
    );

    // If there's a mismatch, correct it
    if (totalFromTransactions !== finalUser.balance) {
      await User.findByIdAndUpdate(req.user.id, {
        balance: totalFromTransactions,
      });
    }

    res.status(201).json({
      success: true,
      message: "Transaction recorded successfully",
      transaction,
      balance: totalFromTransactions, // Use calculated balance
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

// Get User Transactions
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
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getUserWithTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("transactionHistory")
      .select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await WalletTransaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Ensure the transaction belongs to the authenticated user
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
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
