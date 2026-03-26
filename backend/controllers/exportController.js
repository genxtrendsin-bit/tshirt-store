import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

export const exportData = async (req, res) => {
  try {

    const { type } = req.params;
    const { from, to } = req.query;

    const filter = {};

    // ================= DATE FILTER =================
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    // ================= SWITCH =================
    switch (type) {

      // ================= USERS =================
      case "users": {
        const users = await User.find(filter)
          .select("name email role createdAt")
          .lean();

        return res.json(users);
      }

      // ================= ORDERS =================
      case "orders": {
        const orders = await Order.find(filter)
          .populate("user", "email")
          .select("user totalPrice discount finalPrice status createdAt")
          .lean();

        return res.json(orders);
      }

      // ================= PRODUCTS =================
      case "products": {
        const products = await Product.find(filter)
          .select("name price countInStock createdAt")
          .lean();

        return res.json(products);
      }

      // ================= COUPONS =================
      case "coupons": {

        const coupons = await Coupon.find(filter)
          .select("code type value minOrder isActive isAutoApply expiresAt createdAt usedBy")
          .lean();

        const formattedCoupons = coupons.map(c => {

          const isExpired =
            c.expiresAt && new Date() > new Date(c.expiresAt);

          return {
            code: c.code,
            type: c.type,
            value: c.type === "percentage"
              ? `${c.value}%`
              : `₹${c.value}`,
            minOrder: c.minOrder || 0,
            usedCount: c.usedBy?.length || 0,
            autoApply: c.isAutoApply ? "Yes" : "No",
            status: c.isActive ? "Active" : "Disabled",
            expiry: isExpired
              ? "Expired"
              : (c.expiresAt
                  ? new Date(c.expiresAt).toLocaleDateString()
                  : "No expiry"),
            createdAt: new Date(c.createdAt).toLocaleDateString()
          };
        });

        return res.json(formattedCoupons);
      }

      // ================= DEFAULT =================
      default:
        return res.status(400).json({
          message: "Invalid export type"
        });
    }

  } catch (err) {
    console.error("EXPORT ERROR:", err);

    res.status(500).json({
      message: "Export failed",
      error: err.message
    });
  }
};