import express from "express";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();



/* =========================
   ADD REVIEW
========================= */

router.post("/", verifyToken, async (req,res)=>{

try{

const { productId, rating, comment } = req.body;

const review = new Review({
user: req.user.id,
product: productId,
rating,
comment
});

await review.save();

/* RECALCULATE PRODUCT RATING (VISIBLE REVIEWS ONLY) */

const reviews = await Review.find({
product: productId,
hidden:false
});

const avgRating =
reviews.length > 0
? reviews.reduce((sum,r)=>sum+r.rating,0) / reviews.length
: 0;

await Product.findByIdAndUpdate(productId,{
rating: avgRating,
numReviews: reviews.length
});

res.json(review);

}catch(err){

console.log(err);
res.status(500).json({message:"Review failed"});

}

});



/* =========================
   ADMIN REVIEW ANALYTICS
========================= */

router.get("/admin/analytics", verifyToken, async(req,res)=>{

try{

if(req.user.role !== "admin"){
return res.status(403).json({message:"Admin only"});
}

const analytics = await Review.aggregate([
{
$group:{
_id:"$rating",
count:{$sum:1}
}
},
{
$sort:{_id:-1}
}
]);

res.json(analytics);

}catch(err){

console.log(err);
res.status(500).json({message:"Analytics failed"});
}

});



/* =========================
   ADMIN PRODUCTS WITH REVIEWS
========================= */

router.get("/admin/products", verifyToken, async (req,res)=>{

try{

if(req.user.role !== "admin"){
return res.status(403).json({message:"Admin only"});
}

const products = await Product.find()
.select("name images numReviews rating");

res.json(products);

}catch(err){

console.log(err);
res.status(500).json({message:"Failed to fetch products"});
}

});



/* =========================
   ADMIN PRODUCT REVIEWS
========================= */

router.get("/admin/product/:productId", verifyToken, async(req,res)=>{

try{

if(req.user.role !== "admin"){
return res.status(403).json({message:"Admin only"});
}

let sort = { createdAt:-1 };

if(req.query.sort === "rating"){
sort = { rating:-1 };
}

if(req.query.sort === "oldest"){
sort = { createdAt:1 };
}

const reviews = await Review.find({
product:req.params.productId
})
.populate("user","name")
.sort(sort);

res.json(reviews);

}catch(err){

console.log(err);
res.status(500).json({message:"Failed"});
}

});



/* =========================
   ADMIN GET ALL REVIEWS
========================= */

router.get("/admin/all", verifyToken, async (req,res)=>{

try{

if(req.user.role !== "admin"){
return res.status(403).json({message:"Admin only"});
}

const reviews = await Review.find()
.populate("user","name")
.populate("product","name")
.sort({ createdAt:-1 });

res.json(reviews);

}catch(err){

console.log(err);
res.status(500).json({message:"Failed to fetch reviews"});
}

});



/* =========================
   ADMIN REPLY TO REVIEW
========================= */

router.put("/admin/reply/:id", verifyToken, async(req,res)=>{

try{

if(req.user.role !== "admin"){
return res.status(403).json({message:"Admin only"});
}

const {reply} = req.body;

await Review.findByIdAndUpdate(req.params.id,{
adminReply:reply
});

res.json({message:"Reply added"});

}catch(err){

console.log(err);
res.status(500).json({message:"Reply failed"});
}

});



/* =========================
   ADMIN HIDE / UNHIDE REVIEW
========================= */

router.put("/admin/hide/:id", verifyToken, async(req,res)=>{

try{

if(req.user.role !== "admin"){
return res.status(403).json({message:"Admin only"});
}

const review = await Review.findById(req.params.id);

if(!review){
return res.status(404).json({message:"Review not found"});
}

review.hidden = !review.hidden;

await review.save();

/* RECALCULATE PRODUCT RATING */

const reviews = await Review.find({
product:review.product,
hidden:false
});

const avgRating =
reviews.length > 0
? reviews.reduce((sum,r)=>sum+r.rating,0) / reviews.length
: 0;

await Product.findByIdAndUpdate(review.product,{
rating:avgRating,
numReviews:reviews.length
});

res.json(review);

}catch(err){

console.log(err);
res.status(500).json({message:"Hide failed"});
}

});



/* =========================
   ADMIN DELETE REVIEW
========================= */

router.delete("/admin/:id", verifyToken, async (req,res)=>{

try{

if(req.user.role !== "admin"){
return res.status(403).json({message:"Admin only"});
}

const review = await Review.findById(req.params.id);

if(!review){
return res.status(404).json({message:"Review not found"});
}

await Review.findByIdAndDelete(req.params.id);

/* RECALCULATE PRODUCT RATING */

const reviews = await Review.find({
product:review.product,
hidden:false
});

const avgRating =
reviews.length > 0
? reviews.reduce((sum,r)=>sum+r.rating,0) / reviews.length
: 0;

await Product.findByIdAndUpdate(review.product,{
rating:avgRating,
numReviews:reviews.length
});

res.json({message:"Review deleted"});

}catch(err){

console.log(err);
res.status(500).json({message:"Delete failed"});
}

});



/* =========================
   GET PRODUCT REVIEWS (PUBLIC)
========================= */

router.get("/:productId", async(req,res)=>{

try{

const reviews = await Review.find({
product:req.params.productId,
hidden:false
})
.populate("user","name")
.select("rating comment adminReply createdAt user")
.sort({createdAt:-1});

res.json(reviews);

}catch(err){

console.log(err);
res.status(500).json({message:"Failed to fetch reviews"});
}

});


export default router;