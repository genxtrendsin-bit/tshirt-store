import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    // ✅ CHECK HEADER FORMAT
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ EXTRACT TOKEN
    const token = authHeader.split(" ")[1];

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded._id;

    // ✅ FETCH USER (lean for performance)
    const user = await User.findById(userId).select("_id role isBanned email");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🚫 BAN CHECK
    if (user.isBanned) {
      return res.status(403).json({
        message: "Your account has been banned"
      });
    }

    // ✅ ATTACH SAFE USER OBJECT
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email
    };

    next();

  } catch (err) {

    // 🔥 TOKEN EXPIRED / INVALID
    return res.status(401).json({
      message: "Invalid or expired token"
    });

  }
};

export const verifyAdmin = (req, res, next) => {

  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};