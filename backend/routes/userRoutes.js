import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../middleware/uploadAvatar.js";
import bcrypt from "bcryptjs";
console.log("USER ROUTES LOADED");

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("User routes working");
});

/* =========================
   HELPER: SAFE USER RESPONSE
========================= */
const getSafeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  addresses: user.addresses,
  role: user.role
});


/* =========================
   UPDATE PROFILE
========================= */
router.put("/update-profile", verifyToken, async (req, res) => {

  try {

    const { name } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;

    await user.save();

    res.json(getSafeUser(user));

  } catch (err) {
    console.log("PROFILE UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }

});


/* =========================
   UPLOAD AVATAR
========================= */
import cloudinary from "../config/cloudinary.js";

router.put(
  "/upload-avatar",
  verifyToken,
  uploadAvatar.single("avatar"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findById(req.user.id);

      /* 🔥 UPLOAD TO CLOUDINARY */
      const result = await new Promise((resolve, reject) => {

        cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);

      });

      user.avatar = result.secure_url;

      await user.save();

      res.json({
        avatar: user.avatar,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          addresses: user.addresses
        }
      });

    } catch (err) {

      console.log("AVATAR ERROR:", err);
      res.status(500).json({ message: "Upload failed" });

    }

  }
);


/* =========================
   REMOVE AVATAR
========================= */
router.delete("/remove-avatar", verifyToken, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    user.avatar = "";

    await user.save();

    res.json(getSafeUser(user));

  } catch (err) {
    console.log("REMOVE AVATAR ERROR:", err);
    res.status(500).json({ message: "Failed to remove avatar" });
  }

});


/* =========================
   CHANGE PASSWORD
========================= */
router.put("/change-password", verifyToken, async (req, res) => {

  try {

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findById(req.user.id);

    

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    user.password = newPassword; // 🔥 auto hashed by schema

    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.log("PASSWORD ERROR:", err);
    res.status(500).json({ message: "Failed" });
  }

});


/* =========================
   ADD ADDRESS
========================= */
router.post("/address", verifyToken, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    const newAddress = req.body;

    // 🔥 if first address → make default
    if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);

    await user.save();

    res.json(getSafeUser(user));

  } catch (err) {
    console.log("ADD ADDRESS ERROR:", err);
    res.status(500).json({ message: "Failed to add address" });
  }

});


/* =========================
   DELETE ADDRESS
========================= */
router.delete("/address/:id", verifyToken, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    const addressToDelete = user.addresses.find(
      a => a._id.toString() === req.params.id
    );

    if (!addressToDelete) {
      return res.status(404).json({ message: "Address not found" });
    }

    const wasDefault = addressToDelete.isDefault;

    user.addresses = user.addresses.filter(
      a => a._id.toString() !== req.params.id
    );

    // 🔥 if deleted default → set new default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json(getSafeUser(user));

  } catch (err) {
    console.log("DELETE ADDRESS ERROR:", err);
    res.status(500).json({ message: "Failed to delete address" });
  }

});


/* =========================
   SET DEFAULT ADDRESS
========================= */
router.put("/address/default/:id", verifyToken, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    user.setDefaultAddress(req.params.id);

    await user.save();

    res.json(getSafeUser(user));

  } catch (err) {
    console.log("DEFAULT ADDRESS ERROR:", err);
    res.status(500).json({ message: "Failed to set default" });
  }

});


export default router;