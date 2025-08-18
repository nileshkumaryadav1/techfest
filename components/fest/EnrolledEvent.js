"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CountdownTimer from "../custom/CountdownTimer";
import LoadingState from "../custom/myself/LoadingState";

export default function EnrolledEvents({ studentId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Enrolled Events
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

  // De-enroll handler
  const handleDeEnroll = async (eventId) => {
    if (!confirm("Are you sure you want to de-enroll from this event?")) return;

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
      console.error("Error de-enrolling:", err);
      alert("Something went wrong.");
    }
  };

  // Formatters
  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Date not provided";

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Loading state
  if (!studentId) return null;
  if (loading) return <LoadingState text="Loading your events..." />;

  if (events.length === 0)
    return <p className="text-gray-400">No enrolled events yet.</p>;

  return (
    <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/20 shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-cyan-300">Enrolled Events</h2>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-cyan-200 border border-white/20">
          {events.length}
        </span>
      </div>

      {/* Event List */}
      <ul className="space-y-4">
        {events.map((event) => (
          <li
            key={event._id}
            className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:border-cyan-300/40 transition-all group"
          >
            {/* Top Row */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-bold text-cyan-200 group-hover:text-cyan-100 transition">
                {event.title}
              </h3>
              <div className="flex gap-2">
                <Link
                  href={`/events/${event.slug || ""}`}
                  className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-200 text-xs hover:bg-cyan-500/30 transition"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDeEnroll(event._id)}
                  disabled={event.winners?.length > 0}
                  className={`px-3 py-1 rounded-lg text-xs transition ${
                    event.winners?.length > 0
                      ? "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                      : "bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200"
                  }`}
                >
                  {event.winners?.length > 0 ? "Locked 🏅" : "Remove"}
                </button>
              </div>
            </div>

            {/* Date / Time */}
            <p className="text-sm text-gray-300">
              📅 {formatDate(event.date)} • ⏰ {formatTime(event.time)}
            </p>

            {/* Countdown */}
            <CountdownTimer
              date={event.date}
              time={event.time}
              winnerDeclared={event.winners?.length > 0}
              cancelled={event.status === "cancelled"}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
