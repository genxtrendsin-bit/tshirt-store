import express from "express";
import Wishlist from "../models/Wishlist.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


/* ADD TO WISHLIST */

router.post("/add",verifyToken,async(req,res)=>{

try{

const existing = await Wishlist.findOne({
user:req.user.id,
product:req.body.productId
});

if(existing){
return res.json({message:"Already in wishlist"});
}

const item = new Wishlist({
user:req.user.id,
product:req.body.productId
});

await item.save();

res.json(item);

}catch(err){

console.log(err);
res.status(500).json({message:"Wishlist failed"});

}

});


/* GET USER WISHLIST */

router.get("/",verifyToken,async(req,res)=>{

const items = await Wishlist.find({
user:req.user.id
}).populate("product");

res.json(items);

});


/* REMOVE ITEM */

// ===== REMOVE FROM WISHLIST =====
router.delete("/:productId", verifyToken, async (req,res)=>{

try{

await Wishlist.findOneAndDelete({
user:req.user.id,
product:req.params.productId
});

res.json({message:"Removed from wishlist"});

}catch(err){

console.log(err);
res.status(500).json({message:"Remove failed"});

}

});


export default router;