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
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-[color:var(--accent)]">Manage Events</h1>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        events.map((event) => {
          const matched = allEvents.find((e) => e._id === event._id);

          return (
            <div key={event._id} className="p-5 rounded-lg shadow border space-y-2">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="text-sm space-y-1">
                  <p><strong>Title:</strong> {event.title}</p>
                  <p><strong>Category:</strong> {event.category}</p>
                  <p><strong>Event ID:</strong> {event.eventId}</p>
                  <p><strong>Date:</strong> {new Date(event.date).toDateString()} ⏰ {event.time}</p>
                  <p><strong>Venue:</strong> {event.venue}</p>
                  <p><strong>Prize:</strong> {event.prizes}</p>
                  <p><strong>Description:</strong> {event.description}</p>
                  <p>
                    <strong>Rulebook:</strong>{" "}
                    <a href={event.ruleBookPdfUrl} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                      View
                    </a>
                  </p>
                  <p>
                    <strong>Image:</strong>{" "}
                    <a href={event.imageUrl} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                      View
                    </a>
                  </p>
                  <p>
                    <strong>Coordinators:</strong>{" "}
                    {Array.isArray(event.coordinators)
                      ? event.coordinators.map((c) =>
                          typeof c === "string" ? c : `${c.name} (${c.contact})`
                        ).join(", ")
                      : "N/A"}
                  </p>
                  <p><strong>Workshops:</strong> {event.workshops}</p>
                  <p><strong>Speakers:</strong> {event.speakers}</p>
                  {matched && (
                    <p className="text-gray-600">👥 Enrolled: {matched.enrolledCount}</p>
                  )}
                  <p className="text-[color:var(--highlight)]">
                    🏆 Winner:{" "}
                    {event.winners.length > 0
                      ? event.winners.map((w) => w.name).join(", ")
                      : "Not declared"}
                  </p>
                </div>

                <div className="flex flex-col gap-2 text-sm">
                  <button
                    onClick={() => handleEditClick(event)}
                    className="text-blue-600 hover:underline"
                  >
                    ✏️ Edit
                  </button>
                  <Link
                    href={`/admin/events/${event._id}`}
                    className="text-[color:var(--accent)] hover:underline"
                  >
                    🔍 View
                  </Link>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="text-red-600 hover:underline"
                  >
                    ❌ Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Edit Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex justify-center items-center px-4">
          <div className="w-full max-w-3xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-semibold mb-4">Edit Event</h2>

            {[
              "title",
              "slug",
              "date",
              "time",
              "venue",
              "description",
              "imageUrl",
              "prizes",
              "eventId",
              "category",
              "ruleBookPdfUrl",
              "workshops",
              "speakers",
            ].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                <input
                  type={field === "date" ? "date" : "text"}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                  value={form[field] || ""}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}

            {/* Coordinators */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Coordinators</label>
              {form.coordinators?.map((coord, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Name"
                    className="border px-3 py-2 rounded"
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
                    className="border px-3 py-2 rounded"
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
                    className="border px-3 py-2 rounded"
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
                    className="text-red-600 text-sm"
                  >
                    Remove
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
                className="text-blue-600 text-sm hover:underline mt-2"
              >
                ➕ Add Coordinator
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingEvent(null)}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-[color:var(--primary)] text-white px-4 py-2 rounded hover:opacity-90"
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
