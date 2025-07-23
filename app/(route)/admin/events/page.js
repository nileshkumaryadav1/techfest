"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({});
  const [enrolledStudents, setEnrolledStudents] = useState([]);
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

    try {
      const res = await axios.get(`/api/admin/enrolled?eventId=${event._id}`);
      setEnrolledStudents(res.data || []);
    } catch (err) {
      console.error("Failed to fetch enrolled students:", err);
    }
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
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">
  All Events ({events.length})
</h1>

<div className="space-y-4">
  {events.length === 0 ? (
    <p>No events found.</p>
  ) : (
    events.map((event) => {
      const matched = allEvents.find((e) => e._id === event._id);

      return (
        <div key={event._id} className="p-4 rounded-lg shadow border">
          <div className="flex justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <p><strong>Id:</strong> {event._id}</p>
              <p><strong>Title:</strong> {event.title}</p>
              <p><strong>Slug:</strong> {event.slug}</p>
              <p><strong>Event ID:</strong> {event.eventId}</p>
              <p><strong>Category:</strong> {event.category}</p>
              <p><strong>Date:</strong> {new Date(event.date).toDateString()}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
              <p><strong>Description:</strong> {event.description}</p>
              <p>
                <strong>Rules:</strong>{" "}
                <a
                  href={event.ruleBookPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {event.ruleBookPdfUrl}
                </a>
              </p>
              <p>
                <strong>Image:</strong>{" "}
                <a
                  href={event.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {event.imageUrl}
                </a>
              </p>
              <p>
                <strong>Coordinators:</strong>{" "}
                {Array.isArray(event.coordinators)
                  ? event.coordinators
                      .map((c) =>
                        typeof c === "string"
                          ? c
                          : `${c.name}${c.contact ? ` (${c.contact})` : ""}`
                      )
                      .join(", ")
                  : "N/A"}
              </p>
              <p><strong>Prize:</strong> {event.prizes}</p>
              <p><strong>Workshops:</strong> {event.workshops}</p>
              <p><strong>Speakers:</strong> {event.speakers}</p>

              {matched && (
                <p className="text-sm text-gray-600 font-medium">
                  Students: {matched.enrolledCount} enrolled
                </p>
              )}

              <p className="text-sm text-[color:var(--accent)] font-semibold">
                Winner:{" "}
                {event.winners.length > 0
                  ? event.winners.map((w) => w.name).join(", ")
                  : "Not declared"}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => handleEditClick(event)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <Link
                href={`/admin/events/${event._id}`}
                className="text-[color:var(--highlight)] underline"
              >
                View
              </Link>
              <button
                onClick={() => handleDelete(event._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      );
    })
  )}
</div>


      {/* Edit Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="p-6 rounded-lg w-full max-w-4xl shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit Event</h2>

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
                <label className="block text-sm font-medium mb-1 capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={form[field] || ""}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}

            {/* Coordinators */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Coordinators
              </label>
              {form.coordinators?.map((coord, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Name"
                    className="flex-1 border px-3 py-2 rounded"
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
                    className="flex-1 border px-3 py-2 rounded"
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
                    className="flex-1 border px-3 py-2 rounded"
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
                    className="text-red-500 hover:text-red-700 px-2"
                  >
                    ❌
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
                className="text-sm text-blue-600 hover:underline"
              >
                ➕ Add Coordinator
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditingEvent(null)}
                className="text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
