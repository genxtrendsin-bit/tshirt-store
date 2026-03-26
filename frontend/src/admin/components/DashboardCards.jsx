import { useEffect, useState } from "react";
import API from "../../utils/axios";

export default function DashboardCards({ data: propData }) {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 If parent already passed data → use it
    if (propData) {
      setStats(propData);
      setLoading(false);
    } else {
      fetchStats();
    }
  }, [propData]);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/dashboard"); // ✅ FIXED ENDPOINT
      setStats(res.data);
    } catch (err) {
      console.error("Stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔒 Loading UI
  if (loading) {
    return <p>Loading stats...</p>;
  }

  // 🔒 SAFE FALLBACK (VERY IMPORTANT FOR YOUR SYSTEM)
  const safe = {
    totalRevenue: stats?.totalRevenue ?? 0,
    codPending: stats?.codPending ?? 0,
    totalOrders: stats?.totalOrders ?? 0,
    todaySales: stats?.todaySales ?? 0,
  };

  return (
    <div className="dashboard-cards">

      {/* 💰 TOTAL REVENUE */}
      <div className="card">
        <h3>Total Revenue</h3>
        <p>₹{safe.totalRevenue}</p>
      </div>

      {/* ⚠️ COD PENDING (CRITICAL BUSINESS METRIC) */}
      <div className="card">
        <h3>COD Pending</h3>
        <p>₹{safe.codPending}</p>
      </div>

      {/* 📦 TOTAL ORDERS */}
      <div className="card">
        <h3>Total Orders</h3>
        <p>{safe.totalOrders}</p>
      </div>

      {/* 📅 TODAY SALES */}
      <div className="card">
        <h3>Today Sales</h3>
        <p>₹{safe.todaySales}</p>
      </div>

    </div>
  );
}