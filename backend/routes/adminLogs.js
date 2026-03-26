import express from "express";
import ActivityLog from "../models/ActivityLog.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/admin/logs",
  verifyToken,
  verifyAdmin,
  async (req, res) => {

    try {

      const logs = await ActivityLog
        .find()
        .populate("admin", "name email")
        .sort({ createdAt: -1 })
        .limit(100);

      res.json(logs);

    } catch (err) {

      console.log(err);
      res.status(500).json({ message: "Failed to fetch logs" });

    }

  }
);

export default router;