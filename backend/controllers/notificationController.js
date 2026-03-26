import Notification from "../models/Notification.js";
import mongoose from "mongoose";

/* =========================
   🔥 CREATE
========================= */
export const createNotification = async (req, res) => {
  try {

    console.log("REQ USER:", req.user);
    console.log("BODY:", req.body);

    // 🔒 AUTH CHECK
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, message, type } = req.body;

    // 🔒 VALIDATION
    if (!title || !message) {
      return res.status(400).json({ message: "Title & message required" });
    }

    // 🔥 SAFE TYPE (NO ENUM CRASH EVER)
    const allowedTypes = ["general", "offer", "order", "system"];
    const safeType = allowedTypes.includes(type) ? type : "general";

    // 🔥 SAFE USER ID
    const userId = req.user._id || req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "Invalid user" });
    }

    const notification = await Notification.create({
      title,
      message,
      type: safeType,
      createdBy: userId
    });

    res.json(notification);

  } catch (err) {
    console.error("CREATE ERROR FULL:", err);
    res.status(500).json({ message: err.message });
  }
};



/* =========================
   🔥 GET FOR USER
========================= */
export const getNotifications = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id || req.user.id;

    const notifications = await Notification.find({
      deletedBy: { $ne: userId }
    })
      .sort({ createdAt: -1 })
      .lean(); // 🔥 performance + safer

    res.json(notifications);

  } catch (err) {
    console.error("GET NOTIFICATIONS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   🔥 MARK AS READ
========================= */
export const markAsRead = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    await Notification.findByIdAndUpdate(id, {
      $addToSet: { readBy: req.user._id || req.user.id }
    });

    res.json({ message: "Marked as read" });

  } catch (err) {
    console.error("MARK READ ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   🔥 DELETE FOR USER
========================= */
export const deleteNotification = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    await Notification.findByIdAndUpdate(id, {
      $addToSet: { deletedBy: req.user._id || req.user.id }
    });

    res.json({ message: "Deleted" });

  } catch (err) {
    console.error("DELETE USER NOTIF ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   🔥 ADMIN DELETE (GLOBAL)
========================= */
export const adminDeleteNotification = async (req, res) => {
  try {

    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    await Notification.findByIdAndDelete(id);

    res.json({ message: "Deleted globally" });

  } catch (err) {
    console.error("ADMIN DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

