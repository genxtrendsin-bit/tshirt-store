import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* =========================
   ADDRESS SCHEMA
========================= */

const addressSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true,
    trim: true
  },

  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10,11}$/
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
    default: "India"
  },

  postalCode: {
    type: String,
    required: true,
    match: /^[0-9]{6}$/
  },

  isDefault: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });


/* =========================
   USER SCHEMA
========================= */

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    index: true
  },

  password: {
    type: String,
    required: function () {
      return !this.googleLogin;
    }
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  googleLogin: {
    type: Boolean,
    default: false
  },

  avatar: {
    type: String,
    default: ""
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },

  addresses: [addressSchema]

}, { timestamps: true });


/* =========================
   PASSWORD HASHING
========================= */

userSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);

});


/* =========================
   PASSWORD MATCH METHOD
========================= */

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


/* =========================
   DEFAULT ADDRESS HANDLER
========================= */

userSchema.methods.setDefaultAddress = function (addressId) {

  this.addresses = this.addresses.map(addr => ({
    ...addr._doc,
    isDefault: addr._id.toString() === addressId
  }));

};


const User = mongoose.model("User", userSchema);

export default User;