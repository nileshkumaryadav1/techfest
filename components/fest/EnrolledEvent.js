"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CountdownTimer from "../custom/CountdownTimer";
import LoadingState from "../custom/myself/LoadingState";
import LoadingSkeletonSmall from "../custom/myself/LoadingSkeletonSmall";
import LoadingSkeleton from "../custom/myself/LoadingSkeleton";

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
    if (!confirm("Are you sure you want to de-enroll from this event?")) return;
    try {
      const res = await fetch(`/api/enrollments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, eventId }),
      });
      if (res.ok) setEvents((prev) => prev.filter((e) => e._id !== eventId));
      else alert("Failed to de-enroll from the event.");
    } catch (err) {
      console.error("Error de-enrolling:", err);
      alert("Something went wrong.");
    }
  };

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

  if (!studentId) return null;
  if (loading)
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:hidden">
          <LoadingSkeletonSmall />
          <LoadingSkeleton />
        </div>
        <div className="hidden md:grid grid-cols-3 gap-4">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      </>
    );
  if (events.length === 0)
    return (
      <p className="text-center text-sm sm:text-base text-[color:var(--secondary)] italic mt-6">
        No enrolled events yet 🚀
      </p>
    );

  return (
    <section className="py-6 px-3 sm:px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8 drop-shadow-md">
          🎟️ Your Enrolled Events
        </h2>

        <div className="p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-[color:var(--border)] shadow-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-[color:var(--foreground)]">
              Active Enrollments
            </h3>
            <span className="px-3 py-1 text-xs sm:text-sm font-semibold rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-[color:var(--border)] text-[color:var(--foreground)] shadow-sm text-center">
              {events.length} Enrolled
            </span>
          </div>

          <ul className="grid gap-3 sm:gap-5 grid-cols-1 sm:grid-cols-2">
            {events.map((event) => (
              <li
                key={event._id}
                className="group relative p-4 sm:p-5 rounded-2xl bg-[color:var(--background)] border border-[color:var(--border)] shadow-md hover:scale-[1.02] hover:shadow-[color:var(--accent)]/20 transition-all"
              >
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition bg-gradient-to-tr from-purple-500 via-pink-500 to-cyan-500 blur-2xl"></div>

                <div className="flex justify-between">
                  {/* Event Title */}
                  <h4 className="text-sm sm:text-base font-semibold text-[color:var(--foreground)] group-hover:text-[color:var(--accent)] break-words">
                    {event.title}
                  </h4>
                  {/* De-enroll Button */}
                  <button
                    onClick={() => handleDeEnroll(event._id)}
                    disabled={
                      event.winners?.length > 0 || event.status === "cancelled"
                    }
                    className={`relative px-3 py-1 rounded-lg text-xs sm:text-sm min-w-[80px] transition ${
                      event.winners?.length > 0 || event.status === "cancelled"
                        ? "bg-gray-500/20 text-[color:var(--secondary)] cursor-not-allowed"
                        : "bg-red-500/20 text-[color:var(--foreground)] hover:bg-red-500/30 hover:text-[color:var(--secondary)]"
                    }`}
                    title={
                      event.winners?.length > 0
                        ? "This event has ended and winners are declared. You cannot remove it."
                        : event.status === "cancelled"
                        ? "This event has been cancelled. You cannot remove it."
                        : ""
                    }
                  >
                    {event.winners?.length > 0
                      ? "Completed 🎉"
                      : event.status === "cancelled"
                      ? "Cancelled ❌"
                      : "Remove"}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-[color:var(--secondary)] mb-2">
                  📅 {formatDate(event.date)} • ⏰ {formatTime(event.time)}
                </p>

                <CountdownTimer
                  date={event.date}
                  time={event.time}
                  winnerDeclared={event.winners?.length > 0}
                  cancelled={event.status === "cancelled"}
                />

                {/* Winners */}
                {event.winners?.length > 0 && (
                  <div className="mt-2 border-t border-[color:var(--border)] pt-2">
                    <p className="text-xs sm:text-xs text-[color:var(--secondary)] mb-1">
                      🏆 Winner Declared
                    </p>

                    {event.winners.some(
                      (winner) => winner._id === studentId
                    ) ? (
                      event.winners.map((winner) => (
                        <p
                          key={winner._id}
                          className={
                            winner._id === studentId
                              ? "font-bold text-green-600 text-xs"
                              : "text-xs"
                          }
                        >
                          : {winner.name}
                        </p>
                      ))
                    ) : (
                      <>
                        {event.winners.map((winner) => (
                          <p key={winner._id} className="text-xs">
                            {winner.name}
                          </p>
                        ))}
                        <p className="mt-1 text-xs text-green-500">
                          🍀 Better luck next fest!
                        </p>
                      </>
                    )}
                  </div>
                )}
                <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                  <div className="flex gap-2 flex-wrap border-t border-[color:var(--border)] pt-2 mt-2">
                    <Link
                      href={`/events/${event.slug || ""}`}
                      className="px-3 py-2 rounded-lg bg-cyan-500/20 text-[color:var(--foreground)] text-xs sm:text-sm hover:bg-cyan-500/30 transition w-full text-center"
                    >
                      View Event
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
