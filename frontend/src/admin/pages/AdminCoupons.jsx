import { useEffect, useState } from "react";
import API from "../../utils/axios";
import "../../styles/admin.css";
import { useNavigate } from "react-router-dom";

export default function AdminCoupons() {

  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrder: "",
    expiresAt: "",
    isActive: true,
    isAutoApply: false
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  // ================= FETCH =================
  const fetchCoupons = async () => {
    try {
      const res = await API.get("/coupons/admin");
      setCoupons(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const openCouponDetails = async (id) => {
    console.log("CLICKED:", id);   // 👈 ADD THIS
    try {
      const res = await API.get(`/coupons/admin/${id}`);
      setSelectedCoupon(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= CREATE =================
  const createCoupon = async () => {

    if (!form.code || !form.value) {
      return alert("Fill required fields");
    }

    try {
      setLoading(true);

      await API.post("/coupons/admin", {
        ...form,
        code: form.code.toUpperCase()
      });

      alert("Coupon created ✅");

      setForm({
        code: "",
        type: "percentage",
        value: "",
        minOrder: "",
        expiresAt: "",
        isActive: true,
        isAutoApply: false
      });

      fetchCoupons();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete coupon?")) return;

    await API.delete(`/coupons/admin/${id}`);
    fetchCoupons();
  };

  // ================= TOGGLE =================
  const toggleActive = async (id) => {
    try {
      await API.put(`/coupons/admin/toggle/${id}`);
      fetchCoupons();
    } catch (err) {
      console.log(err);
    }
  };

  return (

    <div className="admin-container">

      <h2 className="admin-title">🎟 Coupon Management</h2>

      {/* ================= CREATE ================= */}
      <div className="admin-card">

        <h3>Create Coupon</h3>

        <input
          placeholder="Code (SAVE50)"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed ₹</option>
        </select>

        <input
          placeholder="Value"
          type="number"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
        />

        <input
          placeholder="Min Order"
          type="number"
          value={form.minOrder}
          onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
        />

        <input
          type="date"
          value={form.expiresAt}
          onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
        />

        <label>
          <input
            type="checkbox"
            checked={form.isAutoApply}
            onChange={(e) => setForm({ ...form, isAutoApply: e.target.checked })}
          />
          Auto Apply
        </label>

        <button onClick={createCoupon} disabled={loading}>
          {loading ? "Creating..." : "Create Coupon"}
        </button>

      </div>

      {/* ================= LIST ================= */}
      <div className="admin-card">

        <h3>All Coupons</h3>

        {coupons.length === 0 ? (
          <p>No coupons</p>
        ) : coupons.map(c => (

          <div
            key={c._id}
            className="coupon-row"
            onClick={() => navigate(`/admin/coupons/${c._id}`)}
          >

            <div className="coupon-main">
              <strong>{c.code}</strong>
              <span>
                {c.type === "percentage"
                  ? `${c.value}%`
                  : `₹${c.value}`}
              </span>
            </div>

            <div>Min ₹{c.minOrder || 0}</div>

            <div>{c.isAutoApply && "🔥 Auto"}</div>

            <div className={c.isActive ? "active" : "inactive"}>
              {c.isActive ? "Active" : "Off"}
            </div>

            <div className="actions" onClick={(e) => e.stopPropagation()}>

              <button onClick={() => toggleActive(c._id)}>
                Toggle
              </button>

              <button onClick={() => deleteCoupon(c._id)}>
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* ================= MODAL ================= */}
      {selectedCoupon && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedCoupon(null)}
        >

          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <h2>🎟 {selectedCoupon.code}</h2>

            <p><b>Type:</b> {selectedCoupon.type}</p>
            <p><b>Value:</b> {selectedCoupon.value}</p>
            <p><b>Status:</b> {selectedCoupon.isActive ? "Active" : "Disabled"}</p>

            <p><b>Min Order:</b> ₹{selectedCoupon.minOrder || 0}</p>
            <p><b>Auto Apply:</b> {selectedCoupon.isAutoApply ? "Yes" : "No"}</p>

            <p><b>Created:</b> {new Date(selectedCoupon.createdAt).toLocaleDateString()}</p>

            <p><b>Expiry:</b> {
              selectedCoupon.expiresAt
                ? new Date(selectedCoupon.expiresAt).toLocaleDateString()
                : "No expiry"
            }</p>

            <p><b>Used:</b> {selectedCoupon.usedCount} users</p>

            <hr />

            <h4>Users who used</h4>

            <div className="user-list">
              {selectedCoupon.usedBy?.length === 0
                ? <p>No usage yet</p>
                : selectedCoupon.usedBy.map(u => (
                    <div key={u._id}>
                      {u.name} ({u.email})
                    </div>
                  ))
              }
            </div>

            <button onClick={() => setSelectedCoupon(null)}>
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}