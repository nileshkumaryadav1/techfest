"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [winnerInput, setWinnerInput] = useState('');
  const [isSavingWinner, setIsSavingWinner] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    coordinators: '',
  });

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    const res = await axios.get('/api/admin/winners');
    if (res.data.success) {
      const current = res.data.events.find((e) => e._id === id);
      setAllEvents(current ? [current] : []);
    }
  };

  if(setAllEvents.length > 0) {
    console.log(allEvents[0]);
    // setUsers(allEvents[0]);
  }

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/admin/events/${id}`);
        setEvent(res.data.event);
        // setUsers(res.data.registeredUsers);
        setWinnerInput(res.data.event.winner || '');
        setFormData({
          title: res.data.event.title || '',
          date: res.data.event.date?.slice(0, 10) || '',
          time: res.data.event.time || '',
          venue: res.data.event.venue || '',
          coordinators: (res.data.event.coordinators || []).join(', '),
        });
      } catch (err) {
        console.error('❌ Error fetching event details:', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleWinnerSave = async () => {
    setIsSavingWinner(true);
    try {
      const res = await axios.put(`/api/admin/events/${id}`, { winner: winnerInput });
      setEvent(res.data.event);
    } catch (err) {
      console.error('❌ Error saving winner:', err);
    } finally {
      setIsSavingWinner(false);
    }
  };

  const handleEventUpdate = async () => {
    try {
      const updatePayload = {
        ...formData,
        coordinators: formData.coordinators.split(',').map((c) => c.trim()),
      };
      const res = await axios.put(`/api/admin/events/${id}`, updatePayload);
      setEvent(res.data.event);
      setEditMode(false);
    } catch (err) {
      console.error('❌ Error updating event:', err);
    }
  };

  const handleEventDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`/api/admin/events/${id}`);
      alert('Event deleted successfully');
      window.location.href = '/admin/events';
    } catch (err) {
      console.error('❌ Error deleting event:', err);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Registered Students for "${event?.title}"`, 14, 16);

    const studentData = users.map((u, i) => [i + 1, u.name, u.phone, u.email]);

    autoTable(doc, {
      startY: 20,
      head: [['#', 'Name', 'Phone', 'Email']],
      body: studentData,
    });

    doc.save(`${event?.title}_Registered_Students.pdf`);
  };

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading event details...</div>;
  if (error) return <div className="text-center mt-10 text-red-600 font-medium">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-3xl font-bold">{event?.title}</h1>

      {/* Event Info */}
      <section className="bg-white p-6 rounded-xl shadow space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">📅 Event Information</h2>
          <div className="flex gap-4">
            <button onClick={() => setEditMode(!editMode)} className="text-blue-600 hover:underline">
              {editMode ? 'Cancel' : 'Edit'}
            </button>
            <button onClick={handleEventDelete} className="text-red-600 hover:underline">
              Delete
            </button>
          </div>
        </div>

        {editMode ? (
          <>
            <input type="text" className="input" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Title" />
            <input type="date" className="input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            <input type="text" className="input" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="Time" />
            <input type="text" className="input" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} placeholder="Venue" />
            <input type="text" className="input" value={formData.coordinators} onChange={(e) => setFormData({ ...formData, coordinators: e.target.value })} placeholder="Coordinators (comma separated)" />
            <button onClick={handleEventUpdate} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save Changes
            </button>
          </>
        ) : (
          <>
            <p><strong>Date:</strong> {new Date(event.date).toDateString()}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Coordinators:</strong> {event.coordinators?.join(', ') || 'N/A'}</p>
            {allEvents.map((ev, idx) => (
              <p key={idx} className="text-md text-gray-600 font-bold">
                Students: {ev.enrolledCount} enrolled
              </p>
            ))}
          </>
        )}

        {/* Winner Input */}
        <div className="mt-4">
          <h3 className="font-semibold">🏆 Winner:</h3>
          <input
            type="text"
            value={winnerInput}
            onChange={(e) => setWinnerInput(e.target.value)}
            className="input mt-1"
            placeholder="Enter winner name"
          />
          <button
            onClick={handleWinnerSave}
            disabled={isSavingWinner}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {isSavingWinner ? 'Saving...' : 'Save Winner'}
          </button>
        </div>
      </section>

      {/* Registered Users */}
      <section className="bg-white p-6 rounded-xl shadow">
        {allEvents.map((event, idx) => {
        return (
        <p key={idx} className="text-sm text-gray-600">
          {/* student count */}
            <h2 className="text-xl font-semibold mb-4">👥 Registered Students {event.enrolledCount}</h2>

            {/* pdf download button */}
          <button onClick={downloadPDF} className="text-sm bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Download PDF
          </button>

            {/* student list */}
            {event.enrolledStudents.length === 0 ? (
                  <p className="text-sm italic text-gray-500 col-span-2">
                    No students enrolled for this event.
                  </p>
                ) : (event.enrolledStudents.map((user, idx) => (
                  <li key={idx} className="mb-2">
                    <span className="font-semibold">{user.name}</span> - {user.phone} - {user.email}
                  </li>
          )))}
        </p>
        );
        })}
      </section>
    </div>
  );
}
