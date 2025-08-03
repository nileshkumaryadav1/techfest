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
      <section>
        <h2 className="text-md md:text-2xl font-semibold md:mb-4 mb-1 text-center">
          📅 Manage Events ({data.events.length})
        </h2>

        <input
          type="text"
          placeholder="Search events..."
          onChange={(e) => setSearch(e.target.value)}
          className="md:mb-6 mx-auto p-2 border border-[color:var(--border)] rounded-lg w-full m-1"
        />

        <ul className="md:space-y-6 space-y-2">
          {data.events
            ?.filter((event) =>
              event.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((event) => (
              <li
                key={event._id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 md:p-6 p-3 transition hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start md:gap-6">
                  <div className="md:space-y-2 text-gray-700">
                    <h3 className="text-md md:text-xl font-semibold text-gray-800 text-center">
                      {event.title}
                      <span className="ml-2 text-xs text-gray-500">
                        ({event.slug})
                      </span>
                    </h3>

                    {event.description && (
                      <p className="text-sm text-gray-600">
                        {event.description.slice(0, 50) + "..."}
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
                          className="text-blue-600 hover:underline break-all"
                        >
                          {event.ruleBookPdfUrl.slice(0, 20) + "..."}
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
                          className="text-blue-600 hover:underline break-all"
                        >
                          {event.imageUrl.slice(0, 20) + "..."}
                        </a>
                      </p>
                    )}

                    {event.prizes && (
                      <p className="text-sm text-green-600 font-medium">
                        🏆 Prizes: {event.prizes}
                      </p>
                    )}
                  </div>

                  <div className="self-end sm:self-start">
                    <button
                      onClick={() => deleteItem("events", event._id)}
                      disabled={event.winners.length > 0}
                      className={`px-3 py-1 rounded-md border transition hover:cursor-pointer 
                   ${
                     event.winners.length > 0
                       ? "border-gray-400 text-gray-400 bg-gray-100 cursor-not-allowed"
                       : "border-red-500 text-red-600 hover:bg-red-50"
                   }
                    `}
                    >
                      {event.winners.length > 0
                        ? "🚫 Locked"
                        : "❌ Delete Event"}
                    </button>
                  </div>
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

        <button
          onClick={() => addItem("events", newEvent, clearNewEvent)}
          className="mt-4 bg-[color:var(--accent)] hover:bg-opacity-90 hover:cursor-pointer text-white px-5 py-2 rounded shadow"
        >
          ➕ Add Event
        </button>
      </section>

      {/* SPONSORS SECTION */}
      <section>
        <h2 className="md:text-2xl text-xl font-semibold mb-4 text-center">
          🎖️ Manage Sponsors
        </h2>

        <ul className="space-y-6">
          {data.sponsors?.map((s) => (
            <li
              key={s._id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 md:p-6 p-3 flex flex-col md:gap-4 transition hover:shadow-lg"
            >
              <div className="flex items-center md:gap-4">
                {s.image && (
                  <img
                    src={s.image}
                    alt={s.name}
                    width={50}
                    height={40}
                    className="rounded-lg border object-cover"
                  />
                )}
                <h3 className="md:text-lg font-semibold text-gray-800">
                  {s.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 md:gap-2 text-sm text-gray-600">
                {s.email && <p>📧 {s.email}</p>}
                {s.company && <p>🏢 {s.company}</p>}
                {s.phone && <p>📞 {s.phone}</p>}
              </div>

              {s.message && (
                <p className="text-sm text-gray-700 italic border-l-4 border-primary pl-3">
                  “{s.message}”
                </p>
              )}

              <div className="text-right">
                <button
                  onClick={() => deleteItem("sponsors", s._id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium underline underline-offset-2"
                >
                  Delete Sponsor
                </button>
              </div>
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
