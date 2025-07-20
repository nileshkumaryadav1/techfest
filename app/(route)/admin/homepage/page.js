"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AdminHomePage() {
  const [data, setData] = useState({ events: [], sponsors: [], highlights: [] });
  const [newEvent, setNewEvent] = useState({ title: "", slug: "", description: "", date: "", time: "", venue: "", imageUrl: "" });
  const [newSponsor, setNewSponsor] = useState({ name: "", image: "" });
  const [newHighlight, setNewHighlight] = useState({ image: "" });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const res = await fetch("/api/homepage");
    const result = await res.json();
    setData(result);
  }

  async function addItem(category, newItem) {
    if (!Object.values(newItem).every(Boolean)) {
      alert("Please fill all fields!");
      return;
    }

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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard - Homepage Manager</h1>

      {/* EVENTS */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">📅 Manage Events</h2>
        <ul className="space-y-3">
          {data.events.map(event => (
            <li key={event._id} className="border p-4 rounded shadow-sm flex justify-between items-center">
              <div>
                <p className="font-medium">{event.title} ({event.slug})</p>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500">{event.date}</p>
                <p className="text-sm text-gray-500">{event.time}</p>
                <p className="text-sm text-gray-500">{event.venue}</p>
                <p className="text-sm text-gray-500">{event.imageUrl}</p>
              </div>
              <button onClick={() => deleteItem("events", event._id)} className="text-red-500 font-semibold hover:underline">
                Delete
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <input type="text" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="border p-2 rounded" />
          <input type="text" placeholder="Slug" value={newEvent.slug} onChange={(e) => setNewEvent({ ...newEvent, slug: e.target.value })} className="border p-2 rounded" />
          <input type="time" placeholder="Time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} className="border p-2 rounded" />
          <input type="text" placeholder="Venue" value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} className="border p-2 rounded" />
          <input type="text" placeholder="Image URL" value={newEvent.imageUrl} onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })} className="border p-2 rounded" />
          <input type="text" placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} className="border p-2 rounded" />
          <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="border p-2 rounded" />
        </div>
        <button onClick={() => addItem("events", newEvent)} className="mt-3 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
          ➕ Add Event
        </button>
      </section>

      {/* SPONSORS */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">🎖️ Manage Sponsors</h2>
        <ul className="space-y-3">
          {data.sponsors.map(sponsor => (
            <li key={sponsor._id} className="border p-4 rounded shadow-sm flex justify-between items-center">
              <span>{sponsor.name}</span>
              <button onClick={() => deleteItem("sponsors", sponsor._id)} className="text-red-500 font-semibold hover:underline">
                Delete
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <input type="text" placeholder="Sponsor Name" value={newSponsor.name} onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })} className="border p-2 rounded" />
          <input type="text" placeholder="Image URL" value={newSponsor.image} onChange={(e) => setNewSponsor({ ...newSponsor, image: e.target.value })} className="border p-2 rounded" />
          {newSponsor.image && <Image src={newSponsor.image} alt="Preview" width={80} height={50} className="rounded border" />}
        </div>
        <button onClick={() => addItem("sponsors", newSponsor)} className="mt-3 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
          ➕ Add Sponsor
        </button>
      </section>

      {/* HIGHLIGHTS */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">🌟 Manage Highlights</h2>
        <ul className="space-y-3">
          {data.highlights.map(highlight => (
            <li key={highlight._id} className="border p-4 rounded shadow-sm flex justify-between items-center">
              <Image src={highlight.image} alt="Highlight" width={100} height={60} className="rounded" />
              <button onClick={() => deleteItem("highlights", highlight._id)} className="text-red-500 font-semibold hover:underline">
                Delete
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input type="text" placeholder="Highlight Image URL" value={newHighlight.image} onChange={(e) => setNewHighlight({ ...newHighlight, image: e.target.value })} className="border p-2 rounded" />
          {newHighlight.image && <Image src={newHighlight.image} alt="Preview" width={80} height={50} className="rounded border" />}
        </div>
        <button onClick={() => addItem("highlights", newHighlight)} className="mt-3 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
          ➕ Add Highlight
        </button>
      </section>
    </div>
  );
}
