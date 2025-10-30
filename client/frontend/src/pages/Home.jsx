import React, { useEffect, useState } from "react";
import api from "../api";
import ExperienceCard from "../components/ExperienceCard";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [exps, setExps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    setLoading(true);
    api.get("/experiences")
      .then((res) => {
        let list = res.data || [];
        if (q) {
          const lower = q.toLowerCase();
          list = list.filter((i) => (i.title || "").toLowerCase().includes(lower) || (i.location || "").toLowerCase().includes(lower));
        }
        setExps(list);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="page-container">
      <h1 className="text-4xl font-bold mb-6">Experiences</h1>

      {loading ? (
        <div>Loading experiences...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exps.map((e) => <ExperienceCard key={e._id} exp={e} />)}
        </div>
      )}
    </div>
  );
}