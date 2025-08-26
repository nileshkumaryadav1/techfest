"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEvents();
    fetchWinnerEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/admin/events");
      const valid = res.data.filter((e) => e && e._id && e.title);
      setEvents(valid);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  const fetchWinnerEvents = async () => {
    try {
      const res = await axios.get("/api/admin/winners");
      if (res.data.success) setAllEvents(res.data.events);
    } catch (err) {
      console.error("Failed to fetch winner events:", err);
    }
  };

  const handleEditClick = async (event) => {
    setEditingEvent(event._id);
    setForm(event);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/admin/events/${editingEvent}`, form);
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      console.error("Error updating event:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`/api/admin/events/${eventId}`);
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto md:p-6 md:space-y-8 space-y-2">
      <h1 className="md:text-3xl text-xl font-bold text-[color:var(--accent)] text-center">
        Manage Events ({events.length})
      </h1>

      <input
        type="text"
        placeholder="Search events..."
        onChange={(e) => setSearch(e.target.value)}
        className="border p-1 mx-auto rounded w-full"
      />

      {events.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">No events found.</p>
      ) : (
        events
          .filter((event) =>
            event.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((event) => {
            const matched = allEvents.find((e) => e._id === event._id);

            return (
              <div
                key={event._id}
                className="bg-[var(--background)] border border-[color:var(--border)] rounded-2xl shadow-md md:p-6 p-3 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  {/* Left - Event Details */}
                  <div className="text-sm text-[color:var(--secondary)] md:space-y-2 flex-1">
                    <h2 className="md:text-xl text-lg text-center font-semibold text-[color:var(--foreground)]">
                      {event.title}
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-x-6 md:gap-y-1">
                      <p>
                        <strong>Category:</strong> {event.category}
                      </p>
                      <p>
                        <strong>Event ID:</strong> {event.eventId}
                      </p>
                      <p>
                        <strong>Date & Time:</strong>{" "}
                        {new Date(event.date).toDateString()} ⏰ {event.time}
                      </p>
                      <p>
                        <strong>Venue:</strong> {event.venue}
                      </p>
                      <p>
                        <strong>Prize:</strong> {event.prizes}
                      </p>
                      <p>
                        <strong>Workshops:</strong> {event.workshops || "N/A"}
                      </p>
                      <p>
                        <strong>Speakers:</strong> {event.speakers || "N/A"}
                      </p>
                      <p>
                        <strong>Enrolled:</strong> {matched?.enrolledCount || 0}
                      </p>
                      <p>
                        <strong>Status:</strong> {event?.status || "N/A"}
                      </p>
                    </div>

                    <div className="mt-3">
                      <p className="text-[color:var(--secondary)] leading-relaxed">
                        <strong>Description:</strong>{" "}
                        {event.description.slice(0, 100) + "..." || "N/A"}
                      </p>
                    </div>

                    <div className="flex sm:flex-row items-center gap-3 mt-2">
                      {event.ruleBookPdfUrl && (
                        <a
                          href={event.ruleBookPdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-sm"
                        >
                          📘 Rulebook
                        </a>
                      )}
                      {event.imageUrl && (
                        <a
                          href={event.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-sm"
                        >
                          🖼️ Image
                        </a>
                      )}
                    </div>

                    <div className="mt-2">
                      <strong>Coordinators:</strong>{" "}
                      <span className="text-[color:var(--secondary)]">
                        {Array.isArray(event.coordinators)
                          ? event.coordinators
                              .map((c) =>
                                typeof c === "string"
                                  ? c
                                  : `${c.name} (${c.contact || "No contact"})`
                              )
                              .join(", ")
                          : "N/A"}
                      </span>
                    </div>

                    <p className="text-[color:var(--accent)] font-semibold mt-2">
                      🏆 Winner:{" "}
                      {event.winners.length > 0
                        ? event.winners.map((w) => w.name).join(", ")
                        : "Not declared"}
                    </p>
                  </div>

                  {/* Right - Action Buttons */}
                  <div className="flex flex-col gap-3 text-sm min-w-[120px]">
                    <Link
                      href={`/admin/events/${event._id}`}
                      className="px-3 py-4 rounded-md border border-[color:var(--accent)] text-[color:var(--accent)] hover:bg-[color:var(--accent)/10] transition text-center"
                    >
                      🔍 View
                    </Link>
                    <button
                      onClick={() => handleEditClick(event)}
                      className="px-3 py-1 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      disabled={event.winners.length > 0}
                      className={`px-3 py-1 rounded-md border transition
                           ${
                             event.winners.length > 0
                               ? "border-gray-400 text-gray-400 bg-[color:var(--background)] cursor-not-allowed"
                               : "border-red-500 text-red-600 hover:bg-red-50"
                           }
                           `}
                    >
                      {event.winners.length > 0 ? "🚫 Locked" : "❌ Delete"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
      )}
      {/* Edit Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-6 text-[color:var(--accent)]">
              ✏️ Edit Event
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "title",
                "slug",
                "date",
                "time",
                "venue",
                "type",
                "description",
                "imageUrl",
                "prizes",
                "eventId",
                "category",
                "ruleBookPdfUrl",
                "workshops",
                "speakers",
                "status",
              ].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-sm font-semibold mb-1 capitalize text-gray-700 dark:text-gray-200">
                    {field}
                  </label>

                  {field === "status" ? (
                    <select
                      className="rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-2 focus:ring-2 focus:ring-[color:var(--accent)] focus:outline-none bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 w-full"
                      value={form.status || ""}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      <option value="">Select Status</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="finished">Finished</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : field === "type" ? (
                    <select
                      className="rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-2 focus:ring-2 focus:ring-[color:var(--accent)] focus:outline-none bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 w-full"
                      value={form.type || ""}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                    >
                      <option value="">Select Type</option>
                      <option value="single">Single</option>
                      <option value="team">Team</option>
                    </select>
                  ) : (
                    <input
                      type={
                        field === "date"
                          ? "date"
                          : field === "time"
                          ? "time"
                          : field === "eventId" || field === "number"
                          ? "number"
                          : "text"
                      }
                      className="rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-2 focus:ring-2 focus:ring-[color:var(--accent)] focus:outline-none bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 w-full"
                      value={form[field] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [field]: e.target.value })
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Coordinators */}
            <div className="mt-8">
              <label className="text-sm font-semibold mb-2 block text-[color:var(--accent)]">
                👥 Coordinators
              </label>

              {(form.coordinators || []).map((coord, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center mb-2"
                >
                  <input
                    type="text"
                    placeholder="Name"
                    className="rounded-xl border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-[color:var(--accent)]"
                    value={coord.name}
                    onChange={(e) => {
                      const updated = [...form.coordinators];
                      updated[idx].name = e.target.value;
                      setForm({ ...form, coordinators: updated });
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    className="rounded-xl border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-[color:var(--accent)]"
                    value={coord.contact}
                    onChange={(e) => {
                      const updated = [...form.coordinators];
                      updated[idx].contact = e.target.value;
                      setForm({ ...form, coordinators: updated });
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    className="rounded-xl border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-[color:var(--accent)]"
                    value={coord.role}
                    onChange={(e) => {
                      const updated = [...form.coordinators];
                      updated[idx].role = e.target.value;
                      setForm({ ...form, coordinators: updated });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...form.coordinators];
                      updated.splice(idx, 1);
                      setForm({ ...form, coordinators: updated });
                    }}
                    className="text-red-500 text-sm hover:underline"
                  >
                    ❌ Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    coordinators: [
                      ...(form.coordinators || []),
                      { name: "", contact: "", role: "" },
                    ],
                  })
                }
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                ➕ Add Coordinator
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-6 py-2 rounded-xl bg-[color:var(--highlight)] font-semibold hover:opacity-90 transition"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
