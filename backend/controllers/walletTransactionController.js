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

    // Calculate operation amount (positive for received, negative for sent)
    const updateOperation = type === "received" ? amount : -amount;

    // Find user and update balances atomically
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        // For "sent" transactions, verify sufficient balance
        ...(type === "sent" && {
          cryptoCoins: {
            $elemMatch: {
              coinName: cryptocurrency,
              amount: { $gte: amount },
            },
          },
        }),
      },
      {
        $inc: {
          "cryptoCoins.$[coin].amount": updateOperation,
          totalBalance: updateOperation, // Assuming you have a totalBalance field in your User model
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
        message:
          type === "sent"
            ? "Insufficient cryptocurrency balance"
            : "User not found",
      });
    }

    // Create transaction record
    const transaction = await WalletTransaction.create({
      user: req.user.id,
      type,
      amount,
      cryptocurrency,
      walletAddress,
    });

    // Add transaction ID to user's history
    await User.findByIdAndUpdate(req.user.id, {
      $push: { transactionHistory: transaction._id },
    });

    res.status(201).json({
      success: true,
      message: "Transaction recorded successfully",
      transaction,
      balance: updatedUser.totalBalance, // Make sure you're returning the correct balance field
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
