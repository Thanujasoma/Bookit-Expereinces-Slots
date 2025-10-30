import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exp, setExp] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/experiences/${id}`)
      .then((res) => setExp(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-container">Loading...</div>;
  if (!exp) return <div className="page-container">Not found</div>;

  const selectedSlot = exp.slots.find((s) => s._id === selectedSlotId) || exp.slots[0];

  const goCheckout = () => {
    if (!selectedSlot) {
      alert("Select a slot");
      return;
    }
    navigate("/checkout", { state: { experience: exp, slotId: selectedSlot._id, quantity } });
  };

  return (
    <div className="page-container grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="overflow-hidden hero-img rounded">
          <img src={exp.images?.[0]} alt={exp.title} className="w-full h-full object-cover" />
        </div>

        <h2 className="text-xl font-semibold mt-4">{exp.title}</h2>
        <p className="text-gray-600 mt-2">{exp.description}</p>

        <div className="mt-6">
          <div className="font-medium">Choose time</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {exp.slots.map((s) => (
              <button
                key={s._id}
                onClick={() => setSelectedSlotId(s._id)}
                disabled={s.availableSeats === 0}
                className={`px-3 py-1 rounded border text-sm ${s.availableSeats === 0 ? "opacity-60 cursor-not-allowed" : selectedSlotId === s._id ? "bg-yellow-400 text-black" : ""}`}
              >
                {s.date} • {s.time} {s.availableSeats === 0 ? " (Sold out)" : `• ${s.availableSeats} left`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="bg-white p-4 rounded shadow-sm">
        <div className="text-sm text-gray-500">Starts at</div>
        <div className="text-xl font-semibold">₹{selectedSlot?.price ?? "-"}</div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div>Quantity</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 py-1 border rounded">−</button>
              <div>{quantity}</div>
              <button onClick={() => setQuantity(quantity + 1)} className="px-2 py-1 border rounded">+</button>
            </div>
          </div>

          <div className="mt-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{(selectedSlot?.price || 0) * quantity}</span></div>
            <div className="flex justify-between"><span>Taxes</span><span>₹{Math.round(((selectedSlot?.price || 0) * quantity) * 0.06)}</span></div>
            <div className="flex justify-between font-semibold mt-2"><span>Total</span><span>₹{Math.round(((selectedSlot?.price || 0) * quantity) * 1.06)}</span></div>
          </div>

          <button onClick={goCheckout} className="mt-4 w-full bg-yellow-400 py-2 rounded">Book</button>
        </div>
      </aside>
    </div>
  );
}