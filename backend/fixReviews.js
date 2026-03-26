import mongoose from "mongoose";
import Product from "./models/Product.js";
import Review from "./models/Review.js";

await mongoose.connect("YOUR_MONGO_URL");

const products = await Product.find();

for (const product of products) {

  const reviews = await Review.find({
    product: product._id,
    hidden:false
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum,r)=>sum+r.rating,0) / reviews.length
      : 0;

  product.rating = avgRating;
  product.numReviews = reviews.length;

  await product.save();

}

console.log("Review counts fixed");
process.exit();