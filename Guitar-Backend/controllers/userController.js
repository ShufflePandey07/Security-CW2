const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOtp = require("../service/sendOtp");
const nodemailer = require("nodemailer");

// Password validation function
const isPasswordValid = (password) => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  return true;
};

// Check if account is frozen

const isAccountFrozen = (user) => {
  if (!user.loginAttempts || user.loginAttempts < 5) return false;
  if (!user.lastFailedLogin) return false;

  const freezeTime = 1 * 60 * 1000; // 5 minutes in milliseconds
  const timeSinceLastAttempt = Date.now() - user.lastFailedLogin;
  return timeSinceLastAttempt < freezeTime;
};

// Reset login attempts
const resetLoginAttempts = async (user) => {
  user.loginAttempts = 0;
  user.lastFailedLogin = null;
  await user.save();
};

// Increment login attempts
const incrementLoginAttempts = async (user) => {
  user.loginAttempts = (user.loginAttempts || 0) + 1;
  user.lastFailedLogin = Date.now();
  await user.save();
};

const createUser = async (req, res) => {
  console.log(req.body);

  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !phone || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }

  if (!isPasswordValid(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least 8 characters, one uppercase letter, one number, and one special character!",
    });
  }

  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      fullname: fullName,
      email: email,
      phone: phone,
      password: hashedPassword,
      loginAttempts: 0,
      lastFailedLogin: null,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "User Created!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields!" });
  }

  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist" });
    }

    // Check if account is frozen
    if (isAccountFrozen(user)) {
      const timeLeft = Math.ceil(
        (5 * 60 * 1000 - (Date.now() - user.lastFailedLogin)) / 1000 / 60
      );
      return res.status(403).json({
        success: false,
        message: `Account is temporarily frozen due to multiple failed attempts. Please try again in ${timeLeft} minutes.`,
      });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      await incrementLoginAttempts(user);

      // Check if this attempt should freeze the account
      if (user.loginAttempts >= 5) {
        return res.status(403).json({
          success: false,
          message:
            "Account frozen for 5 minutes due to multiple failed login attempts.",
        });
      }

      return res.status(400).json({
        success: false,
        message: `Password is incorrect. ${
          5 - user.loginAttempts
        } attempts remaining before account freeze.`,
      });
    }

    // If credentials are correct, generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

    user.googleOtpSecret = otp;
    user.googleOtpExpires = otpExpires;
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email. Please verify it.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err,
    });
  }
};
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required!" });
  }

  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist" });
    }

    // Check if OTP is valid and not expired
    if (user.googleOtpSecret !== otp || user.googleOtpExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP." });
    }

    // Clear OTP and expiry after verification
    user.googleOtpSecret = null;
    user.googleOtpExpires = null;
    await user.save();

    // Generate token for login
    const token = await jwt.sign(
      { id: user._id, isAdmin: user.role === "admin" },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. Logged in!",
      token: token,
      user: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error verifying OTP.",
      error: err,
    });
  }
};

const forgetPassword = async (req, res) => {
  console.log(req.body);

  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      message: "Please enter your phone number",
    });
  }
  try {
    const user = await userModel.findOne({ phone: phoneNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Reset login attempts when requesting password reset
    await resetLoginAttempts(user);

    const randomOTP = Math.floor(100000 + Math.random() * 900000);
    console.log(randomOTP);

    user.resetPasswordOTP = randomOTP;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP sent to your phone number",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const resetPassword = async (req, res) => {
  console.log(req.body);
  const { otp, phoneNumber, password } = req.body;

  if (!otp || !phoneNumber || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields",
    });
  }

  if (!isPasswordValid(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least 8 characters, one uppercase letter, one number, and one special character!",
    });
  }

  try {
    const user = await userModel.findOne({ phone: phoneNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const otpToInteger = parseInt(otp);

    if (user.resetPasswordOTP !== otpToInteger) {
      return res.status(400).json({
        success: false,
        message: "OTP is incorrect",
      });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP is expired",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;

    // Reset login attempts after successful password reset
    await resetLoginAttempts(user);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Rest of the code remains the same...
const getSingleUser = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User found",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const allUsers = await userModel.find();
    res.status(200).json({
      success: true,
      message: "All users",
      users: allUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const updateProfile = async (req, res) => {
  const id = req.user.id;
  const { fullname, email, phone, password } = req.body;

  if (!fullname || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields",
    });
  }

  if (password && !isPasswordValid(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least 8 characters, one uppercase letter, one number, and one special character!",
    });
  }

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.fullname = fullname;
    user.email = email;
    user.phone = phone;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getToken = async (req, res) => {
  const id = req.body.id;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const token = await jwt.sign(
      { id: user._id, isAdmin: user.role === "admin" },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      success: true,
      message: "Token generated",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  verifyOtp,
  forgetPassword,
  resetPassword,
  getSingleUser,
  getAllUser,
  updateProfile,
  getToken,
};
