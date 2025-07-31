"use client";

import { useState, useEffect } from "react";
import EventCard from "@/components/fest/EventCard";

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "A-Z", value: "az" },
  { label: "Z-A", value: "za" },
];

export default function EventListPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/homepage");
        const data = await res.json();

        if (res.ok && data.events) {
          setEvents(data.events);
        } else {
          console.error("Failed to fetch events:", data?.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events
    .filter(({ title, category: eventCategory }) =>
      (category === "All" || eventCategory === category) &&
      title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "newest":
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

  const uniqueCategories = ["All", ...new Set(events.map((e) => e.category))];

  return (
    <main className="min-h-screen px-6 md:px-20 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Explore <span className="text-[color:var(--accent)]">Events
          <span className="text-[color:var(--highlight)] text-sm"> ({filteredEvents.length})</span>
        </span>
      </h1>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Filter Bar */}
       <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 rounded-xl border border-[color:var(--border)] bg-transparent text-[color:var(--foreground)]"
          />
        {/* sorting */}
        <div className="flex gap-5">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-xl border border-[color:var(--border)] bg-transparent text-[color:var(--foreground)]"
          >
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat} className="text-black">
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-xl border border-[color:var(--border)] bg-transparent text-[color:var(--foreground)]"
          >
            {sortOptions.map(({ label, value }) => (
              <option key={value} value={value} className="text-black">
                {label}
              </option>
            ))}
          </select>
        </div>
       </div>

        {/* Event Grid */}
        {loading ? (
          <p className="text-center text-[color:var(--foreground)]">Loading events...</p>
        ) : filteredEvents.length === 0 ? (
          <p className="text-center text-[color:var(--foreground)]">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
