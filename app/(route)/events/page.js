"use client";
import { useEffect, useState } from "react";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (data.success) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Upcoming Events</h1>

      {loading ? (
        <p className="text-center">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-center">No events found.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event._id} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-600">{event.description}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Date:</strong> {event.date} - {event.time}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
