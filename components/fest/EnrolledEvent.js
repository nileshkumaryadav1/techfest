// components/dashboard/EnrolledEvents.jsx
"use client";

import { useEffect, useState } from "react";

export default function EnrolledEvents({ studentId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnrolled() {
      const res = await fetch(`/api/enrollments?studentId=${studentId}`);
      const data = await res.json();
      setEvents(data.enrolledEvents || []);
      setLoading(false);
    }
    fetchEnrolled();
  }, [studentId]);

  if (loading) return <p>Loading your events...</p>;
  if (events.length === 0) return <p>You haven&apos;t enrolled in any events yet.</p>;

  return (
    <div className="p-4 border rounded-xl bg-[var(--card)]">
      <h2 className="text-xl font-semibold mb-3">📅 Enrolled Events</h2>
      <ul className="space-y-2">
        {events.map((event) => (
          <li key={event._id} className="border p-3 rounded bg-[var(--background)]">
            <p className="font-medium">{event.title}</p>
            <p className="text-sm text-[var(--secondary)]">{event.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
