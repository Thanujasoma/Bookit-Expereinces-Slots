import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Login() {
  const { saveAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      saveAuth({ token: res.data.token, user: res.data.user });
      navigate(from, { replace: true });
    } catch (err) {
      alert(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Log in</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border px-3 py-2 rounded" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border px-3 py-2 rounded" />
        <div className="flex justify-between items-center">
          <button className="bg-primary text-white px-4 py-2 rounded" style={{ background: "#1F6FEB" }}>{loading ? "Logging..." : "Log in"}</button>
          <Link to="/register" className="text-sm">Create an account</Link>
        </div>
      </form>
    </div>
  );
}