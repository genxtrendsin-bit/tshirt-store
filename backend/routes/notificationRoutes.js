import express from "express";
import {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
  adminDeleteNotification
} from "../controllers/notificationController.js";

import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// USER
router.get("/", verifyToken, getNotifications);
router.put("/read/:id", verifyToken, markAsRead);
router.delete("/:id", verifyToken, deleteNotification);

// ADMIN
router.post("/admin", verifyToken, verifyAdmin, createNotification);
router.delete("/admin/:id", verifyToken, verifyAdmin, adminDeleteNotification);

export default router;