import Order from "../models/Order.js";
import { markCouponUsed } from "./couponController.js";

/* =========================
   🔥 CREATE ORDER
========================= */
export const createOrder = async (req, res) => {
  try {

    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      coupon,
      discount = 0
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // 🔥 CALCULATE TOTAL
    const totalPrice = items.reduce(
      (acc, item) => acc + item.quantity * (item.price || 0),
      0
    );

    // 🔥 FINAL PRICE
    let finalPrice = totalPrice - discount;
    finalPrice = Math.max(finalPrice, 0);

    // 🔥 CREATE ORDER
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,

      totalPrice,
      discount,
      finalPrice,

      coupon: coupon || null,

      paymentMethod,
      paymentDetails
    });

    // 🔥 MARK COUPON USED
    if (coupon) {
  await Coupon.findByIdAndUpdate(coupon, {
    $addToSet: { usedBy: req.user._id }
  });
}

    res.json(order);

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
};