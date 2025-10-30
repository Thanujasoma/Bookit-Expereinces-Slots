import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Details from "./pages/Details";
import Checkout from "./pages/Checkout";
import Result from "./pages/Result";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCreateExperience from "./pages/admin/AdminCreateExperience";
import AdminPromoManager from "./pages/admin/AdminPromoManager";
import AdminBookings from "./pages/admin/AdminBookings"; // <-- new

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experiences/:id" element={<Details />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/result" element={<Result />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create"
            element={
              <ProtectedRoute requireAdmin>
                <AdminCreateExperience />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/promos"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPromoManager />
              </ProtectedRoute>
            }
          />

          {/* Admin bookings route */}
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute requireAdmin>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}