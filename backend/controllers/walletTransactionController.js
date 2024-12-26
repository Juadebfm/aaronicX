const WalletTransaction = require("../models/WalletTransaction");
const User = require("../models/User");

// Add Transaction (Sent/Received)
exports.addTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { type, amount, walletAddress, cryptocurrency } = req.body;

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

    // Get current user with transaction history
    const user = await User.findById(req.user.id).populate(
      "transactionHistory"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify sufficient balance for sent transactions
    if (type === "sent") {
      const cryptoCoin = user.cryptoCoins.find(
        (coin) => coin.coinName === cryptocurrency
      );
      if (!cryptoCoin || cryptoCoin.amount < amount) {
        return res
          .status(400)
          .json({ success: false, message: "Insufficient balance" });
      }
    }

    // Create transaction
    const transaction = await WalletTransaction.create(
      [
        {
          user: req.user.id,
          type,
          amount,
          cryptocurrency,
          walletAddress,
        },
      ],
      { session }
    );

    // Calculate new balance including this transaction
    const newBalance =
      user.transactionHistory.reduce((total, trans) => {
        return (
          total + (trans.type === "received" ? trans.amount : -trans.amount)
        );
      }, 0) + updateOperation;

    // Update user with new balance and transaction
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          balance: newBalance,
          "cryptoCoins.$[coin].amount": newBalance,
        },
        $push: { transactionHistory: transaction[0]._id },
      },
      {
        arrayFilters: [{ "coin.coinName": cryptocurrency }],
        new: true,
        session,
      }
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Transaction recorded successfully",
      transaction: transaction[0],
      balance: newBalance,
      cryptoCoins: updatedUser.cryptoCoins,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  } finally {
    session.endSession();
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
