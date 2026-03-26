import Coupon from "../models/Coupon.js";

/* =========================
   🔥 CREATE COUPON (ADMIN)
========================= */
export const createCoupon = async (req, res) => {
  try {

    const { code, type, value } = req.body;

    if (!code || !type || !value) {
      return res.status(400).json({
        message: "Code, type and value are required"
      });
    }

    // 🔥 prevent duplicate
    const exists = await Coupon.findOne({ code: code.toUpperCase() });

    if (exists) {
      return res.status(400).json({
        message: "Coupon already exists"
      });
    }

    const coupon = await Coupon.create({
      ...req.body,
      code: code.toUpperCase()
    });

    res.json(coupon);

  } catch (err) {
    console.error("CREATE COUPON ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   🔥 GET COUPONS (ADMIN)
========================= */
export const getAdminCoupons = async (req, res) => {
  try {

    const coupons = await Coupon.find()
      .sort({ createdAt: -1 });

    res.json(coupons);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================
   🔥 GET ACTIVE COUPONS (USER)
========================= */
export const getCoupons = async (req, res) => {
  try {

    const coupons = await Coupon.find({
      isActive: true
    }).sort({ createdAt: -1 });

    res.json(coupons);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================
   🔥 DELETE COUPON (ADMIN)
========================= */
export const deleteCoupon = async (req, res) => {
  try {

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    await coupon.deleteOne();

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================
   🔥 APPLY COUPON (USER)
========================= */
export const applyCoupon = async (req, res) => {
  try {

    const { code, total } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon required" });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase()
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // ❌ inactive
    if (!coupon.isActive) {
      return res.status(400).json({ message: "Coupon is disabled" });
    }

    // ❌ already used
    if (coupon.usedBy.some(id => id.toString() === req.user._id.toString())) {
  return res.status(400).json({
    message: "❌ You have already used this coupon"
  });
}

    // ❌ expired
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    // ❌ min order
    if (coupon.minOrder && total < coupon.minOrder) {
      return res.status(400).json({
        message: `Minimum order ₹${coupon.minOrder}`
      });
    }

    let discount = 0;

    if (coupon.type === "percentage") {
      discount = (total * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    // 🔥 prevent over discount
    discount = Math.min(discount, total);

    res.json({
      discount,
      coupon
    });

  } catch (err) {
    console.error("APPLY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================
   🔥 TOGGLE COUPON (ADMIN)
========================= */
export const toggleCoupon = async (req, res) => {
  try {

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    coupon.isActive = !coupon.isActive;

    await coupon.save();

    res.json({
      message: "Updated",
      isActive: coupon.isActive
    });

  } catch (err) {
    console.error("TOGGLE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================
   🔥 MARK USED (INTERNAL)
========================= */
export const markCouponUsed = async (couponId, userId) => {
  try {

    await Coupon.findByIdAndUpdate(couponId, {
      $addToSet: { usedBy: userId }
    });

  } catch (err) {
    console.log("MARK USED ERROR:", err);
  }
};

export const getCouponStats = async (req, res) => {
  try {

    const coupon = await Coupon.findById(req.params.id)
      .populate("usedBy", "name email");

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const usedCount = coupon.usedBy.length;

    const isExpired =
      coupon.expiresAt && new Date() > coupon.expiresAt;

    res.json({
      ...coupon._doc,
      usedCount,
      isExpired
    });

  } catch (err) {
    console.error("COUPON STATS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};