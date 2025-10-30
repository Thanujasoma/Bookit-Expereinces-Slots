import React from "react";
import { Link } from "react-router-dom";

export default function ExperienceCard({ exp }) {
  const price = exp.slots?.[0]?.price ?? "-";
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="overflow-hidden exp-card-img">
        {/* use object-cover to crop images instead of stretching */}
        <img
          src={exp.images?.[0]}
          alt={exp.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-lg line-clamp-1">{exp.title}</h3>
        <p className="text-sm text-gray-500">{exp.location}</p>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm">From <span className="font-semibold">₹{price}</span></div>
          <Link to={`/experiences/${exp._id}`} className="bg-yellow-400 px-3 py-1 rounded text-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}