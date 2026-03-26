import { useEffect, useState, useRef } from "react";
import API from "../utils/axios";
import "../styles/notification.css";
import { createPortal } from "react-dom";

export default function NotificationBell() {

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const dropdownRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));

  // ================= FETCH =================
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= CLICK OUTSIDE CLOSE =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ================= ACTIONS =================
  const markRead = async (id) => {
    try {
      await API.put(`/notifications/read/${id}`);
      fetchNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNotif = async (id) => {
    if (!window.confirm("Delete notification?")) return;

    try {
      await API.delete(`/notifications/${id}`);
      fetchNotifications();
      setSelected(null);
    } catch (err) {
      console.log(err);
    }
  };

  const unreadCount = notifications.filter(
    n => !n.readBy?.includes(user?._id)
  ).length;

  return (
    <div className="notif-wrapper">

      {/* 🔔 ICON */}
      <button
        className="notif-btn"
        onClick={() => setOpen(prev => !prev)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount}</span>
        )}
      </button>

      {/* ================= DROPDOWN ================= */}
      {open && (
        <div className="notif-dropdown" ref={dropdownRef}>

          {notifications.length === 0 ? (
            <p className="empty-text">No notifications</p>
          ) : notifications.map(n => {

            const isRead = n.readBy?.includes(user?._id);

            return (
              <div
                key={n._id}
                className={`notif-item ${isRead ? "read" : "unread"}`}
                onClick={() => {
                  setSelected(n);
                  setOpen(false);      // 🔥 close dropdown
                  markRead(n._id);
                }}
              >
                {n.title}
              </div>
            );
          })}

        </div>
      )}

      {/* ================= MODAL ================= */}
      {selected &&
  createPortal(
    <div
      className="notif-modal-overlay"
      onClick={() => setSelected(null)}
    >
      <div
        className="notif-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{selected.title}</h3>
        <p>{selected.message}</p>

        <div className="notif-actions">
          <button
            className="delete-btn"
            onClick={() => deleteNotif(selected._id)}
          >
            Delete
          </button>

          <button
            className="close-btn"
            onClick={() => setSelected(null)}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body   // 🔥 KEY FIX
  )
}

    </div>
  );
}