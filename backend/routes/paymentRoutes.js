import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { verifyToken } from "../middleware/authMiddleware.js";
import RefundLog from "../models/RefundLog.js";
import { sendRefundProcessed, sendRefundProcessing } from "../services/emailService.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY_ID);


/* =====================================
   CREATE ORDER (ALREADY CORRECT)
===================================== */

router.post("/create-order", verifyToken, async (req, res) => {

  try {

    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR"
    });

    res.json(order);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Payment failed"
    });

  }

});


/* =====================================
   VERIFY PAYMENT (NEW - IMPORTANT)
===================================== */

router.post("/verify", verifyToken, async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    /* =========================
       DEMO MODE BYPASS
    ========================= */

    if (process.env.DEMO_MODE === "true") {
      return res.json({
        success: true,
        paymentId: razorpay_payment_id || "demo_payment",
        method: "upi",
        email: "demo@test.com",
        contact: "9999999999"
      });
    }

    /* =========================
       REAL VERIFICATION
    ========================= */

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    res.json({
      success: true,
      paymentId: razorpay_payment_id,
      method: payment.method,
      email: req.user.email,
      contact: payment.contact
    });

  } catch (err) {

    console.log("VERIFY ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Verification failed"
    });

  }

});

/* =====================================
   PROCESS REFUND (UPDATED)
===================================== */

router.post("/refund", verifyToken, async (req, res) => {

  try {

    const { orderId, paymentId, amount } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.refund?.status === "Completed") {
      return res.status(400).json({
        message: "Already refunded"
      });
    }

    const user = await User.findById(order.user);

    /* =========================
       STEP 1: SET PROCESSING
    ========================= */

    order.refund = {
      status: "Processing",
      refundId: null,
      refundedAt: null
    };

    await order.save();

    /* 🔥 SEND PROCESSING EMAIL */
    await sendRefundProcessing(order, user);

    let refundId;
    let status = "Completed";

    /* =========================
       STEP 2: PROCESS REFUND
    ========================= */

    if (process.env.DEMO_MODE === "true") {

      refundId = "demo_" + Date.now();

    } else {

      const refund = await razorpay.payments.refund(paymentId, {
        amount: amount * 100
      });

      refundId = refund.id;
    }

    /* =========================
       STEP 3: MARK COMPLETED
    ========================= */

    order.refund = {
      status,
      refundId,
      refundedAt: new Date()
    };

    await order.save();

    /* 🔥 SAVE REFUND LOG */
    await RefundLog.create({
      orderId: order._id,
      userId: order.user,
      amount: order.totalPrice,
      paymentMethod: order.paymentMethod,
      paymentDetails: order.paymentDetails,
      refundId,
      status
    });

    /* 🔥 SEND COMPLETED EMAIL */
    await sendRefundProcessed(order, user);

    res.json({
      success: true,
      message: "Refund processed successfully"
    });

    console.log("USER DATA:", user);
    console.log("USER EMAIL:", user?.email);

  } catch (err) {

    console.log("REFUND ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Refund failed"
    });

  }

});

router.get("/admin/refund-logs", verifyToken, async (req, res) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin only"
      });
    }

    const logs = await RefundLog.find()
      .populate("orderId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(logs);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to fetch refund logs"
    });

  }

});

export default router;