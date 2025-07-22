'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AdminHomePage() {
  const [data, setData] = useState({ events: [], sponsors: [], highlights: [] });
  const [newEvent, setNewEvent] = useState({
    title: "", slug: "", description: "", date: "", time: "",
    venue: "", imageUrl: "", prizes: ""
  });
  const [newSponsor, setNewSponsor] = useState({ name: "", image: "" });
  const [newHighlight, setNewHighlight] = useState({ image: "" });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch("/api/homepage");
    const result = await res.json();
    setData(result);
  }

  async function addItem(category, newItem) {
    const hasEmpty = Object.values(newItem).some(val => !val || val.length === 0);
    if (hasEmpty) return alert("Please fill all required fields");

    await fetch("/api/homepage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, newItem }),
    });
    fetchData();
  }

  async function deleteItem(category, id) {
    await fetch("/api/homepage", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, id }),
    });
    fetchData();
  }

  const renderInput = (label, field, value, setter, type = "text") => (
    <input
      type={type}
      placeholder={label}
      value={value}
      onChange={(e) => setter(prev => ({ ...prev, [field]: e.target.value }))}
      className="border p-2 rounded text-sm"
    />
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12">
      <h1 className="text-3xl font-bold text-center text-blue-800">Admin Dashboard</h1>

      {/* EVENTS */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700">📅 Manage Events</h2>
        <ul className="space-y-4">
          {Array.isArray(data.events) && data.events.map(event => (
            <li key={event._id} className="border p-4 rounded shadow-sm bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{event.title} ({event.slug})</p>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <p className="text-sm text-gray-500">📍 {event.venue} | 📅 {event.date} | ⏰ {event.time}</p>
                </div>
                <button
                  onClick={() => {
  const confirmDelete = confirm("Deleting this event will also remove all student registrations. Are you sure?");
  if (confirmDelete) deleteItem("events", event._id);
}}
                  className="text-red-500 hover:underline font-semibold"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
          {renderInput("Title", "title", newEvent.title, setNewEvent)}
          {renderInput("Slug", "slug", newEvent.slug, setNewEvent)}
          {renderInput("Date", "date", newEvent.date, setNewEvent, "date")}
          {renderInput("Time", "time", newEvent.time, setNewEvent, "time")}
          {renderInput("Venue", "venue", newEvent.venue, setNewEvent)}
          {renderInput("Description", "description", newEvent.description, setNewEvent)}
          {renderInput("Image URL", "imageUrl", newEvent.imageUrl, setNewEvent)}
          {/* {renderInput("Coordinators", "coordinators", newEvent.coordinators, setNewEvent)} */}
          {/* {renderInput("Speakers", "speakers", newEvent.speakers, setNewEvent)} */}
          {/* {renderInput("Workshops", "workshops", newEvent.workshops, setNewEvent)} */}
          {/* {renderInput("Registered Students", "registeredStudents", newEvent.registeredStudents, setNewEvent)} */}
          {/* {renderInput("Winners", "winners", newEvent.winners, setNewEvent)} */}
          {renderInput("Prizes", "prizes", newEvent.prizes, setNewEvent)}
        </div>

        <button
          onClick={() => addItem("events", newEvent)}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          ➕ Add Event
        </button>
      </section>

      {/* SPONSORS */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700">🎖️ Manage Sponsors</h2>
        <ul className="space-y-4">
          {Array.isArray(data.sponsors) && data.sponsors.map(s => (
            <li key={s._id} className="border p-4 rounded shadow-sm bg-white flex justify-between items-center">
              <span className="font-medium">{s.name}</span>
              <button onClick={() => deleteItem("sponsors", s._id)} className="text-red-500 hover:underline font-semibold">
                Delete
              </button>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 items-center">
          {renderInput("Sponsor Name", "name", newSponsor.name, setNewSponsor)}
          {renderInput("Image URL", "image", newSponsor.image, setNewSponsor)}
          {newSponsor.image && (
            <Image
              src={newSponsor.image}
              alt="Preview"
              width={80}
              height={50}
              className="border rounded"
            />
          )}
        </div>

        <button
          onClick={() => addItem("sponsors", newSponsor)}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          ➕ Add Sponsor
        </button>
      </section>

      {/* HIGHLIGHTS */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700">🌟 Manage Highlights</h2>
        <ul className="space-y-4">
          {Array.isArray(data.highlights) && data.highlights.map(h => (
            <li key={h._id} className="border p-4 rounded shadow-sm bg-white flex justify-between items-center">
              <Image src={h.image} alt="Highlight" width={100} height={60} className="rounded" />
              <button onClick={() => deleteItem("highlights", h._id)} className="text-red-500 hover:underline font-semibold">
                Delete
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {renderInput("Image URL", "image", newHighlight.image, setNewHighlight)}
          {newHighlight.image && (
            <Image
              src={newHighlight.image}
              alt="Preview"
              width={100}
              height={60}
              className="border rounded"
            />
          )}
        </div>

        <button
          onClick={() => addItem("highlights", newHighlight)}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          ➕ Add Highlight
        </button>
      </section>
    </div>
  );
}
