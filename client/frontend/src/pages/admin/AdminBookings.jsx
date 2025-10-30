import React, { useEffect, useState } from "react";
import api from "../../api";

/**
 * AdminBookings
 * - Fetches GET /api/bookings (admin-only)
 * - Expects response: { bookings: [ { _id, experienceId, userId, slotId, quantity, totalPrice, createdAt, ... } ] }
 *
 * Fixes:
 * - Do not render raw objects directly in JSX. Compute string labels for experience & user.
 * - Safely derive slot label from populated experience.slots if available.
 */
export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState(null);

  const makeDisplayForExperience = (rawBooking) => {
    // rawBooking may contain experienceId populated (object) or a plain value
    const expPop = rawBooking.experienceId || rawBooking.experience;
    if (!expPop) return "—";
    if (typeof expPop === "string") return expPop;
    if (expPop.title) return expPop.title;
    if (expPop.name) return expPop.name;
    if (expPop._id) return String(expPop._id).slice(0, 12);
    // fallback to safe string
    return "Experience";
  };

  const makeDisplayForUser = (rawBooking) => {
    const userPop = rawBooking.userId || rawBooking.user;
    if (!userPop) return "—";
    if (typeof userPop === "string") return userPop;
    if (userPop.email) return userPop.email;
    if (userPop.name) return userPop.name;
    if (userPop._id) return String(userPop._id).slice(0, 12);
    return "User";
  };

  const deriveSlotLabel = (rawBooking) => {
    // Try to find slot details inside populated experience if possible
    try {
      const expObj = rawBooking.experienceId || rawBooking.experience;
      if (expObj && expObj.slots && Array.isArray(expObj.slots) && rawBooking.slotId) {
        const found = expObj.slots.find((s) => String(s._id) === String(rawBooking.slotId));
        if (found) {
          return `${found.date || ""} ${found.time || ""}`.trim();
        }
      }
    } catch (e) {
      // ignore and fallback
    }
    // fallback to slotId short string
    return rawBooking.slotId ? String(rawBooking.slotId).slice(0, 12) : "—";
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/bookings"); // protected admin endpoint
      const list = res.data?.bookings || [];

      const normalized = list.map((b) => {
        return {
          _id: b._id,
          experienceDisplay: makeDisplayForExperience(b),
          userDisplay: makeDisplayForUser(b),
          slotLabel: deriveSlotLabel(b),
          quantity: b.quantity,
          totalPrice: b.totalPrice,
          promoCode: b.promoCode,
          createdAt: b.createdAt,
          raw: b
        };
      });

      setBookings(normalized);
    } catch (err) {
      console.error("Failed to load bookings", err);
      setError(err?.response?.data?.error || err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = bookings.filter((b) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      String(b._id).toLowerCase().includes(q) ||
      String(b.experienceDisplay || "").toLowerCase().includes(q) ||
      String(b.userDisplay || "").toLowerCase().includes(q) ||
      String(b.promoCode || "").toLowerCase().includes(q)
    );
  });

  const formatDate = (iso) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return iso;
    }
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">All Bookings</h2>
        <div className="flex items-center gap-2">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by id, user, experience or promo"
            className="border px-3 py-2 rounded"
          />
          <button onClick={load} className="bg-yellow-400 px-3 py-2 rounded">Refresh</button>
        </div>
      </div>

      {loading ? (
        <div>Loading bookings...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-3 rounded">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-sm rounded">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Booking ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">User</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Experience</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Slot</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Qty</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Total (₹)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Promo</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-sm text-gray-500">No bookings found</td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b._id}>
                    <td className="px-4 py-3 text-sm text-gray-700">{String(b._id).slice(0, 12)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.userDisplay}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.experienceDisplay}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.slotLabel}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{b.quantity}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{b.totalPrice}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.promoCode || "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(b.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}