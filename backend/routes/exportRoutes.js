import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import { exportData } from "../controllers/exportController.js";

const router = express.Router();

router.get("/:type", verifyToken, verifyAdmin, exportData);

export default router;