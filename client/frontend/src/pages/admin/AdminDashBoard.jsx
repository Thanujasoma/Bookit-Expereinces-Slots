import React from "react";
import { Link } from "react-router-dom";

/**
 * Minimal Admin Dashboard placeholder.
 * If you already have a more complete AdminDashboard, replace this file
 * or merge the contents. This prevents the "AdminDashboard is not defined" runtime error.
 */
export default function AdminDashboard() {
  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <div className="flex gap-2">
          <Link to="/admin/create" className="bg-yellow-400 px-3 py-2 rounded">Create Experience</Link>
          <Link to="/admin/promos" className="bg-gray-800 text-white px-3 py-2 rounded">Manage Promos</Link>
          <Link to="/admin/bookings" className="bg-blue-600 text-white px-3 py-2 rounded">View Bookings</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-semibold">Overview</h3>
          <p className="text-sm text-gray-600 mt-2">This is a placeholder admin dashboard. Replace with your real admin UI when ready.</p>
        </div>
      </div>
    </div>
  );
}
