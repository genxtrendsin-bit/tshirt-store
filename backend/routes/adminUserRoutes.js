import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  toggleBanUser,
  toggleAdmin,
} from "../controllers/adminUserController.js";
console.log("toggleAdmin:", toggleAdmin);
console.log("toggleBanUser:", toggleBanUser);
const router = express.Router();
router.get("/test", (req, res) => {
  res.send("AdminUserRoutes working");
});


router.put("/:id", adminAuth, updateUser);
router.put("/:id/role", adminAuth, toggleAdmin);
router.put("/:id/ban", adminAuth, toggleBanUser);
router.delete("/:id", adminAuth, deleteUser);
router.get("/", adminAuth, getAllUsers);

export default router;