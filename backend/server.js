// ===============================
// 🌍 ENV (MUST BE FIRST)
// ===============================
import "./config/env.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import path from "path";
import connectDB from "./config/db.js";

// ===============================
// 📦 ROUTES
// ===============================
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import adminLogsRoutes from "./routes/adminLogs.js";
import userRoutes from "./routes/userRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";

const app = express();

// ===============================
// ⚠️ TRUST PROXY (RENDER FIX)
// ===============================
app.set("trust proxy", 1);

// ===============================
// 🛢 DATABASE
// ===============================
connectDB();

// ===============================
// 🧠 BODY PARSER (MOVE UP)
// ===============================
app.use(express.json({ limit: "10mb" }));

// ===============================
// 🔐 SECURITY
// ===============================
app.use(helmet());

// Mongo sanitize (safe usage)
app.use((req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body);
  }
  next();
});

// ===============================
// 🚫 RATE LIMIT (STABLE)
// ===============================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log("🚫 Rate limit hit:", req.ip);
    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later",
    });
  },
});

app.use("/api", limiter); // ✅ apply only to API

// ===============================
// 🌐 CORS (PRODUCTION SAFE)
// ===============================
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// ===============================
// 📁 STATIC FILES (IMPORTANT)
// ===============================
app.use("/uploads", express.static(path.resolve("uploads")));

// ===============================
// 🚀 ROUTES
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api", adminLogsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/export", exportRoutes);

// ===============================
// ❤️ HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.send("🚀 Tshirt Store API Running");
});

// ===============================
// 🚨 GLOBAL ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===============================
// 🚀 START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Server running on port ${PORT}`);
});