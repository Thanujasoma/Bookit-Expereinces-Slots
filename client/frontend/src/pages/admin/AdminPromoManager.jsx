import React, { useEffect, useState } from "react";
import api from "../../api";

export default function AdminPromoManager() {
  const [promos, setPromos] = useState([]);
  const [code, setCode] = useState("");
  const [type, setType] = useState("percent");
  const [amount, setAmount] = useState(10);
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);

  const load = () => {
    api.get("/promo").then((res) => setPromos(res.data.promos)).catch(console.error);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    setLoading(true);
    try {
      await api.post("/promo", { code, type, amount, expiresAt: expiresAt || undefined });
      setCode(""); setAmount(10); setExpiresAt("");
      load();
    } catch (err) {
      alert(err?.response?.data?.error || "Create failed");
    } finally { setLoading(false); }
  };

  const del = async (id) => {
    if (!confirm("Delete promo?")) return;
    await api.delete(`/promo/${id}`);
    load();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Promo manager</h3>
      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <div className="flex gap-2">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code" className="px-3 py-2 border rounded" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 border rounded">
            <option value="percent">Percent</option>
            <option value="flat">Flat</option>
          </select>
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="px-3 py-2 border rounded w-28" />
          <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="px-3 py-2 border rounded" />
          <button onClick={create} className="bg-yellow-400 px-3 py-2 rounded">{loading ? "..." : "Create"}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {promos.map(p => (
          <div key={p._id} className="bg-white p-3 rounded flex items-center justify-between">
            <div>
              <div className="font-semibold">{p.code} <span className="text-sm text-gray-500">({p.type} {p.amount})</span></div>
              <div className="text-sm text-gray-500">{p.expiresAt ? `Expires ${new Date(p.expiresAt).toLocaleDateString()}` : "No expiry"}</div>
            </div>
            <div>
              <button onClick={() => del(p._id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}