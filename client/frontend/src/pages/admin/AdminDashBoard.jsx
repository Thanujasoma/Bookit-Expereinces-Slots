import React, { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [exps, setExps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/experiences").then((res) => setExps(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Admin — Experiences</h2>
        <div className="flex gap-2">
          <Link to="/admin/create" className="bg-yellow-400 px-3 py-2 rounded">Create Experience</Link>
          <Link to="/admin/promos" className="bg-gray-800 text-white px-3 py-2 rounded">Manage Promos</Link>
          <Link to="/admin/bookings" className="bg-blue-600 text-white px-3 py-2 rounded">View Bookings</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exps.map((e) => (
          <div key={e._id} className="bg-white p-3 rounded shadow-sm">
            <img src={e.images?.[0]} className="w-full h-36 object-cover rounded mb-2" alt={e.title} />
            <div className="font-semibold">{e.title}</div>
            <div className="text-sm text-gray-500">{e.location}</div>
            <div className="mt-2 text-sm">Slots: {e.slots?.length ?? 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
}