"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function HallOfFamePage() {
  const [archives, setArchives] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Fetch all archives
  useEffect(() => {
    const fetchArchives = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/fest-archive");
        if (!res.ok) throw new Error("Failed to fetch archives");
        const data = await res.json();
        setArchives(data || []);

        const uniqueYears = Array.from(new Set(data.map((a) => a.year))).sort(
          (a, b) => b - a
        );
        setYears(uniqueYears);

        if (uniqueYears.length > 0) {
          const lastYear = uniqueYears[0];
          setSelectedYear(lastYear);

          const monthsOfYear = data
            .filter((a) => a.year === lastYear)
            .map((a) => a.month)
            .sort((a, b) => a - b);
          setMonths(monthsOfYear);

          if (monthsOfYear.length > 0) {
            const lastMonth = monthsOfYear[monthsOfYear.length - 1];
            setSelectedMonth(lastMonth);

            const defaultArchive = data.find(
              (a) => a.year === lastYear && a.month === lastMonth
            );
            setSelectedArchive(defaultArchive || null);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArchives();
  }, []);

  const handleYearChange = (e) => {
    const year = Number(e.target.value);
    setSelectedYear(year);

    const monthsOfYear = archives
      .filter((a) => a.year === year)
      .map((a) => a.month)
      .sort((a, b) => a - b);
    setMonths(monthsOfYear);

    if (monthsOfYear.length > 0) {
      const lastMonth = monthsOfYear[monthsOfYear.length - 1];
      setSelectedMonth(lastMonth);

      const archive = archives.find(
        (a) => a.year === year && a.month === lastMonth
      );
      setSelectedArchive(archive || null);
    }
  };

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
    const archive = archives.find(
      (a) => a.year === selectedYear && a.month === month
    );
    setSelectedArchive(archive || null);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!selectedArchive) return <div className="text-center mt-10">No data available</div>;

  const {
    name,
    month,
    year,
    theme,
    tagline,
    description,
    startDate,
    endDate,
    venue,
    brochureUrl,
    events = [],
    registeredStudents = [],
    enrolledStudents = [],
  } = selectedArchive;

  let filteredEvents = events.filter(
    (e) =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.winners?.some((w) => w.name?.toLowerCase().includes(search.toLowerCase()))
  );

  if (sortBy === "name") {
    filteredEvents.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  } else if (sortBy === "winners") {
    filteredEvents.sort((a, b) => (b.winners?.length || 0) - (a.winners?.length || 0));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Page Title */}
      <motion.h1
        className="text-center text-3xl sm:text-5xl font-extrabold mb-10 sm:mb-14 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🎖 Hall of Fame
      </motion.h1>

      {/* Year & Month controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        <select
          value={selectedYear || ""}
          onChange={handleYearChange}
          className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => handleMonthClick(m)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium shadow-sm transition-all text-sm sm:text-base ${
                selectedMonth === m
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {monthNames[m - 1]}
            </button>
          ))}
        </div>
      </div>

      {/* Archive detail */}
      <div className="bg-[var(--background)] shadow-md rounded-2xl p-6 sm:p-8 mb-10 border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--highlight)] mb-4">
          {name || "Unnamed Fest"}
        </h2>
        <div className="space-y-2 text-sm sm:text-base text-[var(--secondary)]">
          <p>
            <strong>Month:</strong> {monthNames[month - 1]} &nbsp; 
            <strong>Year:</strong> {year}
          </p>
          {theme && <p><strong>Theme:</strong> {theme}</p>}
          {tagline && <p><strong>Tagline:</strong> {tagline}</p>}
          {description && <p>{description}</p>}
          {startDate && endDate && (
            <p><strong>Dates:</strong> {startDate} – {endDate}</p>
          )}
          {venue && <p><strong>Venue:</strong> {venue}</p>}
          {brochureUrl && (
            <p>
              <a
                href={brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                📄 View Brochure
              </a>
            </p>
          )}
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-6">
          <StatCard title="Registered" value={registeredStudents.length} color="blue" />
          <StatCard title="Enrollments" value={enrolledStudents.length} color="green" />
          <StatCard title="Events" value={events.length} color="purple" />
        </div>
      </div>

      {/* Events Section */}
      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 text-[var(--foreground)]">
        All Events & Winners
      </h3>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search events or winners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
        >
          <option value="default">Sort: Default</option>
          <option value="name">Sort: Name</option>
          <option value="winners">Sort: Winners</option>
        </select>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, idx) => (
            <motion.div
              key={event._id || idx}
              className="bg-[color:var(--background)] border border-[color:var(--border)] p-5 sm:p-6 rounded-2xl shadow hover:shadow-lg transition-transform transform hover:scale-[1.02]"
              whileHover={{ y: -3 }}
            >
              <h4 className="text-lg sm:text-xl font-semibold text-blue-600 mb-2">
                {event.title || "Unnamed Event"}
              </h4>
              {event.description && (
                <p className="text-sm text-[color:var(--secondary)] mb-3">{event.description}</p>
              )}
              {event.winners?.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-[color:var(--highlight)] text-sm">
                  {event.winners.map((winner, idx) => (
                    <li key={winner._id || idx}>
                      {winner.name || winner.email || "Unnamed Winner"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic text-sm">No winners listed</p>
              )}
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No events found.
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: "from-blue-50 to-blue-100 text-blue-700",
    green: "from-green-50 to-green-100 text-green-700",
    purple: "from-purple-50 to-purple-100 text-purple-700",
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} p-4 sm:p-6 rounded-xl text-center shadow`}>
      <h4 className="text-xs sm:text-sm font-medium">{title}</h4>
      <p className="text-lg sm:text-2xl font-extrabold">{value}</p>
    </div>
  );
}
