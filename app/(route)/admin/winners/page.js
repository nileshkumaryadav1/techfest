"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Trophy, Users } from "lucide-react";

export default function WinnersTab() {
  const [events, setEvents] = useState([]);
  const [savingIdx, setSavingIdx] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/admin/winners");
      if (res.data.success) setEvents(res.data.events);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  const updateWinners = async (eventId, winnerList, idx) => {
    setSavingIdx(idx);
    try {
      await axios.patch("/api/admin/winners", {
        eventId,
        winners: winnerList,
      });
      alert("✅ Winners updated successfully!");
    } catch (err) {
      alert("❌ Error updating winners.");
      console.error(err);
    } finally {
      setSavingIdx(null);
      fetchEvents();
    }
  };

  const clearWinners = async (eventId) => {
    if (!confirm("⚠️ Clear all winners for this event?")) return;
    try {
      await axios.delete("/api/admin/winners", { data: { eventId } });
      alert("✅ Winners cleared.");
      fetchEvents();
    } catch (err) {
      alert("❌ Error clearing winners.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2 text-[color:var(--highlight)]">
        <Trophy className="w-6 h-6 md:w-8 md:h-8" />
        Manage Winners ({events.length})
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search by event title"
        className="w-full px-4 py-2 mb-8 rounded-xl border border-[color:var(--border)] bg-white/5 backdrop-blur placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-[color:var(--accent)] transition"
      />

      {events
        .filter((event) =>
          event.title.toLowerCase().includes(search.toLowerCase())
        )
        .map((event, idx) => {
          const currentWinnerIds = event.winners.map((w) => w._id);

          return (
            <div
              key={event._id}
              className="border border-[color:var(--border)] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] bg-[color:var(--card)] backdrop-blur-md p-4 md:p-6 mb-6 space-y-3"
            >
              {/* Event Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <h2 className="text-lg md:text-xl font-semibold text-[color:var(--foreground)] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[color:var(--accent)]" />
                  {event.title}
                </h2>
                <p className="text-xs md:text-sm text-[color:var(--secondary)]">
                  {event.enrolledCount} enrolled | 📅{" "}
                  {new Date(event.date).toLocaleDateString()} | 📍 {event.venue}
                </p>
              </div>

              {/* Winner Selection */}
              <div>
                <p className="font-semibold text-[color:var(--accent)] mb-3 text-center">
                  Select Winners
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                  {event.enrolledStudents.length === 0 ? (
                    <div className="col-span-full text-sm italic text-[color:var(--secondary)] border border-[color:var(--border)] rounded-lg p-4 bg-white/5 backdrop-blur">
                      No students enrolled for this event.
                    </div>
                  ) : (
                    event.enrolledStudents.map((student) => {
                      const isChecked = currentWinnerIds.includes(student._id);

                      return (
                        <label
                          key={student._id}
                          className="flex items-center gap-3 border border-[color:var(--border)] rounded-xl p-3 bg-white/10 backdrop-blur hover:scale-[1.01] transition"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const newWinners = isChecked
                                ? event.winners.filter(
                                    (w) => w._id !== student._id
                                  )
                                : [
                                    ...event.winners,
                                    {
                                      _id: student._id,
                                      name: student.name,
                                      email: student.email,
                                    },
                                  ];

                              setEvents((prev) =>
                                prev.map((ev, i) =>
                                  i === idx
                                    ? { ...ev, winners: newWinners }
                                    : ev
                                )
                              );
                            }}
                            className="w-4 h-4 accent-[color:var(--highlight)]"
                          />
                          <div>
                            <p className="text-sm font-medium text-[color:var(--foreground)]">
                              {student.name}
                            </p>
                            <p className="text-xs text-[color:var(--secondary)]">
                              {student.email}
                            </p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
                <button
                  onClick={() => updateWinners(event._id, event.winners, idx)}
                  disabled={savingIdx === idx}
                  className="px-4 py-2 rounded-xl font-medium bg-green-600 hover:bg-green-700 text-white transition-all disabled:opacity-50"
                >
                  {savingIdx === idx ? "Saving..." : "💾 Update Winners"}
                </button>
                <button
                  onClick={() => clearWinners(event._id)}
                  className="px-4 py-2 rounded-xl font-medium bg-red-500 hover:bg-red-600 text-white transition-all"
                >
                  🗑 Clear All
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}
