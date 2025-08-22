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
  if (loading) return <LoadingState text="Fetching enrolled events..." />;

  if (events.length === 0)
    return (
      <p className="text-center text-[color:var(--secondary)] italic">
        No enrolled events yet 🚀
      </p>
    );

  return (
    <section className="relative py-8 px-3 sm:px-6 md:px-12">
      {/* Container */}
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Title */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-center mb-6 sm:mb-8 drop-shadow-md">
          🎟️ Your Enrolled Events
        </h2>

        {/* Card Container */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-[color:var(--border)] shadow-xl">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
            <h3 className="text-base sm:text-xl font-bold text-[color:var(--foreground)]">
              Active Enrollments
            </h3>
            <span className="px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-[color:var(--border)] text-[color:var(--foreground)] shadow-sm text-center">
              {events.length} Enrolled
            </span>
          </div>

          {/* Event List */}
          <ul className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            {events.map((event) => (
              <li
                key={event._id}
                className="group relative p-4 sm:p-5 rounded-2xl bg-[color:var(--background)] backdrop-blur-xl border border-[color:var(--border)] shadow-lg hover:scale-[1.02] hover:shadow-[color:var(--accent)]/10 transition-all"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition bg-gradient-to-tr from-purple-500 via-pink-500 to-cyan-500 blur-2xl"></div>

                {/* Top Row */}
                <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                  <h4 className="text-base sm:text-lg font-semibold text-[color:var(--foreground)] group-hover:text-[color:var(--accent)] transition break-words">
                    {event.title}
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    <Link
                      href={`/events/${event.slug || ""}`}
                      className="px-3 py-1 rounded-lg bg-cyan-500/20 text-[color:var(--foreground)] text-xs sm:text-sm hover:bg-cyan-500/30 transition"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDeEnroll(event._id)}
                      disabled={event.winners?.length > 0}
                      className={`px-3 py-1 rounded-lg text-xs sm:text-sm transition min-w-[80px] ${
                        event.winners?.length > 0
                          ? "bg-gray-500/20 text-[color:var(--secondary)] cursor-not-allowed"
                          : "bg-red-500/20 text-[color:var(--foreground)] hover:bg-red-500/30 hover:text-[color:var(--secondary)]"
                      }`}
                    >
                      {event.winners?.length > 0 ? "Ended 🎉" : "Remove"}
                    </button>
                  </div>
                </div>

                {/* Date & Time */}
                <p className="relative text-xs sm:text-sm text-[color:var(--secondary)] mb-3">
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
      </div>
    </section>
  );
}
