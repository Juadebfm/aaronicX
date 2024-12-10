const WalletTransaction = require("../models/WalletTransaction");
const User = require("../models/User");

// Add Transaction (Sent/Received)
exports.addTransaction = async (req, res) => {
  try {
    const { type, amount, walletAddress, cryptocurrency } = req.body;

    // Validate transaction type
    if (!["sent", "received"].includes(type)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid transaction type" });
    }

    // Validate amount
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

    // Find or create cryptocurrency entry in cryptoCoins array
    let cryptoCoinEntry = user.cryptoCoins.find(
      (coin) => coin.coinName === cryptocurrency
    );

    if (!cryptoCoinEntry) {
      // If cryptocurrency doesn't exist, create a new entry
      cryptoCoinEntry = { coinName: cryptocurrency, amount: 0 };
      user.cryptoCoins.push(cryptoCoinEntry);
    }

    // Update cryptocurrency amount based on transaction type
    if (type === "sent") {
      if (cryptoCoinEntry.amount < amount) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Insufficient cryptocurrency balance",
          });
      }
      cryptoCoinEntry.amount -= amount;
      user.balance -= amount;
    } else if (type === "received") {
      cryptoCoinEntry.amount += amount;
      user.balance += amount;
    }

    const transaction = await WalletTransaction.create({
      user: req.user.id,
      type,
      amount,
      cryptocurrency,
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
      cryptoCoins: user.cryptoCoins,
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
