import { useEffect, useState } from "react";
import API from "../../utils/axios";

export default function AdminNotification() {

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [type, setType] = useState("general");

  // 🔥 FETCH ALL SENT NOTIFICATIONS
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    fetchNotifications();
  }
}, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 SEND
  const sendNotification = async () => {
    if (!title || !message) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoading(true);

      await API.post("/notifications/admin", {
  title,
  message,
  type   // 🔥 IMPORTANT
});

      alert("✅ Notification sent");

      setTitle("");
      setMessage("");

      fetchNotifications(); // 🔥 refresh list

    } catch (err) {
      console.log(err);
      alert("Error sending notification");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DELETE
  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/admin/${id}`);
      fetchNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin-container">

      {/* ================= HEADER ================= */}
      <h2 className="admin-title">🔔 Notifications Panel</h2>

      {/* ================= FORM ================= */}
      <div className="admin-card">

        <h3>Send Notification</h3>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="admin-input"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="general">General</option>
          <option value="offer">Offer</option>
          <option value="order">Order</option>
          <option value="system">System</option>
        </select>

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="admin-textarea"
        />



        <button
          onClick={sendNotification}
          disabled={loading}
          className="admin-btn"
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>

      </div>

      {/* ================= LIST ================= */}
      <div className="admin-card">

        <h3>All Notifications</h3>

        {notifications.length === 0 ? (
          <p>No notifications yet</p>
        ) : (

          <div className="notification-list">

            {notifications.map((n) => (
              <div key={n._id} className="notification-item">

                <div>
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>

                  <small>
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>

                <button
                  onClick={() => deleteNotification(n._id)}
                  className="delete-btn"
                >
                  ❌
                </button>

              </div>
            ))}

          </div>

        )}

      </div>

    </div>
  );
}