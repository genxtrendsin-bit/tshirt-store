import React, { useState } from "react";
import API from "../utils/axios";

export default function ChangePassword() {

  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {

    /* =========================
       VALIDATION
    ========================= */
    if (!oldPassword || !newPassword || !confirmPassword) {
      return alert("Please fill all fields");
    }

    if (newPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {

      setLoading(true);

      const res = await API.put("/user/change-password", {
        oldPassword,
        newPassword
      });

      alert(res.data.message || "Password updated");

      /* RESET */
      setOld("");
      setNew("");
      setConfirm("");

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Something went wrong"
      );

    } finally {
      setLoading(false);
    }

  };

  return (

    <div style={{ padding: "40px", color: "white", maxWidth: "400px" }}>

      <h2>🔐 Change Password</h2>

      <input
        type="password"
        placeholder="Old password"
        value={oldPassword}
        onChange={(e) => setOld(e.target.value)}
      />

      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNew(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <button
        onClick={handleChange}
        disabled={loading}
        style={{
          marginTop: "10px",
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? "Updating..." : "Update Password"}
      </button>

    </div>

  );

}