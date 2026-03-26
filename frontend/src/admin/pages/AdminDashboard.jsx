import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";
import api from "../../utils/axios";
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid,
  BarChart, Bar,
  ResponsiveContainer
} from "recharts";
import "../../styles/admin.css";

export default function AdminDashboard() {

  const [data, setData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topLoading, setTopLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    fetchTopProducts();
  }, []);

  // 🔥 DASHBOARD DATA
  const fetchDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setData(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 TOP PRODUCTS
  const fetchTopProducts = async () => {
    try {
      const res = await api.get("/admin/top-products"); // ✅ FIXED
      setTopProducts(res.data);
    } catch (err) {
      console.error("Top products error:", err);
    } finally {
      setTopLoading(false);
    }
  };

  // 🔒 SAFE DATA
  const safe = {
    totalRevenue: data?.totalRevenue ?? 0,
    codPending: data?.codPending ?? 0,
    totalOrders: data?.totalOrders ?? 0,
    todaySales: data?.todaySales ?? 0,
    dailySales: data?.dailySales || {},
    monthlySales: data?.monthlySales || {},
  };

  // 📊 FORMAT DATA
  const dailyData = Object.entries(safe.dailySales).map(([date, value]) => ({
    date,
    value,
  }));

  const monthlyData = Object.entries(safe.monthlySales).map(([month, value]) => ({
    month,
    value,
  }));

  return (
    <div className="admin-layout">

      <Sidebar />

      <div className="admin-content">

        {/* 🔥 HEADER */}
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <button onClick={fetchDashboard} className="refresh-btn">
            Refresh
          </button>
        </div>

        {/* 🔒 LOADING */}
        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            {/* 🔥 CARDS */}
            <DashboardCards data={safe} />

            {/* 📊 CHARTS */}
            <div className="charts-grid">

              {/* 📈 DAILY */}
              <div className="chart-card">
                <h2>Daily Sales</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="value" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* 📊 MONTHLY */}
              <div className="chart-card">
                <h2>Monthly Sales</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* ⚠️ COD ALERT */}
            {safe.codPending > 0 && (
              <div className="alert-box">
                ⚠️ You have ₹{safe.codPending} pending from COD orders
              </div>
            )}



          </>
        )}

      </div>
    </div>
  );
}