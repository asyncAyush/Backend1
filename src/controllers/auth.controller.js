const userModel = require("../models/user.model");
const generateOtp = require("../utils/genrateOtp");
const { sendOtpEmail } = require("../services/otp.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= Register User =================
async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName,
      email,
      password: hashPassword,
      isVerified: false,
    });

    res.status(201).json({
      message: "User registered successfully. Please login to receive OTP.",
      user: { _id: user._id, email: user.email, fullName: user.fullName },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// ================= Login (Send OTP if not verified) =================
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid password" });

    if (!user.isVerified) {
      const otp = generateOtp();
      user.otp = otp;
      user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
      await user.save();

      await sendOtpEmail(email, otp);

      return res.status(200).json({
        message: "OTP sent to your email. Please verify to complete login.",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token);

    res.status(200).json({
      message: "User logged in successfully",
      user: { _id: user._id, email: user.email, fullName: user.fullName },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// ================= Verify OTP =================
async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token);

    res.status(200).json({
      message: "OTP verified successfully, account activated!",
      user: { _id: user._id, email: user.email, fullName: user.fullName },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = { registerUser, loginUser, verifyOtp };
