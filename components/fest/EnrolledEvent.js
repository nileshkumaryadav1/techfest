"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function EnrolledEvents({ studentId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrolled = async () => {
    try {
      const res = await fetch(`/api/enrollments?studentId=${studentId}`);
      const data = await res.json();

      const validEvents = (data.enrolledEvents || []).filter(
        (e) => e && e._id && e.title
      );
      setEvents(validEvents);
    } catch (err) {
      console.error("Error fetching enrolled events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchEnrolled();
  }, [studentId]);

  const handleDeEnroll = async (eventId) => {
    const confirmDelete = confirm("Are you sure you want to de-enroll from this event?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/enrollments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, eventId }),
      });

      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e._id !== eventId));
      } else {
        alert("Failed to de-enroll from the event.");
      }
    } catch (err) {
      console.error("Error de-enrolling from event:", err);
      alert("Something went wrong.");
    }
  };

  const handleDeEnrollAll = async () => {
    const confirmAll = confirm("This will remove you from ALL enrolled events. Continue?");
    if (!confirmAll) return;

    try {
      const res = await fetch(`/api/enrollments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });

      if (res.ok) {
        setEvents([]);
      } else {
        alert("Failed to de-enroll from all events.");
      }
    } catch (err) {
      console.error("Error de-enrolling from all:", err);
      alert("Something went wrong.");
    }
  };

  if (!studentId) return null;

  if (loading)
    return (
      <p className="text-[color:var(--secondary)] flex items-center gap-2">
        <span className="animate-spin text-xl">⏳</span> Loading your events...
      </p>
    );

  if (events.length === 0)
    return (
      <p className="text-[color:var(--secondary)]">
        You haven&apos;t enrolled in any events yet.
      </p>
    );

  return (
    <div className="p-6 border border-[color:var(--border)] rounded-2xl bg-[color:var(--card)] shadow-sm">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDeEnrollAll}
          className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-sm font-medium"
        >
          De-register from All
        </button>
      </div>

      <ul className="space-y-4">
        {events.map((event) => (
          <li
            key={event._id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] shadow hover:shadow-md transition-all"
          >
            <div className="flex-1">
              <p className="text-lg font-semibold text-[color:var(--foreground)]">
                {event.title}
              </p>
              <p className="text-sm text-[color:var(--secondary)]">
                {event.description || "No description available."}
              </p>
              <p className="text-xs text-[color:var(--secondary)] mt-1">
                📅 {event.date || "Date not provided"}
              </p>
            </div>

            <div className="flex gap-3 text-sm font-medium">
              <Link
                href={`/events/${event.slug || ""}`}
                className="px-3 py-1 rounded-md bg-[color:var(--accent)] text-black hover:opacity-90 transition"
              >
                View
              </Link>
              <button
                onClick={() => handleDeEnroll(event._id)}
                className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
