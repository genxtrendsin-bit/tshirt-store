import mongoose from "mongoose";

const refundLogSchema = new mongoose.Schema({

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  amount: Number,

  paymentMethod: String,

  paymentDetails: {
    upiId: String,
    cardLast4: String,
    cardBrand: String
  },

  refundId: String,

  status: {
    type: String,
    enum: ["Pending", "Processing", "Completed", "Failed"],
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("RefundLog", refundLogSchema);