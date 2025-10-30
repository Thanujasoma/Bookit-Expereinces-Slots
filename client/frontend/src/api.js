import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" }
});

// attach token automatically
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("auth");
    if (raw) {
      const auth = JSON.parse(raw);
      if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    }
  } catch (err) {
    // ignore
  }
  return config;
});

export default api;