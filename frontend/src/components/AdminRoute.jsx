// ===== IMPORTS =====
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {

  // ===== GET TOKEN & USER =====
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));

  // ===== NOT LOGGED IN =====
  if (!token) {

    return <Navigate to="/login" />;

  }

  // ===== NOT ADMIN =====
  if (user?.role !== "admin") {

    return <Navigate to="/" />;

  }

  // ===== ADMIN ACCESS =====
  return children;

}