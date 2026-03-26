import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  size: {
    type: String,
    default: "M"
  },
  quantity: {
    type: Number,
    default: 1
  },
  color: {
  type: String
}
});

export default mongoose.model("Cart", CartSchema);