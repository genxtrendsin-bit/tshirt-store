// ===== IMPORTS =====
import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { getDashboardStats } from "../controllers/adminController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminAuth.js";
import { getTopProducts } from "../controllers/adminController.js";

const router = express.Router();


// ===== ADMIN STATS =====
router.get("/stats", verifyToken, verifyAdmin, async (req,res)=>{

try{

const products = await Product.countDocuments();
const orders = await Order.countDocuments();
const users = await User.countDocuments();

const revenue = await Order.aggregate([
{ $group:{ _id:null, total:{ $sum:"$totalPrice"} } }
]);

res.json({
products,
orders,
users,
revenue: revenue[0]?.total || 0
});

}catch(err){

console.log(err);
res.status(500).json({message:"Stats error"});

}

});

router.get("/dashboard", adminAuth, getDashboardStats);

router.get("/top-products", adminAuth, getTopProducts);

router.get("/top-products", getTopProducts);


// ===== GET ALL USERS =====
router.get("/users", verifyToken, verifyAdmin, async (req,res)=>{

try{

const users = await User.find().select("-password");

res.json(users);

}catch(err){

console.log(err);

res.status(500).json({
message:"Failed to fetch users"
});

}

});

export default router;