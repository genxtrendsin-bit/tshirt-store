import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function adminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 FETCH REAL USER FROM DB
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    if (user.isBanned) {
  return res.status(403).json({
    message: "Account is banned"
  });
}

    if (user.role !== "admin") {
  return res.status(403).json({
    message: "Admin access required"
  });
}

    // 🔥 NOW req.user HAS _id
    req.user = user;

    next();

  } catch (err) {
    console.error("ADMIN AUTH ERROR:", err);

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}