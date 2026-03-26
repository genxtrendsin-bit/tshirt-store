import express from "express";
import Cart from "../models/Cart.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


/* =========================
   ADD PRODUCT TO CART
========================= */

router.post("/add", verifyToken, async (req, res) => {

   try {
      console.log("REQ BODY:", req.body);

      const { productId, size, color } = req.body;  // ✅ FIX

      let quantity = Number(req.body.quantity);

      if (isNaN(quantity) || quantity < 1) {
         quantity = 1;
      }

      if (!productId) {
         return res.status(400).json({ message: "productId required" });
      }

      /* CHECK EXISTING ITEM */

      let item = await Cart.findOne({
         user: req.user.id,
         product: productId,
         size: size || null,
         color: color || null   // ✅ FIX
      });

      if (item) {

         item.quantity += quantity;
         await item.save();

         return res.json(item);
      }

      /* CREATE NEW ITEM */

      item = new Cart({
         user: req.user.id,
         product: productId,
         size: size || null,
         quantity,
         color: color || null   // ✅ FIX
      });

      await item.save();

      res.json(item);

   } catch (err) {

      console.log("CART ADD ERROR:", err);

      res.status(500).json({ message: "Add to cart failed" });

   }
   

});


/* =========================
   GET USER CART
========================= */

router.get("/", verifyToken, async (req, res) => {

   try {

      const cartItems = await Cart.find({
         user: req.user.id
      }).populate("product");

      /* REMOVE ITEMS WITH DELETED PRODUCTS */

      const validItems = cartItems.filter(item => item.product !== null);

      res.json(validItems);
      
      console.log("verifyToken running");

   } catch (err) {

      console.log("CART FETCH ERROR:", err);

      res.status(500).json({ message: "Cart fetch failed" });

   }

});


/* =========================
   UPDATE QUANTITY
========================= */

router.put("/:id", verifyToken, async (req, res) => {

   try {

      const { quantity } = req.body;

      const item = await Cart.findById(req.params.id);

      if (!item) {
         return res.status(404).json({ message: "Item not found" });
      }

      item.quantity = Math.max(1, Number(quantity));

      await item.save();

      res.json(item);

   } catch (err) {

      console.log("CART UPDATE ERROR:", err);

      res.status(500).json({ message: "Update failed" });

   }

});


/* =========================
   REMOVE ITEM
========================= */

router.delete("/:id", verifyToken, async (req, res) => {

   try {

      await Cart.findByIdAndDelete(req.params.id);

      res.json({ message: "Item removed" });

   } catch (err) {

      console.log("CART DELETE ERROR:", err);

      res.status(500).json({ message: "Delete failed" });

   }

});


export default router;