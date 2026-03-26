import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const getDashboardStats = async (req, res) => {
  try {
    const orders = await Order.find();

    let totalRevenue = 0;
    let codPending = 0;
    let totalOrders = orders.length;

    let todaySales = 0;

    const dailyMap = {};
    const monthlyMap = {};

    const today = new Date().toDateString();

    orders.forEach((order) => {
      // 🔥 SAFE PAYMENT VALUES (CRITICAL)
      const paid = order.paidAmount ?? order.codAdvanceAmount ?? 0;
      const pending = order.pendingAmount ?? 0;

      totalRevenue += paid;
      codPending += pending;

      // 📅 TODAY SALES
      if (new Date(order.createdAt).toDateString() === today) {
        todaySales += paid;
      }

      // 📊 DAILY SALES
      const dayKey = new Date(order.createdAt).toLocaleDateString();
      dailyMap[dayKey] = (dailyMap[dayKey] || 0) + paid;

      // 📊 MONTHLY SALES
      const monthKey = new Date(order.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + paid;
    });

    res.json({
      totalRevenue,
      codPending,
      totalOrders,
      todaySales,
      dailySales: dailyMap,
      monthlySales: monthlyMap,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTopProducts = async (req, res) => {
  try {

    const topProducts = await Order.aggregate([

      { $unwind: "$items" },

      {
        $group: {
          _id: "$items.product", // ✅ FIXED (IMPORTANT)
          totalSold: { $sum: "$items.quantity" }
        }
      },

      { $sort: { totalSold: -1 } },
      { $limit: 10 },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },

      { $unwind: "$product" },

      {
        $project: {
          productId: "$product._id",
          name: "$product.name",
          price: "$product.price",
          images: "$product.images",
          totalSold: 1
        }
      }

    ]);

    console.log("🔥 TOP PRODUCTS:", topProducts);

    res.json(topProducts);

  } catch (err) {
    console.error("Top products error:", err);
    res.status(500).json({ message: err.message });
  }
};