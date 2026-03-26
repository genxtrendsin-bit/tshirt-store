import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },

  type: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true
  },

  value: Number,

  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number },

  usageLimit: { type: Number, default: 1 },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  expiresAt: Date,

  active: { type: Boolean, default: true },

  userType: {
    type: String,
    enum: ["all", "new"],
    default: "all"
  },

  isActive: {
  type: Boolean,
  default: true   // 🔥 IMPORTANT
},

  isAutoApply: { type: Boolean, default: false } // 🔥 SPECIAL

}, { timestamps: true });

export default mongoose.model("Coupon", couponSchema);