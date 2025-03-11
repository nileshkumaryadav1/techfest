"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AdminHomePage() {
  const [data, setData] = useState({ events: [], sponsors: [], highlights: [] });
  const [newEvent, setNewEvent] = useState({ title: "", date: "" });
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin - Manage Homepage</h1>

      {/* Events Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Manage Events</h2>
        <ul>
          {data.events.map(event => (
            <li key={event._id} className="flex justify-between border p-2">
              {event.title} - {event.date}
              <button onClick={() => deleteItem("events", event._id)} className="text-red-500">
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <input type="text" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="border p-1 mr-2" />
          <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="border p-1 mr-2" />
          <button onClick={() => addItem("events", newEvent)} className="bg-blue-500 text-white px-3 py-1">Add</button>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Manage Sponsors</h2>
        <ul>
          {data.sponsors.map(sponsor => (
            <li key={sponsor._id} className="flex justify-between border p-2">
              {sponsor.name}
              <button onClick={() => deleteItem("sponsors", sponsor._id)} className="text-red-500">
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <input type="text" placeholder="Sponsor Name" value={newSponsor.name} onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })} className="border p-1 mr-2" />
          <input type="text" placeholder="Image URL" value={newSponsor.image} onChange={(e) => setNewSponsor({ ...newSponsor, image: e.target.value })} className="border p-1 mr-2" />
          <button onClick={() => addItem("sponsors", newSponsor)} className="bg-blue-500 text-white px-3 py-1">Add</button>
        </div>
      </section>

      {/* Highlights Section */}
      <section>
        <h2 className="text-xl font-semibold">Manage Highlights</h2>
        <ul>
          {data.highlights.map(highlight => (
            <li key={highlight._id} className="flex justify-between border p-2">
              <Image src={highlight.image} alt="Highlight" width={100} height={100} className="h-10 w-16" />
              <button onClick={() => deleteItem("highlights", highlight._id)} className="text-red-500">
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <input type="text" placeholder="Image URL" value={newHighlight.image} onChange={(e) => setNewHighlight({ ...newHighlight, image: e.target.value })} className="border p-1 mr-2" />
          <button onClick={() => addItem("highlights", newHighlight)} className="bg-blue-500 text-white px-3 py-1">Add</button>
        </div>
      </section>
    </div>
  );
}
