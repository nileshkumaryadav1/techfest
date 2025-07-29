"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AdminHomePage() {
  const [data, setData] = useState({ events: [], sponsors: [] });

  const [newEvent, setNewEvent] = useState(() =>
    JSON.parse(localStorage.getItem("newEvent")) || {
      title: "", slug: "", eventId: "", category: "", description: "",
      ruleBookPdfUrl: "", date: "", time: "", venue: "", imageUrl: "", prizes: ""
    }
  );

  const [newSponsor, setNewSponsor] = useState(() =>
    JSON.parse(localStorage.getItem("newSponsor")) || { name: "", image: "" }
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("newEvent", JSON.stringify(newEvent));
  }, [newEvent]);

  useEffect(() => {
    localStorage.setItem("newSponsor", JSON.stringify(newSponsor));
  }, [newSponsor]);

  async function fetchData() {
    const res = await fetch("/api/homepage");
    const result = await res.json();
    setData(result);
  }

  async function addItem(category, newItem, clearFunc) {
    const hasEmpty = Object.values(newItem).some(val => !val || val.trim() === "");
    if (hasEmpty) return alert("Please fill all required fields");

    await fetch("/api/homepage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, newItem }),
    });

    fetchData();
    clearFunc(); // Reset form fields
  }

  async function deleteItem(category, id) {
    const confirmed = confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    await fetch("/api/homepage", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, id }),
    });

    fetchData();
  }

  const renderInput = (label, field, value, setter, type = "text", required = true) => (
    <div className="flex flex-col space-y-1">
      <label htmlFor={field} className="text-sm font-medium">{label}</label>
      <input
        id={field}
        type={type}
        value={value}
        onChange={(e) => setter(prev => ({ ...prev, [field]: e.target.value }))}
        required={required}
        className="border border-[color:var(--border)] px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
      />
    </div>
  );

  const clearNewEvent = () => {
    const empty = {
      title: "", slug: "", eventId: "", category: "", description: "",
      ruleBookPdfUrl: "", date: "", time: "", venue: "", imageUrl: "", prizes: ""
    };
    setNewEvent(empty);
    localStorage.setItem("newEvent", JSON.stringify(empty));
  };

  const clearNewSponsor = () => {
    const empty = { name: "", image: "" };
    setNewSponsor(empty);
    localStorage.setItem("newSponsor", JSON.stringify(empty));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12 text-[color:var(--foreground)] bg-[color:var(--background)]">
      <h1 className="text-3xl font-bold text-center text-[color:var(--accent)]">Admin Dashboard</h1>

      {/* EVENTS SECTION */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📅 Manage Events</h2>

        <ul className="space-y-4">
          {data.events?.map(event => (
            <li key={event._id} className="border p-4 rounded shadow">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-lg">{event.title} <span className="text-sm text-gray-500">({event.slug})</span></p>
                  <p className="text-sm mt-1">{event.description}</p>
                  <p className="text-sm mt-2">📍 {event.venue} | 📅 {event.date} | ⏰ {event.time}</p>
                  <p className="text-sm">📘 <a href={event.ruleBookPdfUrl} className="text-blue-600 hover:underline">{event.ruleBookPdfUrl}</a></p>
                  <p className="text-sm">🖼️ <a href={event.imageUrl} className="text-blue-600 hover:underline">{event.imageUrl}</a></p>
                  <p className="text-sm">🏆 Prizes: {event.prizes}</p>
                </div>
                <button
                  onClick={() => deleteItem("events", event._id)}
                  className="text-red-600 hover:underline font-semibold"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Event Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {renderInput("Title", "title", newEvent.title, setNewEvent)}
          {renderInput("Slug", "slug", newEvent.slug, setNewEvent)}
          {renderInput("Event ID", "eventId", newEvent.eventId, setNewEvent)}
          {renderInput("Category", "category", newEvent.category, setNewEvent)}
          {renderInput("Description", "description", newEvent.description, setNewEvent)}
          {renderInput("Date", "date", newEvent.date, setNewEvent, "date")}
          {renderInput("Time", "time", newEvent.time, setNewEvent, "time")}
          {renderInput("Venue", "venue", newEvent.venue, setNewEvent)}
          {renderInput("Rulebook URL", "ruleBookPdfUrl", newEvent.ruleBookPdfUrl, setNewEvent)}
          {renderInput("Image URL", "imageUrl", newEvent.imageUrl, setNewEvent)}
          {renderInput("Prizes", "prizes", newEvent.prizes, setNewEvent)}
        </div>

        <button
          onClick={() => addItem("events", newEvent, clearNewEvent)}
          className="mt-4 bg-[color:var(--accent)] hover:bg-opacity-90 hover:cursor-pointer text-white px-5 py-2 rounded shadow"
        >
          ➕ Add Event
        </button>
      </section>

      {/* SPONSORS SECTION */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">🎖️ Manage Sponsors</h2>

        <ul className="space-y-4">
          {data.sponsors?.map(s => (
            <li key={s._id} className="border p-4 rounded shadow flex flex-col justify-between items-center">
              <div className="flex items-center gap-3">
                {s.image && (
                  <img src={s.image} alt={s.name} width={50} height={40} className="rounded" />
                )}
                <span className="font-medium">{s.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{s.email}</span>
                <span className="text-sm text-gray-500">{s.company}</span>
                <span className="text-sm text-gray-500">{s.phone}</span>
              </div>
              <p className="text-sm">{s.message}</p>
              <button
                onClick={() => deleteItem("sponsors", s._id)}
                className="text-red-600 hover:underline font-semibold"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/* Sponsor Input Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {renderInput("Sponsor Name", "name", newSponsor.name, setNewSponsor)}
          {renderInput("Image URL", "image", newSponsor.image, setNewSponsor)}
          {renderInput("Email", "email", newSponsor.email, setNewSponsor)}
          {renderInput("Company", "company", newSponsor.company, setNewSponsor)}
          {renderInput("Phone", "phone", newSponsor.phone, setNewSponsor)}
          {renderInput("Message", "message", newSponsor.message, setNewSponsor)}
        </div>

        {newSponsor.image && (
          <img
            src={newSponsor.image}
            alt="Preview"
            width={100}
            height={60}
            className="mt-2 rounded border"
          />
        )}

        <button
          onClick={() => addItem("sponsors", newSponsor, clearNewSponsor)}
          className="mt-4 bg-[color:var(--accent)] hover:bg-opacity-90 hover:cursor-pointer text-white px-5 py-2 rounded shadow"
        >
          ➕ Add Sponsor
        </button>
      </section>
    </div>
  );
}
