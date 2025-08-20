"use client";
import React, { useEffect, useState } from "react";

function HallOfFame() {
  const [winners, setWinners] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        // 🔹 Transform into flat array with eventName + year
        const flattened = events.flatMap((event) =>
          (event.winners || []).map((winner) => ({
            eventName: event.title,
            year: new Date(event.date).getFullYear(),
            name: winner.name,
            team: winner.team || null,
          }))
        );

        setWinners(flattened);

        const uniqueYears = [...new Set(flattened.map((w) => w.year))].sort(
          (a, b) => b - a
        );
        setYears(uniqueYears);

        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[0]); // latest year
        }
      } catch (err) {
        console.error("Error fetching winners:", err);
        setError("Failed to load winners. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchWinners();
  }, []);

  return (
    <section className="py-12 px-4 sm:px-8 md:px-16 relative">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          🏆 Hall Of Fame
        </h1>

        {/* Loading */}
        {loading && <p className="text-white/70">Loading winners...</p>}

        {/* Error */}
        {error && <p className="text-red-400">{error}</p>}

        {/* Content */}
        {!loading && !error && years.length > 0 && (
          <>
            {/* Year Selector */}
            <div className="mb-8">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-[color:var(--foreground)] text-sm shadow-md"
              >
                {years.map((year) => (
                  <option key={year} value={year} className="text-black">
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Winners List */}
            <div className="grid gap-6 sm:grid-cols-2">
              {winners.filter((w) => w.year === Number(selectedYear)).length ===
              0 ? (
                <p className="col-span-full text-white/70">
                  No winners recorded for {selectedYear}.
                </p>
              ) : (
                winners
                  .filter((w) => w.year === Number(selectedYear))
                  .map((winner, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg hover:scale-[1.02] transition-all"
                    >
                      <h2 className="text-xl font-semibold text-[color:var(--foreground)] mb-2">
                        {winner.eventName || "Unnamed Event"}
                      </h2>
                      <p className="text-[color:var(--secondary)] text-sm">
                        Winner: {winner.name || "Unknown"}
                      </p>
                      {winner.team && (
                        <p className="text-[color:var(--foreground)] text-xs mt-1">
                          Team: {winner.team}
                        </p>
                      )}
                    </div>
                  ))
              )}
            </div>
          </>
        )}

        {/* Fallback */}
        {!loading && !error && years.length === 0 && (
          <p className="text-white/70">No winners data available yet.</p>
        )}
      </div>
    </section>
  );
}

export default HallOfFame;
