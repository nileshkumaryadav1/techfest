"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AdminHomePage() {
  const [data, setData] = useState({ events: [], sponsors: [] });
  const [events, setEvents] = useState(data.events);
  const [sponsors, setSponsors] = useState(data.sponsors);
  const [search, setSearch] = useState("");

  const [newEvent, setNewEvent] = useState(
    () =>
      JSON.parse(localStorage.getItem("newEvent")) || {
        title: "",
        slug: "",
        eventId: "",
        category: "",
        description: "",
        ruleBookPdfUrl: "",
        date: "",
        time: "",
        venue: "",
        imageUrl: "",
        prizes: "",
      }
  );

  const [newSponsor, setNewSponsor] = useState(
    () =>
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
    const hasEmpty = Object.values(newItem).some(
      (val) => !val || val.trim() === ""
    );
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

  const renderInput = (
    label,
    field,
    value,
    setter,
    type = "text",
    required = true
  ) => (
    <div className="flex flex-col space-y-1">
      <label htmlFor={field} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={field}
        type={type}
        value={value}
        onChange={(e) =>
          setter((prev) => ({ ...prev, [field]: e.target.value }))
        }
        required={required}
        className="border border-[color:var(--border)] px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
      />
    </div>
  );

  const clearNewEvent = () => {
    const empty = {
      title: "",
      slug: "",
      eventId: "",
      category: "",
      description: "",
      ruleBookPdfUrl: "",
      date: "",
      time: "",
      venue: "",
      imageUrl: "",
      prizes: "",
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
    <div className="md:p-6 md:max-w-6xl md:mx-auto md:space-y-12 space-y-4 text-[color:var(--foreground)] bg-[color:var(--background)]">
      <h1 className="text-xl md:text-3xl font-bold text-center text-[color:var(--accent)] mb-1">
        Add New Events & Sponsors
      </h1>

      {/* EVENTS SECTION */}
      <section className="md:mt-4">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2 text-[color:var(--foreground)]">
          📅 Manage Events
          <span className="text-sm font-normal text-[color:var(--secondary)]">
            ({data.events.length})
          </span>
        </h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="🔍 Search events..."
          onChange={(e) => setSearch(e.target.value)}
          className="mb-8 block mx-auto w-full max-w-lg px-4 py-2.5 rounded-xl text-sm border border-[color:var(--border)] bg-[color:var(--card)]/60 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-[color:var(--accent)] focus:outline-none transition"
        />

        {/* Events List */}
        <ul className="space-y-5 md:space-y-6">
          {data.events
            ?.filter((event) =>
              event.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((event) => (
              <li
                key={event._id}
                className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-[0_6px_20px_rgba(0,0,0,0.08)] p-5 md:p-6 transition hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)]"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-5">
                  {/* Event Details */}
                  <div className="space-y-2 text-[color:var(--foreground)] w-full">
                    <h3 className="text-lg md:text-xl font-semibold flex flex-wrap justify-center sm:justify-start items-center gap-2">
                      {event.title}
                      <span className="text-xs font-medium text-[color:var(--secondary)]">
                        ({event.slug})
                      </span>
                    </h3>

                    {event.description && (
                      <p className="text-sm text-[color:var(--secondary)] line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    <p className="text-sm">
                      📍 <span className="font-medium">{event.venue}</span> | 📅{" "}
                      <span>{event.date}</span> | ⏰ <span>{event.time}</span>
                    </p>

                    {event.ruleBookPdfUrl && (
                      <p className="text-sm">
                        📘 Rulebook:{" "}
                        <a
                          href={event.ruleBookPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[color:var(--accent)] hover:underline break-all"
                        >
                          {event.ruleBookPdfUrl.slice(0, 40) + "..."}
                        </a>
                      </p>
                    )}

                    {event.imageUrl && (
                      <p className="text-sm">
                        🖼️ Image:{" "}
                        <a
                          href={event.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[color:var(--accent)] hover:underline break-all"
                        >
                          {event.imageUrl.slice(0, 40) + "..."}
                        </a>
                      </p>
                    )}

                    {event.prizes && (
                      <p className="text-sm text-green-600 font-medium">
                        🏆 Prizes: {event.prizes}
                      </p>
                    )}
                  </div>

                  {/* Delete Button */}
                  <div className="sm:self-start self-end">
                    <button
                      onClick={() => deleteItem("events", event._id)}
                      disabled={event.winners.length > 0}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition shadow-sm 
                  ${
                    event.winners.length > 0
                      ? "bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed"
                      : "border border-red-500 text-red-600 hover:bg-red-50"
                  }
                `}
                    >
                      {event.winners.length > 0 ? "🚫 Locked" : "❌ Delete"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
        </ul>

        {/* Event Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {renderInput("Title", "title", newEvent.title, setNewEvent)}
          {renderInput("Slug", "slug", newEvent.slug, setNewEvent)}
          {renderInput("Event ID", "eventId", newEvent.eventId, setNewEvent)}
          {renderInput("Category", "category", newEvent.category, setNewEvent)}
          {renderInput(
            "Description",
            "description",
            newEvent.description,
            setNewEvent
          )}
          {renderInput("Date", "date", newEvent.date, setNewEvent, "date")}
          {renderInput("Time", "time", newEvent.time, setNewEvent, "time")}
          {renderInput("Venue", "venue", newEvent.venue, setNewEvent)}
          {renderInput(
            "Rulebook URL",
            "ruleBookPdfUrl",
            newEvent.ruleBookPdfUrl,
            setNewEvent
          )}
          {renderInput("Image URL", "imageUrl", newEvent.imageUrl, setNewEvent)}
          {renderInput("Prizes", "prizes", newEvent.prizes, setNewEvent)}
        </div>

        {/* Add Event Button */}
        <div className="flex justify-center">
          <button
            onClick={() => addItem("events", newEvent, clearNewEvent)}
            className="mt-8 bg-[color:var(--accent)] hover:bg-opacity-90 text-white font-medium px-6 py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            ➕ Add Event
          </button>
        </div>
      </section>

      {/* SPONSORS SECTION */}
      <section className="mt-12">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-[color:var(--foreground)]">
          🎖️ Manage Sponsors
        </h2>

        {/* Sponsors List */}
        <ul className="space-y-5 md:space-y-6">
          {data.sponsors?.map((s) => (
            <li
              key={s._id}
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-[0_6px_20px_rgba(0,0,0,0.08)] p-5 md:p-6 flex flex-col gap-4 transition hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)]"
            >
              {/* Sponsor Header */}
              <div className="flex items-center gap-4">
                {s.image && (
                  <img
                    src={s.image}
                    alt={s.name}
                    width={60}
                    height={50}
                    className="rounded-lg border border-[color:var(--border)] object-cover shadow-sm"
                  />
                )}
                <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
                  🏢 {s.company}
                </h3>
              </div>

              {/* Sponsor Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-[color:var(--secondary)]">
                {s.email && <p>📧 {s.email}</p>}
                {s.company && <p>👤 {s.name}</p>}
                {s.phone && <p>📞 {s.phone}</p>}
              </div>

              {/* Sponsor Message */}
              {s.message && (
                <p className="text-sm italic text-[color:var(--foreground)]/90 border-l-4 border-[color:var(--accent)] pl-3">
                  “{s.message}”
                </p>
              )}

              {/* Delete Button */}
              <div className="text-right">
                <button
                  onClick={() => deleteItem("sponsors", s._id)}
                  className="text-red-500 hover:text-red-600 text-sm font-medium underline underline-offset-2 transition"
                >
                  ❌ Delete Sponsor
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Sponsor Input Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
          {renderInput("Sponsor Name", "name", newSponsor.name, setNewSponsor)}
          {renderInput("Image URL", "image", newSponsor.image, setNewSponsor)}
          {renderInput("Email", "email", newSponsor.email, setNewSponsor)}
          {renderInput("Company", "company", newSponsor.company, setNewSponsor)}
          {renderInput("Phone", "phone", newSponsor.phone, setNewSponsor)}
          {renderInput("Message", "message", newSponsor.message, setNewSponsor)}
        </div>

        {/* Sponsor Image Preview */}
        {newSponsor.image && (
          <div className="flex justify-center mt-4">
            <img
              src={newSponsor.image}
              alt="Preview"
              width={120}
              height={70}
              className="rounded-lg border border-[color:var(--border)] shadow-sm"
            />
          </div>
        )}

        {/* Add Sponsor Button */}
        <div className="flex justify-center">
          <button
            onClick={() => addItem("sponsors", newSponsor, clearNewSponsor)}
            className="mt-6 bg-[color:var(--accent)] hover:bg-opacity-90 text-white font-medium px-6 py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            ➕ Add Sponsor
          </button>
        </div>
      </section>
    </div>
  );
}
