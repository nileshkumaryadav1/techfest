'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  // all events from winner api
  const [allEvents, setAllEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({});
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
      fetchEvents();
      fetchAllEvents();
    }, []);
  
    const fetchAllEvents = async () => {
      const res = await axios.get("/api/admin/winners");
      if (res.data.success) setAllEvents(res.data.events);
    };

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/admin/events');
      const validEvents = res.data.filter(event => event && event._id && event.title);
      setEvents(validEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleEditClick = async (event) => {
    try {
      setEditingEvent(event._id);
      setForm(event);
      const res = await axios.get(`/api/admin/enrolled?eventId=${event._id}`);
      setEnrolledStudents(res.data || []);
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(`/api/admin/events/${editingEvent}`, form);
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`/api/admin/events/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Events</h1>
      <div className="space-y-4">
        {events.length === 0 && (
          <p className="text-gray-500">No valid events found.</p>
        )}
        {events.map(event => (
          <div key={event._id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-sm text-gray-600">
                  {new Date(event.date).toDateString()} at {event.time}
                </p>
                <p className="text-sm text-gray-600">Venue: {event.venue}</p>
                <p className="text-sm text-gray-600">
                  Coordinators: {event.coordinators?.join(', ')}
                </p>
{(() => {
  const matched = allEvents.find(e => e._id === event._id);
  if (!matched) return null;
  return (
    <p className="text-sm text-gray-600">
      Students: {matched.enrolledCount} enrolled
      <p className="text-sm text-green-600">
      Winner: {event.winner || 'Not declared'}</p>
    </p>
  );
})()}
                {/* <p className="text-sm text-green-600">
                  Winner: {event.winner || 'Not declared'}
                </p> */}
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
                  className="text-blue-500 underline"
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
        ))}
      </div>

      {/* Edit Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-lg shadow-xl">
            <h2 className="text-lg font-bold mb-4">Edit Event</h2>

            {['title', 'slug', 'date', 'time', 'venue', 'description', 'imageUrl', 'prizes'].map((field) => (
              <div className="mb-4" key={field}>
                <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={form[field] || ''}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Coordinators (comma separated)</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={form.coordinators?.join(', ') || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    coordinators: e.target.value.split(',').map(s => s.trim()),
                  })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Winner</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={form.winner || ''}
                onChange={(e) => setForm({ ...form, winner: e.target.value })}
              >
                <option value="">Select Winner</option>
                {enrolledStudents.map((student) => (
                  <option key={student._id} value={student.name}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
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
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
