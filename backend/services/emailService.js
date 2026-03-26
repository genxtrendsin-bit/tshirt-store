import { sendEmail } from "../utils/sendEmail.js";

import { orderPendingTemplate } from "../emailTemplates/orderPending.js";
import { orderConfirmedTemplate } from "../emailTemplates/orderConfirmed.js";
import { orderShippedTemplate } from "../emailTemplates/orderShipped.js";
import { orderDeliveredTemplate } from "../emailTemplates/orderDelivered.js";
import { orderCancelledTemplate } from "../emailTemplates/orderCancelled.js";


/* =====================================
   ORDER EMAILS
===================================== */

// ✅ Pending
export const sendOrderPending = async (order, user) => {
  await sendEmail({
    to: user.email,
    subject: "Order Received - Awaiting Confirmation",
    html: orderPendingTemplate(order, user)
  });
};

// ✅ Confirmed
export const sendOrderConfirmed = async (order, user) => {
  await sendEmail({
    to: user.email,
    subject: "Order Confirmed - GenXTrends",
    html: orderConfirmedTemplate(order, user)
  });
};

// ✅ Shipped
export const sendOrderShipped = async (order, user) => {
  await sendEmail({
    to: user.email,
    subject: "Your Order Has Shipped",
    html: orderShippedTemplate(order, user)
  });
};

// ✅ Delivered
export const sendOrderDelivered = async (order, user) => {
  await sendEmail({
    to: user.email,
    subject: "Order Delivered",
    html: orderDeliveredTemplate(order, user)
  });
};

// ✅ Cancelled
export const sendOrderCancelled = async (order, user) => {
  await sendEmail({
    to: user.email,
    subject: "Order Cancelled",
    html: orderCancelledTemplate(order, user)
  });
};


/* =====================================
   REFUND EMAILS (FIXED)
===================================== */

// ✅ Refund Processing
export const sendRefundProcessing = async (order, user) => {

  if (!user?.email) {
    console.log("❌ No email for refund processing:", user?._id);
    return;
  }

  const subject = "Your Refund is Being Processed ⏳";

  const html = `
    <h2>Refund Initiated</h2>

    <p>Hi ${user.name},</p>

    <p>Your refund request is currently being processed.</p>

    <p><b>Order ID:</b> ${order._id}</p>
    <p><b>Amount:</b> ₹${order.totalPrice}</p>

    <p>We will notify you once it is completed.</p>
  `;

  await sendEmail({
    to: user.email,
    subject,
    html
  });
};


// ✅ Refund Completed
export const sendRefundProcessed = async (order, user) => {

  if (!user?.email) {
    console.log("❌ No email for refund processed:", user?._id);
    return;
  }

  const subject = "Your Refund Has Been Processed 💰";

  const html = `
    <h2>Refund Completed</h2>

    <p>Hi ${user.name},</p>

    <p>Your refund has been successfully processed.</p>

    <p><b>Order ID:</b> ${order._id}</p>
    <p><b>Amount:</b> ₹${order.totalPrice}</p>
    <p><b>Refund ID:</b> ${order.refund?.refundId || "N/A"}</p>
    <p><b>Status:</b> ${order.refund?.status || "Completed"}</p>

    <p>The amount will reflect in your account within 3–5 business days.</p>

    <br/>

    <p>Thank you for shopping with us 🙏</p>
  `;

  await sendEmail({
    to: user.email,
    subject,
    html
  });
};