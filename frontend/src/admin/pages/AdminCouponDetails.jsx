import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../utils/axios";
import "../../styles/admin.css";

export default function AdminCouponDetails() {

  const { id } = useParams();

  const [coupon, setCoupon] = useState(null);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    fetchCoupon();
  }, []);

  const fetchCoupon = async () => {
    try {
      const res = await API.get(`/coupons/admin/${id}`);
      setCoupon(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!coupon) return <p>Loading...</p>;

  return (
    <div className="admin-container">

      <h2>🎟 {coupon.code}</h2>

      {/* ================= TABS ================= */}
      <div className="tabs">

        <button
          className={tab === "overview" ? "active" : ""}
          onClick={() => setTab("overview")}
        >
          Overview
        </button>

        <button
          className={tab === "users" ? "active" : ""}
          onClick={() => setTab("users")}
        >
          Users Used
        </button>

        <button
          className={tab === "settings" ? "active" : ""}
          onClick={() => setTab("settings")}
        >
          Settings
        </button>

      </div>

      {/* ================= CONTENT ================= */}

      {tab === "overview" && (
        <div className="admin-card">

  <div className="details-grid">

    <div className="detail-item">
      <span>Code</span>
      <b>{coupon.code}</b>
    </div>

    <div className="detail-item">
      <span>Type</span>
      <b>{coupon.type}</b>
    </div>

    <div className="detail-item">
      <span>Value</span>
      <b>
        {coupon.type === "percentage"
          ? `${coupon.value}%`
          : `₹${coupon.value}`}
      </b>
    </div>

    <div className="detail-item">
      <span>Status</span>
      <b className={coupon.isActive ? "green" : "red"}>
        {coupon.isActive ? "Active" : "Disabled"}
      </b>
    </div>

    <div className="detail-item">
      <span>Min Order</span>
      <b>₹{coupon.minOrder || 0}</b>
    </div>

    <div className="detail-item">
      <span>Auto Apply</span>
      <b>{coupon.isAutoApply ? "Yes" : "No"}</b>
    </div>

    <div className="detail-item">
      <span>Created At</span>
      <b>{new Date(coupon.createdAt).toLocaleDateString()}</b>
    </div>

    <div className="detail-item">
      <span>Expiry</span>
      <b>
        {coupon.expiresAt
          ? new Date(coupon.expiresAt).toLocaleDateString()
          : "No expiry"}
      </b>
    </div>

    <div className="detail-item highlight">
      <span>Used Count</span>
      <b>{coupon.usedCount}</b>
    </div>

  </div>

</div>
      )}

      {tab === "users" && (
        <div className="admin-card">

  <h3>Users Who Used</h3>

  {coupon.usedBy.length === 0 ? (
    <p>No users yet</p>
  ) : (
    <div className="user-table">

      <div className="table-header">
        <span>Name</span>
        <span>Email</span>
      </div>

      {coupon.usedBy.map(u => (
        <div key={u._id} className="table-row">
          <span>{u.name}</span>
          <span>{u.email}</span>
        </div>
      ))}

    </div>
  )}

</div>
      )}

      {tab === "settings" && (
        <div className="admin-card">

          <p>Toggle & Delete coming here 🔥</p>

        </div>
      )}

    </div>
  );
}