"use client";
import { useEffect, useState } from "react";

export default function UserDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRegistrations() {
      const res = await fetch("/api/user/registrations");
      const data = await res.json();
      setRegistrations(data);
      setLoading(false);
    }
    fetchRegistrations();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to unregister?")) return;

    const res = await fetch(`/api/user/registrations/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();

    if (res.ok) {
      setRegistrations(registrations.filter((reg) => reg._id !== id));
      alert("Successfully unregistered from event.");
    } else {
      alert(result.error || "Failed to unregister.");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Your Registered Events
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : registrations.length === 0 ? (
        <p>You have not registered for any events yet.</p>
      ) : (
        <ul className="space-y-4">
          {registrations[0].map((event) => (
            <li
              key={event._id}
              className="flex justify-between items-center p-4 border rounded-lg shadow-md"
            >
              <div>
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-gray-600">{event.date}</p>
              </div>
              <button
                onClick={() => handleDelete(event._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Unregister
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
