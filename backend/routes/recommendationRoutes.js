import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===== CUSTOMERS ALSO BOUGHT ===== */

router.get("/also-bought/:productId", async (req,res)=>{

try{

const productId = req.params.productId;

/* find orders containing this product */

const orders = await Order.find({
"items.product": productId
});

/* collect other products in those orders */

let otherProducts = [];

orders.forEach(order=>{
order.items.forEach(item=>{
if(item.product.toString() !== productId){
otherProducts.push(item.product);
}
});
});

/* count frequency */

const counts = {};

otherProducts.forEach(id=>{
counts[id] = (counts[id] || 0) + 1;
});

/* sort most frequent */

const sorted = Object.keys(counts)
.sort((a,b)=>counts[b]-counts[a])
.slice(0,6);

/* fetch products */

const products = await Product.find({
_id:{ $in: sorted }
});

res.json(products);

}catch(err){

console.log(err);
res.status(500).json({message:"Recommendation error"});

}

});

/* ===== USER RECOMMENDATIONS ===== */

router.get("/user", verifyToken, async (req,res)=>{

try{

const wishlist = await Wishlist.find({
user:req.user.id
}).populate("product");

const categories = wishlist.map(w=>w.product.category);

const products = await Product.find({
category:{ $in: categories }
}).limit(8);

res.json(products);

}catch(err){

console.log(err);
res.status(500).json({message:"User recommendation error"});

}

});

/* ===== TRENDING PRODUCTS ===== */

router.get("/trending", async (req,res)=>{

try{

const products = await Product.find()
.sort({ numReviews:-1, rating:-1 })
.limit(8);

res.json(products);

}catch(err){

console.log(err);
res.status(500).json({message:"Trending error"});

}

});

router.get("/similar/:productId", async (req, res) => {

  try {

    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const recommendations = await Product.find({
      _id: { $ne: productId },
      category: product.category
    }).limit(8);

    res.json(recommendations);

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Failed to fetch recommendations" });

  }

});

export default router;



