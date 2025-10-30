import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, email, isAdmin }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("auth");
    if (raw) {
      try {
        const auth = JSON.parse(raw);
        setUser(auth.user);
      } catch (err) {
        localStorage.removeItem("auth");
      }
    }
    setLoading(false);
  }, []);

  const saveAuth = ({ token, user }) => {
    localStorage.setItem("auth", JSON.stringify({ token, user }));
    setUser(user);
  };

  const clearAuth = () => {
    localStorage.removeItem("auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, saveAuth, clearAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}