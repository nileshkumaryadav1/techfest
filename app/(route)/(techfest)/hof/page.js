"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Users, MapPin, Calendar, Star } from "lucide-react";

function HallOfFame() {
  const [events, setEvents] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/admin/winners");
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const { success, events } = await res.json();
        if (!success || !Array.isArray(events)) {
          throw new Error("Invalid data format");
        }

        const grouped = events.map((event) => ({
          eventName: event.title,
          category: event.category || "General",
          eventId: event.eventId || "TBD",
          venue: event.venue || "TBD",
          date: event.date ? new Date(event.date) : null,
          prizePool: event.prizes || 0,
          coordinators: event.coordinators || [],
          year: event.date ? new Date(event.date).getFullYear() : null,
          winners: (event.winners || []).map((w, i) => ({
            name: w.name,
            team: w.team || null,
            rank: i + 1,
          })),
        }));

        setEvents(grouped);

        const uniqueYears = [...new Set(grouped.map((e) => e.year))].sort(
          (a, b) => b - a
        );
        setYears(uniqueYears);
        if (uniqueYears.length > 0) setSelectedYear(uniqueYears[0]);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("⚠️ Failed to load winners. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events
      .filter((e) => e.year === Number(selectedYear))
      .filter((e) => (category === "all" ? true : e.category === category))
      .filter(
        (e) =>
          e.eventName.toLowerCase().includes(search.toLowerCase()) ||
          e.winners.some((w) =>
            w.name.toLowerCase().includes(search.toLowerCase())
          )
      )
      .sort((a, b) => {
        if (sortBy === "name") return a.eventName.localeCompare(b.eventName);
        if (sortBy === "prize") return b.prizePool - a.prizePool;
        if (sortBy === "date") return b.date - a.date;
        return 0;
      });
  }, [events, selectedYear, search, sortBy, category]);

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 tracking-tight">
          🏆 Hall Of Fame
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white shadow border border-gray-200 text-sm focus:ring-2 focus:ring-[color:var(--highlight)] transition"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white shadow border border-gray-200 text-sm focus:ring-2 focus:ring-[color:var(--highlight)] transition"
          >
            <option value="all">All Categories</option>
            {[...new Set(events.map((e) => e.category))].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white shadow border border-gray-200 text-sm focus:ring-2 focus:ring-[color:var(--highlight)] transition"
          >
            <option value="name">Sort by Name</option>
            <option value="prize">Sort by Prize</option>
            <option value="date">Sort by Date</option>
          </select>

          <input
            type="text"
            placeholder="🔍 Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white shadow border border-gray-200 text-sm placeholder-gray-400 focus:ring-2 focus:ring-[color:var(--highlight)] transition"
          />
        </div>

        {/* Count */}
        <p className="text-sm text-center text-gray-600 mb-6">
          Showing{" "}
          <span className="font-semibold text-[color:var(--highlight)]">
            {filteredEvents.length}
          </span>{" "}
          Event Winners
        </p>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white shadow-md hover:shadow-xl border border-gray-100 transition"
            >
              <h2 className="text-lg font-bold mb-1 text-gray-900">
                {event.eventName}
              </h2>
              <p className="text-xs text-gray-500 mb-2">
                {event.category} · {event.eventId}
              </p>
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <p className="flex items-center gap-2">
                  <Calendar size={14} /> {event.date?.toDateString() || "TBD"}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={14} /> {event.venue}
                </p>
                <p className="flex items-center gap-2">
                  <Star size={14} /> Prize Pool: ₹{event.prizePool}
                </p>
              </div>

              <ul className="space-y-1 mb-3 text-sm">
                {event.winners.map((w, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span>
                      {w.rank === 1 ? "🥇" : w.rank === 2 ? "🥈" : "🥉"}
                    </span>
                    <span className="font-medium">{w.name}</span>
                    {w.team && (
                      <span className="text-xs text-gray-500">({w.team})</span>
                    )}
                  </li>
                ))}
              </ul>

              {event.coordinators?.length > 0 && (
                <div>
                  <p className="font-medium text-xs mb-1 flex items-center gap-2 text-gray-700">
                    <Users size={14} /> Coordinators
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {event.coordinators.map((c, i) => (
                      <li key={i}>{c.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HallOfFame;
