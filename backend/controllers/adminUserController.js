import User from "../models/User.js";
import { sendAccountStatusEmail } from "../utils/sendAccountStatusEmail.js";

// 🔹 GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted" });

  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 BAN / UNBAN
export const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = !user.isBanned;

    await user.save();

    // 🔥 SEND EMAIL
    await sendAccountStatusEmail(user.email, user.isBanned);

    res.json({
      message: user.isBanned
        ? "User banned & email sent"
        : "User unbanned & email sent",
      isBanned: user.isBanned,
    });

  } catch (err) {
    console.error("toggleBan error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 PROMOTE / DEMOTE
export const toggleAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 ROLE SWITCH
    user.role = user.role === "admin" ? "user" : "admin";

    await user.save();

    res.json({
      message: "Role updated",
      role: user.role,
    });

  } catch (err) {
    console.error("toggleAdmin error:", err);
    res.status(500).json({ message: err.message });
  }
};