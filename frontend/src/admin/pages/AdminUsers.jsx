// ===== IMPORTS =====
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/axios";

export default function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  /* FETCH USERS */

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(res.data);
      setFiltered(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* FILTER */

  useEffect(() => {

    let data = [...users];

    if (search) {
      data = data.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (month) {
      data = data.filter(u => {
        const m = new Date(u.createdAt).getMonth() + 1;
        return m === parseInt(month);
      });
    }

    setFiltered(data);

  }, [search, month, users]);

  /* NAVIGATION (KEEP THIS) */
  const handleUserClick = (userId) => {
    if (!userId) return;
    navigate(`/admin/user/${userId}/orders`);
  };

  /* ===== ADMIN ACTIONS ===== */

  const toggleRole = async (e, user) => {
    e.stopPropagation();

    const confirmMsg =
      user.role === "admin"
        ? "Demote this admin to user?"
        : "Promote this user to admin?";

    if (!window.confirm(confirmMsg)) return;

    const token = localStorage.getItem("token");

    await API.put(`/admin/users/${user._id}/role`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchUsers();
  };

  const toggleBan = async (e, user) => {
    e.stopPropagation();

    const confirmMsg =
      user.isBanned
        ? "Unban this user?"
        : "Ban this user?";

    if (!window.confirm(confirmMsg)) return;

    const token = localStorage.getItem("token");

    await API.put(`/admin/users/${user._id}/ban`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchUsers();
  };

  const deleteUser = async (e, user) => {
    e.stopPropagation();

    if (!window.confirm("Delete this user permanently?")) return;

    const token = localStorage.getItem("token");

    await API.delete(`/admin/users/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchUsers();
  };

  /* STATS */

  const total = users.length;
  const admins = users.filter(u => u.isAdmin).length;
  const customers = total - admins;

  if (!users.length) {
    return <h2 style={{ padding: "40px" }}>No users found</h2>;
  }

  return (

    <div className="admin-page container">

      <h1>Users</h1>

      {/* FILTER BAR */}
      <div className="flex gap-10" style={{ marginBottom: "20px" }}>

        <input
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Month {i + 1}
            </option>
          ))}
        </select>

      </div>

      {/* STATS */}
      <div style={{ marginBottom: "20px" }}>
        <b>Total:</b> {total} |
        <b> Admins:</b> {admins} |
        <b> Customers:</b> {customers}
      </div>

      {!filtered.length && <p>No users match your filters</p>}

      {/* USERS LIST */}
      {filtered.map(user => (

        <div
          key={user._id}
          onClick={() => handleUserClick(user._id)}
          className="card"
          style={{
            marginBottom: "15px",
            cursor: "pointer",
            position: "relative"
          }}
        >

          <p><b>Name:</b> {user.name}</p>

          <p><b>Email:</b> {user.email}</p>

          {/* ROLE */}
          <p>
            <b>Role:</b>{" "}
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                background: user.role === "admin"
                  ? "rgba(239,68,68,0.2)"
                  : "rgba(34,197,94,0.2)"
              }}
            >
              {user.role === "admin" ? "Admin" : "User"}
            </span>
          </p>

          {/* STATUS */}
          <p>
            <b>Status:</b>{" "}
            <span style={{
              color: user.isBanned ? "red" : "green"
            }}>
              {user.isBanned ? "Banned" : "Active"}
            </span>
          </p>

          {user.createdAt && (
            <p className="text-muted" style={{ fontSize: "12px" }}>
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}

          {/* 🔥 ACTION BUTTONS */}
          <div style={{
            marginTop: "10px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap"
          }}>

            {/* 🔹 ROLE BUTTON */}
            <button
              disabled={currentUser?._id === user._id}
              onClick={(e) => toggleRole(e, user)}
            >
              {user.role === "admin" ? "Demote" : "Promote"}
            </button>

            {/* 🔹 BAN BUTTON */}
            <button
              disabled={currentUser?._id === user._id}
              onClick={(e) => toggleBan(e, user)}
            >
              {user.isBanned ? "Unban" : "Ban"}
            </button>

            {/* 🔹 DELETE */}
            <button
              disabled={currentUser?._id === user._id}
              onClick={(e) => deleteUser(e, user)}
            >
              Delete
            </button>

          </div>

        </div>

      ))}

    </div>
  );
}