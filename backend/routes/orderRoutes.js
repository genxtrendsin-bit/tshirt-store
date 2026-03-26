import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import adminAuth from "../middleware/adminAuth.js";
import { generateInvoice } from "../utils/generateInvoice.js";
import { createOrder } from "../controllers/orderController.js";
import Coupon from "../models/Coupon.js";


import { verifyToken } from "../middleware/authMiddleware.js";

import {
  sendOrderPending,
  sendOrderConfirmed,
  sendOrderShipped,
  sendOrderDelivered,
  sendOrderCancelled
} from "../services/emailService.js";

const router = express.Router();


/* =================================================
   CREATE ORDER AFTER VERIFIED PAYMENT
================================================= */

router.post("/checkout", verifyToken, async (req, res) => {
  try {

    const {
      items,
      shippingAddress,
      paymentId,
      paymentMethod,
      paymentDetails,
      codAdvancePaid,
      codAdvanceAmount,

      // 🔥 ADD THIS
      coupon,
      discount = 0

    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    /* =========================
       BUILD ORDER ITEMS
    ========================= */

    const orderItems = await Promise.all(
      items.map(async (item) => {

        const product = await Product.findById(item.product);
        if (!product) throw new Error("Product not found");

        return {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.image,
          size: item.size || null,
          color: item.color || null
        };
      })
    );

    /* =========================
       TOTAL
    ========================= */

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 🔥 FINAL PRICE
    let finalPrice = totalPrice - discount;
    finalPrice = Math.max(finalPrice, 0);

    /* =========================
       PAYMENT LOGIC
    ========================= */

    const method = paymentMethod?.toUpperCase() || "ONLINE";

    let paidAmount = 0;
    let pendingAmount = 0;
    let paymentStatus = "Pending";

    if (finalPrice === 0) {
      // 🔥 FREE ORDER
      paidAmount = 0;
      pendingAmount = 0;
      paymentStatus = "Paid";

    } else if (method === "COD") {

      const advance = codAdvancePaid ? (codAdvanceAmount || 100) : 0;

      paidAmount = advance;
      pendingAmount = finalPrice - advance;

      paymentStatus = advance > 0 ? "Partially Paid" : "Pending";

    } else {

      paidAmount = finalPrice;
      pendingAmount = 0;
      paymentStatus = "Paid";

    }

    /* =========================
       CREATE ORDER
    ========================= */

    const order = new Order({
      user: req.user.id,
      items: orderItems,

      totalPrice,
      discount,
      finalPrice,

      coupon: coupon || null,

      shippingAddress,

      paymentId,
      paymentMethod: method,
      paymentDetails,

      status: "Pending",

      codAdvancePaid: codAdvancePaid || false,
      codAdvanceAmount: codAdvanceAmount || 0,

      paidAmount,
      pendingAmount,
      paymentStatus,

      refund: { status: "None" }
    });

    await order.save();

    /* =========================
       MARK COUPON USED
    ========================= */

    if (coupon) {
      await Coupon.findByIdAndUpdate(coupon, {
        $addToSet: { usedBy: req.user.id }
      });
    }

    /* =========================
       EMAIL
    ========================= */

    const user = await User.findById(req.user.id);
    await sendOrderPending(order, user);

    res.json(order);

  } catch (err) {
    console.log("ORDER ERROR:", err);

    res.status(500).json({
      message: "Order creation failed"
    });
  }
});


/* =================================================
   GET USER ORDERS
================================================= */

router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


/* =================================================
   ADMIN: GET ALL ORDERS
================================================= */

router.get("/admin-orders", verifyToken, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch admin orders" });
  }
});


/* =================================================
   ADMIN: UPDATE ORDER STATUS
================================================= */

router.put("/admin/update-status/:id", verifyToken, async (req, res) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const { status, trackingId, trackingUrl, paidAmount, pendingAmount, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status !== undefined) order.status = status;
    if (trackingId !== undefined) order.trackingId = trackingId;
    if (trackingUrl !== undefined) order.trackingUrl = trackingUrl;

    if (paidAmount !== undefined) order.paidAmount = paidAmount;
    if (pendingAmount !== undefined) order.pendingAmount = pendingAmount;
    if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;

    await order.save();

    const user = await User.findById(order.user);

    if (status === "Confirmed") await sendOrderConfirmed(order, user);
    if (status === "Shipped") await sendOrderShipped(order, user);
    if (status === "Delivered") await sendOrderDelivered(order, user);

    if (status === "Cancelled") {
      await sendOrderCancelled(order, user);
    }

    res.json(order);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update order" });
  }

});


/* =================================================
   USER: CANCEL ORDER
================================================= */

router.put("/cancel/:id", verifyToken, async (req, res) => {

  try {

    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const now = new Date();
    const orderTime = new Date(order.createdAt);
    const diffHours = (now - orderTime) / (1000 * 60 * 60);

    if (diffHours > 2) {
      return res.status(400).json({
        message: "Order can only be cancelled within 2 hours"
      });
    }

    if (["Shipped", "Delivered"].includes(order.status)) {
      return res.status(400).json({ message: "Order already shipped" });
    }

    order.status = "Cancelled";
    order.cancelReason = reason;   // ✅ SAVE REASON
    if (order.paymentMethod === "COD" && order.codAdvancePaid) {

      order.refund = {
        status: "Not Applicable",
        note: "₹100 advance is non-refundable"
      };

    }
    await order.save();

    const user = await User.findById(order.user);
    await sendOrderCancelled(order, user);

    res.json({ message: "Order cancelled" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Cancel failed" });
  }

});

// USER INVOICE
router.get("/:id/invoice", verifyToken, async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    generateInvoice(order, res); // ✅ ONLY THIS

  } catch (err) {
    console.error("Invoice error:", err);

    if (!res.headersSent) {
      res.status(500).json({ message: "Invoice failed" });
    }
  }
});

// ADMIN SHIPPING INVOICE
router.get("/admin/:id/shipping-invoice", adminAuth, async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    generateInvoice(order, res);

  } catch (err) {
    console.error(err);

    if (!res.headersSent) {
      res.status(500).json({ message: "Error generating invoice" });
    }
  }
});



export default router;