import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const { experience, slotId, quantity } = state || {};
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!experience) {
    return <div>Missing booking data. Go back to <a href="/">home</a>.</div>;
  }

  const slot = experience.slots.find((s) => s._id === slotId) || experience.slots[0];
  const subtotal = slot.price * quantity;
  const taxes = Math.round(subtotal * 0.06);
  const discount = promoApplied ? promoApplied.discount : 0;
  const total = Math.round(subtotal + taxes - discount);

  const applyPromo = async () => {
    try {
      const res = await api.post("/promo/validate", { code: promo, subtotal });
      if (res.data.valid) setPromoApplied(res.data);
      else alert(res.data.message || "Invalid promo");
    } catch (err) {
      alert("Promo validation failed");
    }
  };

  const submitBooking = async () => {
    if (!name || !email.match(/^\S+@\S+\.\S+$/)) {
      alert("Provide valid name & email");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("/bookings", {
        experienceId: experience._id,
        slotId,
        name,
        email,
        phone,
        quantity,
        totalPrice: total,
        promoCode: promoApplied?.code
      });
      navigate("/result", { state: { success: true, booking: res.data.booking } });
    } catch (err) {
      navigate("/result", { state: { success: false, error: err?.response?.data || err } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>
      <div className="bg-white p-4 rounded shadow-sm mb-6">
        <label className="block mb-2">Full name</label>
        <input className="w-full border px-3 py-2 rounded" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="block mb-2 mt-4">Email</label>
        <input className="w-full border px-3 py-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="block mb-2 mt-4">Phone</label>
        <input className="w-full border px-3 py-2 rounded" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className="bg-white p-4 rounded shadow-sm mb-6">
        <div className="flex gap-2">
          <input className="flex-1 border px-3 py-2 rounded" value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo code" />
          <button onClick={applyPromo} className="bg-gray-800 text-white px-4 py-2 rounded">Apply</button>
        </div>
        {promoApplied && <div className="mt-3 text-green-600">Applied {promoApplied.code}: -₹{promoApplied.discount}</div>}
      </div>

      <div className="bg-white p-4 rounded shadow-sm mb-6">
        <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
        <div className="flex justify-between"><span>Taxes</span><span>₹{taxes}</span></div>
        {promoApplied && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{promoApplied.discount}</span></div>}
        <div className="flex justify-between font-semibold mt-3"><span>Total</span><span>₹{total}</span></div>
      </div>

      <div className="flex gap-3">
        <button disabled={submitting} onClick={submitBooking} className="bg-yellow-400 px-4 py-2 rounded">Pay & Book</button>
        <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
      </div>
    </div>
  );
}