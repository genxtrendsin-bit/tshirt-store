import React, { useState } from "react";
import API from "../utils/axios";

export default function Addresses() {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [addresses, setAddresses] = useState(user?.addresses || []);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: ""
  });

  const [loading, setLoading] = useState(false);

  /* =========================
     ADD ADDRESS
  ========================= */
  const addAddress = async () => {

    if (!form.fullName || !form.phone || !form.street || !form.city || !form.postalCode) {
      return alert("Fill all fields");
    }

    try {

      setLoading(true);

      const res = await API.post("/user/address", form);

      localStorage.setItem("user", JSON.stringify(res.data));

      setUser(res.data);
      setAddresses(res.data.addresses);
localStorage.setItem("user", JSON.stringify(res.data));

      /* RESET FORM */
      setForm({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        postalCode: ""
      });

      alert("Address added");

    } catch (err) {
      console.log(err);
      alert("Failed to add address");
    } finally {
      setLoading(false);
    }

  };

  /* =========================
     DELETE ADDRESS
  ========================= */
  const deleteAddress = async (id) => {

    if (!window.confirm("Delete this address?")) return;

    try {

      const res = await API.delete(`/user/address/${id}`);

      localStorage.setItem("user", JSON.stringify(res.data));

      setUser(res.data);
      setAddresses(res.data.addresses);
localStorage.setItem("user", JSON.stringify(res.data));

    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }

  };

  /* =========================
     SET DEFAULT ADDRESS
  ========================= */
  const setDefault = async (id) => {

    try {

      const res = await API.put(`/user/address/default/${id}`);

      localStorage.setItem("user", JSON.stringify(res.data));

      setUser(res.data);
      setAddresses(res.data.addresses);
localStorage.setItem("user", JSON.stringify(res.data));

    } catch (err) {
      console.log(err);
      alert("Failed to set default");
    }

  };

  return (

    <div style={{ padding: "40px", color: "white" }}>

      <h2>📍 My Addresses</h2>

      {/* ADDRESS LIST */}
      {addresses.length === 0 && <p>No addresses yet</p>}

      {addresses.map(a => (

        <div
          key={a._id}
          style={{
            border: a.isDefault ? "2px solid #22c55e" : "1px solid #334155",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "15px",
            background: "#020617"
          }}
        >

          <p><b>{a.fullName}</b></p>
          <p>{a.street}</p>
          <p>{a.city}, {a.state}</p>
          <p>{a.postalCode}</p>
          <p>{a.phone}</p>

          {a.isDefault && (
            <span style={{ color: "#22c55e", fontSize: "12px" }}>
              Default Address
            </span>
          )}

          <div style={{ marginTop: "10px" }}>

            {!a.isDefault && (
              <button onClick={() => setDefault(a._id)}>
                Set Default
              </button>
            )}

            <button
              onClick={() => deleteAddress(a._id)}
              style={{ marginLeft: "10px", background: "red", color: "white" }}
            >
              Delete
            </button>

          </div>

        </div>

      ))}

      {/* ADD NEW */}
      <h3>Add New Address</h3>

      <input
        placeholder="Full Name"
        value={form.fullName}
        onChange={(e)=>setForm({...form, fullName:e.target.value})}
      />

      <input
        placeholder="Phone"
        value={form.phone}
        onChange={(e)=>setForm({...form, phone:e.target.value})}
      />

      <input
        placeholder="Street"
        value={form.street}
        onChange={(e)=>setForm({...form, street:e.target.value})}
      />

      <input
        placeholder="City"
        value={form.city}
        onChange={(e)=>setForm({...form, city:e.target.value})}
      />

      <input
        placeholder="State"
        value={form.state}
        onChange={(e)=>setForm({...form, state:e.target.value})}
      />

      <input
        placeholder="PIN Code"
        value={form.postalCode}
        onChange={(e)=>setForm({...form, postalCode:e.target.value})}
      />

      <button
        onClick={addAddress}
        disabled={loading}
        style={{ marginTop: "10px", opacity: loading ? 0.6 : 1 }}
      >
        {loading ? "Adding..." : "Add Address"}
      </button>

    </div>

  );

}