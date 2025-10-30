import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (!user) {
    // redirect to login and pass back the original route
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (requireAdmin && !user.isAdmin) {
    return <div className="text-center p-8">Access denied — admin only</div>;
  }
  return children;
}