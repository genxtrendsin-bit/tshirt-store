import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

  // ===== BASIC PRODUCT INFO =====

  name: {
    type: String,
    required: true,
    trim: true
  },

  price: {
    type: Number,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  stock: {
    type: Number,
    required: true
  },

  // ===== PRODUCT MEDIA =====

  images: {
    type: [String],   // multiple images for gallery
    default: []
  },

  // ===== PRODUCT VARIANTS =====

  sizes: {
    type: [String],   // S M L XL
    default: ["S", "M", "L", "XL"]
  },

  colors: {
    type: [String],   // red, blue, black etc
    default: []
  },

  // ===== PRODUCT CLASSIFICATION =====

  category: {
    type: String,
    default: "tshirt"
  },

  brand: String,

  material: String,

  fit: String,

  neckline: String,

  sleeveType: String,

  fabricWeight: String,

  pattern: String,

  gender: String,

  tags: {
    type: [String],   // AI recommendation keywords
    default: []
  },

  // ===== RATING SYSTEM =====

  rating: {
    type: Number,
    default: 0
  },

  numReviews: {
    type: Number,
    default: 0
  },

  // ===== DELIVERY SYSTEM =====

  codAvailable: {
  type: Boolean,
  default: true
}

},
  {
    timestamps: true   // createdAt + updatedAt
  });

export default mongoose.model("Product", productSchema);