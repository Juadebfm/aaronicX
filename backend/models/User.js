const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your full name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    age: {
      type: Number,
      required: [true, "Please provide your age"],
      min: [18, "You must be at least 18 years old"],
    },
    profileImage: {
      type: String,
      default: "default-profile.png",
    },
    NIN: {
      type: String,
      required: [true, "National Identification Number is required"],
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    cryptoCoins: [
      {
        coinName: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          default: 0,
        },
      },
    ],
    // Reference to WalletTransaction
    transactionHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WalletTransaction",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose pre-save middleware for password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
