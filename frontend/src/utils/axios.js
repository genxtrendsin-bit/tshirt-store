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

    // 🔥 NETWORK ERROR (backend down / deploy issue)
    if (!error.response) {
      alert("Server not reachable. Please try again later.");
      return Promise.reject(error);
    }

    // 🔥 AUTO LOGOUT (TOKEN EXPIRED / BANNED)
    if (status === 401 || status === 403) {
      if (
        message.toLowerCase().includes("banned") ||
        status === 401
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