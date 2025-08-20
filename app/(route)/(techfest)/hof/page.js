"use client";
import { FestData } from "@/data/FestData";
import React, { useEffect, useState, useMemo } from "react";

function HallOfFame() {
  const [winners, setWinners] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchWinners() {
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
          year: new Date(event.date).getFullYear(),
          winners: (event.winners || []).map((w, i) => ({
            name: w.name,
            team: w.team || null,
            rank: i + 1,
          })),
        }));

        setWinners(grouped);

        const uniqueYears = [...new Set(grouped.map((e) => e.year))].sort(
          (a, b) => b - a
        );
        setYears(uniqueYears);
        if (uniqueYears.length > 0) setSelectedYear(uniqueYears[0]);
      } catch (err) {
        console.error("Error fetching winners:", err);
        setError("⚠️ Failed to load winners. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchWinners();
  }, []);

  const filteredEvents = useMemo(() => {
    return winners
      .filter((e) => e.year === Number(selectedYear))
      .filter(
        (e) =>
          e.eventName.toLowerCase().includes(search.toLowerCase()) ||
          e.winners.some((w) =>
            w.name.toLowerCase().includes(search.toLowerCase())
          )
      );
  }, [winners, selectedYear, search]);

  return (
    <section className="relative py-16 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[color:var(--background)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-[color:var(--accent)] via-[color:var(--highlight)] to-[color:var(--accent)] bg-clip-text text-transparent drop-shadow-lg">
          🏆 Hall Of Fame
        </h1>
        <p className="text-[color:var(--secondary)] text-base sm:text-lg mb-10 sm:mb-12">
          Celebrating the champions of {FestData.name}.
        </p>

        {/* Event Count */}
        <div className="mb-10">
          <span className="inline-block px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-[color:var(--foreground)] text-sm sm:text-base font-medium tracking-wide">
            🎉 {filteredEvents.length} Events Recorded in {selectedYear}
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-[color:var(--accent)]/30 shadow-md text-[color:var(--foreground)] font-medium focus:outline-none"
          >
            {years.map((year) => (
              <option key={year} value={year} className="text-black">
                {year}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="🔍 Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-[color:var(--highlight)]/30 shadow-md text-[color:var(--foreground)] font-medium focus:outline-none"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-white/10 backdrop-blur-md animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-400 text-lg font-medium mt-6">{error}</p>
        )}

        {/* Winners Grid */}
        {!loading && !error && (
          <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3 text-left">
            {filteredEvents.length === 0 ? (
              <p className="col-span-full text-[color:var(--secondary)] text-lg">
                No results found for {search} in {selectedYear}.
              </p>
            ) : (
              filteredEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="group relative p-5 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-[color:var(--accent)]/40 hover:scale-[1.03] transition-all"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-[color:var(--foreground)] mb-4">
                    {event.eventName}
                  </h2>
                  <ul className="space-y-2">
                    {event.winners.map((w, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                      >
                        <span className="text-lg sm:text-xl">
                          {w.rank === 1 ? "🥇" : w.rank === 2 ? "🥈" : "🥉"}
                        </span>
                        <span className="text-[color:var(--foreground)] font-medium">
                          {w.name}
                        </span>
                        {w.team && (
                          <span className="text-xs sm:text-sm text-[color:var(--secondary)] ml-auto">
                            👥 {w.team}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}

        {/* Prize Highlights */}
        <div className="mt-20 sm:mt-28">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[color:var(--foreground)] mb-8">
            🎁 Prize Highlights
          </h2>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "🏆 Exclusive trophies & medals",
              "💰 Cash prizes & scholarships",
              "💼 Internship & placement offers",
              "🎒 Premium swag kits",
              "🌍 Recognition on our global stage",
              "🎁 Special sponsor goodies",
            ].map((prize, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-[color:var(--foreground)] shadow-md hover:shadow-[color:var(--highlight)]/40 transition"
              >
                {prize}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Actions */}
        <div className="mt-16 sm:mt-24 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a
            href="/register"
            className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--highlight)] text-white font-bold shadow-lg hover:scale-[1.05] hover:shadow-[color:var(--accent)]/50 transition-all text-center"
          >
            🚀 Register Now
          </a>
          <a
            href={`/events`}
            className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-[color:var(--foreground)] font-semibold hover:scale-[1.05] transition-all text-center"
          >
            🎯 Explore Events
          </a>
        </div>

        {/* Fallback */}
        {!loading && !error && years.length === 0 && (
          <p className="text-[color:var(--secondary)] mt-6">
            No winners data available yet. 🚀
          </p>
        )}
      </div>
    </section>
  );
}

export default HallOfFame;
