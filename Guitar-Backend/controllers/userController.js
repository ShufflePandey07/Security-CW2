const DOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const purify = DOMPurify(window);
const rateLimit = require("express-rate-limit");

const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require("axios");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});
// Helper function to remove HTML and script tags
const removeHtmlTags = (input) => {
  return input.replace(/<[^>]*>?/gm, "");
};

// Secure sanitization function
const sanitizeInput = (input) => {
  const sanitized = purify.sanitize(input);
  return removeHtmlTags(sanitized);
};

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

  const freezeTime = 5 * 60 * 1000; // 5 minutes in milliseconds
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

// Create User
const createUser = async (req, res) => {
  const { fullName, email, phone, password, captchaToken } = req.body;

  // Sanitize inputs
  const sanitizedFullName = sanitizeInput(fullName);
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedPhone = sanitizeInput(phone);
  const sanitizedPassword = sanitizeInput(password);
  const sanitizedCaptchaToken = sanitizeInput(captchaToken);

  if (
    !sanitizedFullName ||
    !sanitizedEmail ||
    !sanitizedPhone ||
    !sanitizedPassword ||
    !sanitizedCaptchaToken
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }

  // Verify reCAPTCHA
  try {
    const captchaVerificationResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: sanitizedCaptchaToken,
        },
      }
    );

    if (!captchaVerificationResponse.data.success) {
      return res
        .status(400)
        .json({ success: false, message: "Captcha verification failed!" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error verifying captcha", error });
  }

  if (!isPasswordValid(sanitizedPassword)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least 8 characters, one uppercase letter, one number, and one special character!",
    });
  }

  try {
    const existingUser = await userModel.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(sanitizedPassword, salt);

    const newUser = new userModel({
      fullname: sanitizedFullName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
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

// Login User
const loginUser = async (req, res) => {
  const { email, password, captchaToken } = req.body;

  // Sanitize inputs
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedPassword = sanitizeInput(password);
  const sanitizedCaptchaToken = sanitizeInput(captchaToken);

  if (!sanitizedEmail || !sanitizedPassword || !sanitizedCaptchaToken) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields!" });
  }

  // Verify reCAPTCHA
  try {
    const captchaVerificationResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: sanitizedCaptchaToken,
        },
      }
    );

    if (!captchaVerificationResponse.data.success) {
      return res
        .status(400)
        .json({ success: false, message: "Captcha verification failed!" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error verifying captcha", error });
  }

  try {
    const user = await userModel.findOne({ email: sanitizedEmail });
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

    const passwordCorrect = await bcrypt.compare(
      sanitizedPassword,
      user.password
    );
    if (!passwordCorrect) {
      await incrementLoginAttempts(user);

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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    user.googleOtpSecret = otp;
    user.googleOtpExpires = otpExpires;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: sanitizedEmail,
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

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  // Sanitize inputs
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedOtp = sanitizeInput(otp);

  if (!sanitizedEmail || !sanitizedOtp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required!" });
  }

  try {
    const user = await userModel.findOne({ email: sanitizedEmail });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist" });
    }

    if (
      user.googleOtpSecret !== sanitizedOtp ||
      user.googleOtpExpires < Date.now()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP." });
    }

    user.googleOtpSecret = null;
    user.googleOtpExpires = null;
    await user.save();

    const token = await jwt.sign(
      { id: user._id, isAdmin: user.role === "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
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

// Forget Password
const forgetPassword = async (req, res) => {
  const { phoneNumber } = req.body;

  const sanitizedPhoneNumber = sanitizeInput(phoneNumber);

  if (!sanitizedPhoneNumber) {
    return res.status(400).json({
      success: false,
      message: "Please enter your phone number",
    });
  }

  try {
    const user = await userModel.findOne({ phone: sanitizedPhoneNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    await resetLoginAttempts(user);

    const randomOTP = Math.floor(100000 + Math.random() * 900000);
    user.resetPasswordOTP = randomOTP;
    user.resetPasswordExpires = Date.now() + 600000;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP sent to your phone number",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { otp, phoneNumber, password } = req.body;

  const sanitizedOtp = sanitizeInput(otp);
  const sanitizedPhoneNumber = sanitizeInput(phoneNumber);
  const sanitizedPassword = sanitizeInput(password);

  if (!sanitizedOtp || !sanitizedPhoneNumber || !sanitizedPassword) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields",
    });
  }

  if (!isPasswordValid(sanitizedPassword)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least 8 characters, one uppercase letter, one number, and one special character!",
    });
  }

  try {
    const user = await userModel.findOne({ phone: sanitizedPhoneNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.resetPasswordOTP !== parseInt(sanitizedOtp)) {
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
    const hashedPassword = await bcrypt.hash(sanitizedPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;
    await resetLoginAttempts(user);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Remaining Functions
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateProfile = async (req, res) => {
  const id = req.user.id;
  const { fullname, email, phone, password } = req.body;

  const sanitizedFullName = sanitizeInput(fullname);
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedPhone = sanitizeInput(phone);
  const sanitizedPassword = password ? sanitizeInput(password) : null;

  if (!sanitizedFullName || !sanitizedEmail || !sanitizedPhone) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields",
    });
  }

  if (sanitizedPassword && !isPasswordValid(sanitizedPassword)) {
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

    user.fullname = sanitizedFullName;
    user.email = sanitizedEmail;
    user.phone = sanitizedPhone;
    if (sanitizedPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(sanitizedPassword, salt);
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getToken = async (req, res) => {
  const id = sanitizeInput(req.body.id);
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  limiter,
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
