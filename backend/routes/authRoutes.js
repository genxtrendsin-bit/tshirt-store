import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import otpGenerator from "otp-generator";
import Otp from "../models/Otp.js";
import { sendEmailOtp } from "../utils/sendEmailOtp.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ==========================
   CONFIG
========================== */

const OTP_EXPIRY_MINUTES = 1;
const OTP_RATE_LIMIT = 3;
const OTP_WINDOW_MINUTES = 5;

/* ==========================
   HELPERS
========================== */

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,       // ✅ CRITICAL FIX
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const getSafeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  addresses: user.addresses,
  role: user.role
});

/* ==========================
   REGISTER
========================== */

router.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be 8+ chars" });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password // 🔥 plain password
    });

    const token = generateToken(user);

    res.json({
      token,
      user: getSafeUser(user)
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Register failed" });
  }

});

/* ==========================
   LOGIN
========================== */

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // ✅ FIRST CHECK USER
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ THEN BAN CHECK
    if (user.isBanned) {
      return res.status(403).json({
        message: "Your account has been banned"
      });
    }

    // ✅ GOOGLE USER CHECK
    if (!user.password) {
      return res.status(400).json({ message: "Use Google login" });
    }

    // ✅ PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Entered:", password);
    console.log("Stored:", user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    /* ===== ADMIN 2FA ===== */

    if (user.role === "admin") {

      const windowStart = new Date(
        Date.now() - OTP_WINDOW_MINUTES * 60 * 1000
      );

      const attempts = await Otp.countDocuments({
        email,
        purpose: "admin-login",
        createdAt: { $gte: windowStart }
      });

      if (attempts >= OTP_RATE_LIMIT) {
        return res.status(429).json({
          message: "Too many OTP attempts"
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      console.log("Generated OTP:", otp);

      const hashedOtp = await bcrypt.hash(otp, 10);

      const expiresAt = new Date(
        Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
      );

      await Otp.create({
        email,
        otp: hashedOtp,
        purpose: "admin-login",
        expiresAt
      });

      await sendEmailOtp(email, otp);

      return res.json({
        admin2fa: true,
        email
      });

    }

    const token = generateToken(user);

    res.json({
      token,
      user: getSafeUser(user)
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }

});

/* ==========================
   GOOGLE LOGIN
========================== */

router.post("/google", async (req, res) => {

  try {

    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (user && user.isBanned) {
      return res.status(403).json({
        success: false,
        message: "Your account has been banned"
      });
    }

    if (!user) {

      user = await User.create({
        name,
        email,
        googleLogin: true,
        avatar: picture
      });

    }



    const jwtToken = generateToken(user);

    res.json({
      token: jwtToken,
      user: getSafeUser(user)
    });

  } catch (err) {
    console.error("GOOGLE ERROR:", err);

    res.status(500).json({
      message: "Google login failed"
    });
  }

});

/* ==========================
   SEND OTP (Signup)
========================== */

router.post("/send-otp", async (req, res) => {

  try {

    const { email, purpose } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const windowStart = new Date(
      Date.now() - OTP_WINDOW_MINUTES * 60 * 1000
    );

    const attempts = await Otp.countDocuments({
      email,
      purpose,
      createdAt: { $gte: windowStart }
    });

    if (attempts >= OTP_RATE_LIMIT) {
      return res.status(429).json({
        message: "Too many OTP requests. Try again after 5 minutes."
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("Generated OTP:", otp);

    const hashedOtp = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    await Otp.create({
      email,
      otp: hashedOtp,
      purpose,
      expiresAt
    });

    try {

      await sendEmailOtp(email, otp);

    } catch (e) {

      console.log("Email failed but OTP created");
      console.log("OTP:", otp);

    }

    res.json({
      message: "OTP sent successfully"
    });

  } catch (err) {

    console.error("SEND OTP ERROR:", err);

    res.status(500).json({
      message: "OTP sending failed"
    });

  }

});

/* ==========================
   VERIFY OTP
========================== */

router.post("/verify-otp", async (req, res) => {
  try {
    let { email, otp } = req.body;

    console.log("📥 BODY:", req.body);

    if (!otp) {
      return res.status(400).json({ message: "OTP missing" });
    }

    otp = otp.toString().trim();

    const record = await Otp.findOne({ email })
      .sort({ createdAt: -1 });

    console.log("📦 DB RECORD:", record);

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    console.log("🧠 Entered OTP:", otp);
    console.log("🔐 Stored Hash:", record.otp);

    const valid = await bcrypt.compare(otp, record.otp);

    console.log("✅ Compare Result:", valid);

    if (!valid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    await Otp.deleteMany({ email });

    res.json({ message: "OTP verified" });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Verification failed" });
  }
});

/* ==========================
   VERIFY ADMIN OTP
========================== */

router.post("/verify-admin-login", async (req, res) => {

  try {

    const { email, otp } = req.body;

    const record = await Otp.findOne({
      email,
      purpose: "admin-login"
    }).sort({ createdAt: -1 });

    if (!record) return res.status(400).json({ message: "OTP not found" });

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const valid = await bcrypt.compare(otp, record.otp);

    if (!valid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findOne({ email });

    const token = generateToken(user);

    await Otp.deleteMany({
      email,
      purpose: "admin-login"
    });

    res.json({
      token,
      user: getSafeUser(user)
    });

  } catch (err) {
    console.error("ADMIN OTP ERROR:", err);
    res.status(500).json({ message: "Verification failed" });
  }

});

/* ==========================
   SEND RESET OTP
========================== */

router.post("/send-reset-otp", async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const windowStart = new Date(
      Date.now() - OTP_WINDOW_MINUTES * 60 * 1000
    );

    const attempts = await Otp.countDocuments({
      email,
      purpose: "reset",
      createdAt: { $gte: windowStart }
    });

    if (attempts >= OTP_RATE_LIMIT) {
      return res.status(429).json({
        message: "Too many OTP requests. Try again after 5 minutes."
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("Generated OTP:", otp);

    const hashedOtp = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    await Otp.create({
      email,
      otp: hashedOtp,
      purpose: "reset",
      expiresAt
    });

    await sendEmailOtp(email, otp);

    res.json({
      message: "Reset OTP sent"
    });

  } catch (err) {

    console.error("RESET OTP ERROR:", err);

    res.status(500).json({
      message: "Failed to send reset OTP"
    });

  }

});

/* ==========================
   RESET PASSWORD
========================== */

router.post("/reset-password", async (req, res) => {

  try {

    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        message: "Password is required"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;

    await user.save();

    await Otp.deleteMany({ email });

    res.json({
      message: "Password reset successful"
    });

  } catch (err) {

    console.error("RESET PASSWORD ERROR:", err);

    res.status(500).json({
      message: "Password reset failed"
    });

  }

});

export default router;