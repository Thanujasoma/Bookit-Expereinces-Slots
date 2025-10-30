import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { saveAuth } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      saveAuth({ token: res.data.token, user: res.data.user });
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Create account</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full border px-3 py-2 rounded" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border px-3 py-2 rounded" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border px-3 py-2 rounded" />
        <div>
          <button className="bg-primary text-white px-4 py-2 rounded" style={{ background: "#1F6FEB" }}>{loading ? "Creating..." : "Create account"}</button>
        </div>
      </form>
    </div>
  );
}