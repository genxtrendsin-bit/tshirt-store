import express from "express";
import Product from "../models/Product.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import upload, { uploadImage } from "../middleware/upload.js";
import Cart from "../models/Cart.js";
import { logActivity } from "../utils/logActivity.js";
import Fuse from "fuse.js";
import { getTopProducts } from "../controllers/adminController.js";

const router = express.Router();

/* =========================
   SEARCH PRODUCTS
========================= */

router.get("/search", async (req, res) => {

  try {

    const query = req.query.q;

    if (!query) {
      return res.json([]);
    }

    const products = await Product.find().select(
      "name description price images rating"
    );

    const fuse = new Fuse(products, {
      keys: ["name", "description"],
      threshold: 0.4
    });

    const result = fuse.search(query);

    res.json(result.map(r => r.item));

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Search failed" });

  }

});


/* =========================
   GET ALL PRODUCTS
========================= */

router.get("/", async (req, res) => {

  try {

    const products = await Product.find().sort({ createdAt: -1 });

    res.json(products);

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Failed to fetch products" });

  }

});

router.get("/top-products", getTopProducts);


/* =========================
   GET SINGLE PRODUCT
========================= */

router.get("/:id", async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Failed to fetch product" });

  }

});


/* =========================
   ADD PRODUCT (ADMIN)
========================= */

router.post(
  "/add",
  verifyToken,
  verifyAdmin,
  upload.array("images", 5),
  async (req, res) => {

    try {

      const imageUrls = await Promise.all(
        req.files.map(file => uploadImage(file))
      );

      const sizes = JSON.parse(req.body.sizes || "[]");
      const colors = JSON.parse(req.body.colors || "[]");

      const {
        name,
        price,
        description,
        stock,
        category,
        brand,
        material,
        fit,
        neckline,
        sleeveType,
        fabricWeight,
        pattern,
        gender,
        tags,
        codAvailable
      } = req.body;

      const product = new Product({
        name,
        price,
        description,
        stock,
        sizes,
        colors,
        category,
        brand,
        material,
        fit,
        neckline,
        sleeveType,
        fabricWeight,
        pattern,
        gender,
        tags,
        images: imageUrls,

        codAvailable: codAvailable === "true",
      });

      await product.save();

      /* ===== ADMIN ACTIVITY LOG ===== */

      await logActivity({
        adminId: req.user.id,
        action: "CREATE_PRODUCT",
        entity: "Product",
        entityId: product._id,
        description: `Admin created product: ${product.name}`
      });

      res.json(product);

    } catch (err) {

      console.log(err);
      res.status(500).json({ message: "Upload failed" });

    }

  });


/* =========================
   UPDATE PRODUCT (ADMIN)
========================= */

router.put(
  "/update/:id",
  verifyToken,
  verifyAdmin,
  upload.array("images", 5),
  async (req, res) => {

    try {

      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      product.name = req.body.name;
      product.price = req.body.price;
      product.description = req.body.description;
      product.stock = req.body.stock;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.material = req.body.material;
      product.fit = req.body.fit;
      product.neckline = req.body.neckline;
      product.sleeveType = req.body.sleeveType;
      product.fabricWeight = req.body.fabricWeight;
      product.pattern = req.body.pattern;
      product.gender = req.body.gender;
      product.tags = req.body.tags;

      product.sizes = JSON.parse(req.body.sizes || "[]");
      product.colors = JSON.parse(req.body.colors || "[]");
      if (req.body.codAvailable !== undefined) {
        product.codAvailable = req.body.codAvailable === "true";
      }

      if (req.files && req.files.length > 0) {

        const imageUrls = [];

        for (const file of req.files) {
          const url = await uploadImage(file);
          imageUrls.push(url);
        }

        product.images = imageUrls;

      }

      await product.save();

      /* ===== ADMIN ACTIVITY LOG ===== */

      await logActivity({
        adminId: req.user.id,
        action: "UPDATE_PRODUCT",
        entity: "Product",
        entityId: product._id,
        description: `Admin updated product: ${product.name}`
      });

      res.json(product);

    } catch (err) {

      console.log("UPDATE ERROR:", err);

      res.status(500).json({ message: "Update failed" });

    }

  });


/* =========================
   DELETE PRODUCT
========================= */

router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);

    /* REMOVE PRODUCT FROM ALL CARTS */

    await Cart.updateMany(
      {},
      {
        $pull: {
          items: { product: req.params.id }
        }
      }
    );

    /* ===== ADMIN ACTIVITY LOG ===== */

    await logActivity({
      adminId: req.user.id,
      action: "DELETE_PRODUCT",
      entity: "Product",
      entityId: req.params.id,
      description: `Admin deleted product: ${product.name}`
    });

    res.json({ message: "Product deleted" });

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Delete failed" });

  }

});

router.get("/top-products", getTopProducts);


export default router;