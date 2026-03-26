import express from "express";
import {
  createCoupon,
  getCoupons,
  deleteCoupon,
  applyCoupon,
  toggleCoupon,
  getAdminCoupons,
  getCouponStats
} from "../controllers/couponController.js";

import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin", verifyToken, verifyAdmin, getAdminCoupons);
router.post("/admin", verifyToken, verifyAdmin, createCoupon);
router.get("/", verifyToken, getCoupons);
router.delete("/admin/:id", verifyToken, verifyAdmin, deleteCoupon);
router.put(
  "/admin/toggle/:id",
  verifyToken,
  verifyAdmin,
  toggleCoupon
);
router.post("/apply", verifyToken, applyCoupon);
router.get(
  "/admin/:id",
  verifyToken,
  verifyAdmin,
  getCouponStats
);

export default router;