import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

  title: String,
  message: String,

  type: {
  type: String,
  enum: ["order", "offer", "system", "general"], // 🔥 ADD THIS
  default: "general"
},

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // 🔥 NEW
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  deletedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]

}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);