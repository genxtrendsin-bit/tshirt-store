import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },

      name: {
        type: String,
        required: true
      },

      price: {
        type: Number,
        required: true
      },

      quantity: {
        type: Number,
        required: true
      },

      image: {
        type: String
      },

      size: {
        type: String
      },

      color: {
        type: String
      }
    },
  ],

  cancelReason: {
    type: String,
    default: ""
  },

  totalPrice: {
    type: Number,
    required: true
  },

  shippingAddress: {

    fullName: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    street: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    state: {
      type: String,
      required: true
    },

    country: {
      type: String,
      required: true
    },

    postalCode: {
      type: String,
      required: true
    }

  },

  paidAmount: {
    type: Number,
    default: 0
  },

  pendingAmount: {
    type: Number,
    default: 0
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Partially Paid", "Paid"],
    default: "Pending"
  },

  paymentId: {
    type: String
  },

  paymentMethod: {
  type: String,
  enum: ["COD", "ONLINE", "UPI", "CARD", "FREE"],
  default: "ONLINE"
},

  codAdvancePaid: {
    type: Boolean,
    default: false
  },
  codAdvanceAmount: {
    type: Number,
    default: 0
  },

  paymentDetails: {
    upiId: String,
    cardLast4: String,
    cardBrand: String
  },

  refund: {
    status: {
      type: String,
      enum: ["None", "Processing", "Completed"],
      default: "None"
    },
    refundId: String,
    refundedAt: Date
  },

  status: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ],
    default: "Pending"
  },

  trackingId: {
    type: String
  },

  trackingUrl: {
    type: String
  },

  discount: {
  type: Number,
  default: 0
},

  coupon: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Coupon",
  default: null
},

  finalPrice: {
  type: Number,
  default: 0
}

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);