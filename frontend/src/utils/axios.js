import axios from "axios";

// ===============================
// 🌍 CREATE INSTANCE
// ===============================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 15000,
});

// ===============================
// 🔐 REQUEST INTERCEPTOR
// ===============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // ✅ Attach token only if exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// 🚫 RESPONSE INTERCEPTOR
// ===============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "";
    const token = localStorage.getItem("token");

    // ===============================
    // 🔥 NETWORK ERROR
    // ===============================
    if (!error.response) {
      alert("Server not reachable. Please try again later.");
      return Promise.reject(error);
    }

    // ===============================
    // 🔥 HANDLE AUTH ERRORS SAFELY
    // ===============================
    if ((status === 401 || status === 403) && token) {
      // ✅ Only logout if user was actually logged in
      if (
        message.toLowerCase().includes("expired") ||
        message.toLowerCase().includes("invalid") ||
        message.toLowerCase().includes("banned") ||
        status === 403
      ) {
        alert(message || "Session expired. Please login again.");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;