"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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
      alert("Winners updated successfully!");
    } catch (err) {
      alert("Error updating winners.");
      console.error(err);
    } finally {
      setSavingIdx(null);
      fetchEvents();
    }
  };

  const clearWinners = async (eventId) => {
    if (!confirm("Are you sure you want to clear all winners for this event?"))
      return;
    try {
      await axios.delete("/api/admin/winners", { data: { eventId } });
      alert("Winners cleared.");
      fetchEvents();
    } catch (err) {
      alert("Error clearing winners.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto md:px-4 md:py-6">
      <h1 className="text-xl md:text-3xl font-bold md:mb-8 mb-1 text-center">
        Manage Winners - Event ({events.length})
      </h1>

      <input
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by event title"
        className="md:mb-6 mx-auto p-2 border border-[color:var(--border)] rounded-lg w-full m-1"
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
              className="border rounded-lg shadow-sm md:p-5 p-2 md:mb-8 mb-4 bg-white"
            >
              <div className="flex flex-col justify-between items-center md:mb-2 mb-1">
                <h2 className="text-md md:text-xl font-semibold text-indigo-700">
                  {event.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {event.enrolledCount} enrolled
                </p>
              </div>

              <p className="text-sm text-gray-600">
                📅 {new Date(event.date).toLocaleDateString()} | 📍{" "}
                {event.venue}
              </p>

              <div className="mt-2 md:mt-4">
                <p className="mb-2 text-gray-800 font-semibold text-center">
                  Select Winners:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                  {event.enrolledStudents.length === 0 ? (
                    <div className="col-span-full text-sm italic text-gray-500 border rounded-md p-4 bg-gray-50">
                      No students enrolled for this event.
                    </div>
                  ) : (
                    event.enrolledStudents.map((student) => {
                      const isChecked = currentWinnerIds.includes(student._id);

                      return (
                        <label
                          key={student._id}
                          className="flex items-center gap-3 border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition"
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
                            className="w-4 h-4 accent-[color:var(--accent)]"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {student.email}
                            </p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => updateWinners(event._id, event.winners, idx)}
                    disabled={savingIdx === idx}
                    className="px-4 py-2 rounded bg-green-600 text-white font-medium hover:bg-green-700 transition"
                  >
                    {savingIdx === idx ? "Saving..." : "Update Winners"}
                  </button>
                  <button
                    onClick={() => clearWinners(event._id)}
                    className="px-4 py-2 rounded bg-red-500 text-white font-medium hover:bg-red-600 transition"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
