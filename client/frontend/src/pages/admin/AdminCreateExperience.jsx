import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function AdminCreateExperience() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("River Rafting Expedition");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imagesText, setImagesText] = useState("");
  const [slotsJson, setSlotsJson] = useState('[{"date":"2025-11-10","time":"08:00","price":1999,"availableSeats":12}]');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const images = imagesText.split(",").map(s => s.trim()).filter(Boolean);
      const slots = JSON.parse(slotsJson);
      const res = await api.post("/experiences", { title, description, location, images, durationMinutes: 240, slots });
      alert("Created: " + res.data._id);
      navigate("/admin");
    } catch (err) {
      alert(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Create Experience</h3>
      <form onSubmit={submit} className="space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border px-3 py-2 rounded" />
        <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border px-3 py-2 rounded" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded" />
        <input value={imagesText} onChange={(e) => setImagesText(e.target.value)} placeholder="Comma-separated image URLs" className="w-full border px-3 py-2 rounded" />
        <textarea value={slotsJson} onChange={(e) => setSlotsJson(e.target.value)} className="w-full border px-3 py-2 rounded h-40" />
        <div>
          <button disabled={loading} className="bg-yellow-400 px-4 py-2 rounded">{loading ? "Creating..." : "Create"}</button>
        </div>
      </form>
    </div>
  );
}