const WalletTransaction = require("../models/WalletTransaction");
const User = require("../models/User");

// Add Transaction (Sent/Received)
exports.addTransaction = async (req, res) => {
  try {
    const { type, amount, walletAddress } = req.body;

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

    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (type === "sent" && user.balance < amount) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }

    user.balance =
      type === "sent" ? user.balance - amount : user.balance + amount;

    const transaction = await WalletTransaction.create({
      user: req.user.id,
      type,
      amount,
      walletAddress,
    });

    // Add transaction ID to user's transaction history
    user.transactionHistory.push(transaction._id);

    await user.save();

    res.status(201).json({
      success: true,
      message: "Transaction recorded successfully",
      transaction,
      balance: user.balance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
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
