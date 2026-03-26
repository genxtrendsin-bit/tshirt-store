import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/account.css";

export default function Account() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (

    <div className="account-page">

      {/* HEADER */}
      <h1>My Account</h1>

      {/* USER INFO CARD */}
      <div className="account-user-card">

        <div className="avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt="user" />
          ) : (
            <div className="avatar-placeholder">
              {user?.name?.charAt(0)}
            </div>
          )}
        </div>

        <div>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
        </div>

      </div>

      {/* GRID */}
      <div className="account-grid">

        {/* ORDERS */}
        <Link to="/orders" className="account-card">
          <h3>📦 My Orders</h3>
          <p>Track, cancel or view orders</p>
        </Link>

        {/* WISHLIST */}
        <Link to="/wishlist" className="account-card">
          <h3>❤️ Wishlist</h3>
          <p>Your saved products</p>
        </Link>

        {/* CART */}
        <Link to="/cart" className="account-card">
          <h3>🛒 Cart</h3>
          <p>Items ready for checkout</p>
        </Link>

        {/* PROFILE */}
        <Link to="/profile" className="account-card">
          <h3>👤 Edit Profile</h3>
          <p>Update your personal info</p>
        </Link>

        {/* ADDRESS */}
        <Link to="/addresses" className="account-card">
          <h3>📍 Addresses</h3>
          <p>Manage delivery addresses</p>
        </Link>

        {/* SECURITY */}
        <Link to="/change-password" className="account-card">
          <h3>🔐 Security</h3>
          <p>Change password & settings</p>
        </Link>

        {/* SUPPORT */}
        <Link to="/contact" className="account-card">
          <h3>🎧 Support</h3>
          <p>Help & customer service</p>
        </Link>

        {/* LOGOUT */}
        <div className="account-card logout" onClick={handleLogout}>
          <h3>🚪 Logout</h3>
          <p>Sign out of your account</p>
        </div>

      </div>

    </div>

  );

}