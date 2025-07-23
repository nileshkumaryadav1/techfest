"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function WinnersTab() {
  const [events, setEvents] = useState([]);
  const [savingIdx, setSavingIdx] = useState(null);

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
    if (!confirm("Are you sure you want to clear all winners for this event?")) return;
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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">Manage Event Winners</h1>

      {events.map((event, idx) => {
        const currentWinnerIds = event.winners.map((w) => w._id);

        return (
          <div key={event._id} className="border rounded-lg shadow-sm p-5 mb-8 bg-white">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-indigo-700">{event.title}</h2>
              <span className="text-sm text-gray-500">{event.enrolledCount} enrolled</span>
            </div>

            <p className="text-sm text-gray-600">
              📅 {new Date(event.date).toLocaleDateString()} | 📍 {event.venue}
            </p>

            <div className="mt-4">
              <p className="font-medium mb-2 text-gray-800">Select Winners:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {event.enrolledStudents.length === 0 ? (
                  <p className="text-sm italic text-gray-500 col-span-2">
                    No students enrolled for this event.
                  </p>
                ) : (
                  event.enrolledStudents.map((student) => {
                    const isChecked = currentWinnerIds.includes(student._id);
                    return (
                      <label key={student._id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const newWinners = isChecked
                              ? event.winners.filter((w) => w._id !== student._id)
                              : [...event.winners, {
                                  _id: student._id,
                                  name: student.name,
                                  email: student.email,
                                }];

                            setEvents((prev) =>
                              prev.map((ev, i) =>
                                i === idx ? { ...ev, winners: newWinners } : ev
                              )
                            );
                          }}
                        />
                        <span className="text-sm text-gray-700">
                          {student.name} ({student.email})
                        </span>
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
