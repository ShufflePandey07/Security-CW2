const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"], // Add enum to restrict role values
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resetPasswordOTP: {
      type: Number,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    // New fields for account freezing functionality
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lastFailedLogin: {
      type: Date,
      default: null,
    },
    isAccountLocked: {
      type: Boolean,
      default: false,
    },
    googleOtpSecret: {
      type: String,
      default: null,
    },
    googleOtpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for email field to improve query performance
userSchema.index({ email: 1 });

// Add index for phone number to improve query performance during password reset
userSchema.index({ phone: 1 });

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
