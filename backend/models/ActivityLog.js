import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  action: {
    type: String,
    required: true
  },

  entity: {
    type: String
  },

  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },

  description: {
    type: String
  }

}, { timestamps: true });

export default mongoose.model("ActivityLog", activityLogSchema);