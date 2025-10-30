import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { user, clearAuth } = useAuth();

  const submitSearch = (e) => {
    e.preventDefault();
    const encoded = encodeURIComponent(q);
    navigate(`/?q=${encoded}`);
  };

  const logout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="page-container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">HD</div>
          <span className="font-semibold text-lg">HD booking</span>
        </Link>

        <form onSubmit={submitSearch} className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border rounded-l px-3 py-2 w-56 text-sm"
            placeholder="Search experiences"
          />
          <button className="bg-yellow-400 px-4 py-2 rounded-r text-sm">Search</button>
        </form>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login" className="text-sm">Log in</Link>
              <Link to="/register" className="bg-blue-600 px-3 py-2 text-white rounded text-sm">Sign up</Link>
            </>
          ) : (
            <>
              {user.isAdmin && <Link to="/admin" className="text-sm">Admin</Link>}
              <span className="text-sm">{user.name}</span>
              <button onClick={logout} className="text-sm text-gray-600">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}