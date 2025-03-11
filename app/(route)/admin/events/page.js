"use client";
import { useState, useEffect } from "react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", description: "", location: "", date: "", time: "" });
  const [editingEventId, setEditingEventId] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (data.success) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const method = editingEventId ? "PUT" : "POST";
    const url = editingEventId ? `/api/events/${editingEventId}` : "/api/events";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(editingEventId ? "Event updated successfully!" : "Event added successfully!");
        setFormData({ title: "", description: "", location: "", date: "", time: "" });
        setEditingEventId(null);
        setEvents((prevEvents) =>
          editingEventId
            ? prevEvents.map((event) => (event._id === editingEventId ? data.event : event))
            : [...prevEvents, data.event]
        );
      } else {
        setMessage("Error: " + data.error);
      }
    } catch (error) {
      setMessage("Something went wrong!");
    }
  };

  // Load event data for editing
  const handleEdit = (event) => {
    setFormData(event);
    setEditingEventId(event._id);
  };

  // Delete event
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setMessage("Event deleted successfully!");
        setEvents(events.filter((event) => event._id !== id));
      } else {
        setMessage("Error: " + data.error);
      }
    } catch (error) {
      setMessage("Something went wrong!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">{editingEventId ? "Edit Event" : "Add New Event"}</h1>

      {message && <p className="text-center text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="description" placeholder="Event Description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="location" placeholder="Location (City or Lat,Lng)" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full p-2 border rounded" required />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          {editingEventId ? "Update Event" : "Add Event"}
        </button>
      </form>

      <h2 className="text-xl font-bold mt-6">All Events</h2>
      {loading ? <p>Loading events...</p> : events.length === 0 ? <p>No events found.</p> : (
        <ul className="space-y-4 mt-4">
          {events.map((event) => (
            <li key={event._id} className="border p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Date:</strong> {event.date} - {event.time}</p>
              <div className="mt-2 flex space-x-4">
                <button onClick={() => handleEdit(event)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(event._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
