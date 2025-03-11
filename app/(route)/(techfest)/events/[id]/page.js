"use client";

import { useEffect, useState } from "react";

export default function EventDetailsPage({ params }) {
  const eventId = params.id;
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    async function fetchRegistrations() {
      const res = await fetch(`/api/event/registrations/${eventId}`);
      const data = await res.json();
      setRegistrations(data);
    }
    fetchRegistrations();
  }, [eventId]);

  return (
    <div>
      <div className="p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Event Details</h2>
        <p>Event ID: {eventId}</p>
        <p>Registrations: {registrations.length}</p>
      </div>
      
      <div className="p-6">
        <h1 className="text-3xl font-bold">Registered Users</h1>
        <ul>
          {registrations.map((user) => (
            <li key={user._id} className="border p-2 my-2">
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
