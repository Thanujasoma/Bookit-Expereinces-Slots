import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function Result() {
  const { state } = useLocation();
  const { success, booking, error } = state || {};

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-sm text-center">
        <h2 className="text-2xl font-semibold mb-4">Booking confirmed</h2>
        <p className="mb-2">Booking ID: <strong>{booking?._id}</strong></p>
        <p className="mb-4">We sent a confirmation to <strong>{booking?.email}</strong></p>
        <Link to="/" className="text-primary">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-sm text-center">
      <h2 className="text-2xl font-semibold mb-4">Booking failed</h2>
      <pre className="bg-gray-100 p-3 rounded text-sm">{JSON.stringify(error, null, 2)}</pre>
      <div className="mt-4">
        <Link to="/" className="text-primary">Back to home</Link>
      </div>
    </div>
  );
}