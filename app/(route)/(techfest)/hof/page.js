"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import LoadingState from "@/components/custom/myself/LoadingState";
import LoadingSkeleton from "@/components/custom/myself/LoadingSkeleton";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function HallOfFamePage() {
  const [archives, setArchives] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedArchive, setSelectedArchive] = useState(null);

  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const fetchStudentDetails = async (studentIds) => {
    try {
      const res = await fetch(`/api/students?ids=${studentIds.join(",")}`);
      if (!res.ok) throw new Error("Failed to fetch student details");
      return await res.json(); // expect { students: [...] }
    } catch (err) {
      console.error("Student fetch error:", err);
      return { students: [] };
    }
  };

  // Initial fetch
  useEffect(() => {
    const fetchArchives = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/fest-archive");
        if (!res.ok) throw new Error("Failed to fetch archives");

        const data = await res.json();

        // ✅ Collect all unique winner IDs
        const winnerIds = [
          ...new Set(
            data.flatMap((archive) =>
              archive.events.flatMap(
                (event) => event.winners?.map((w) => w.studentId) || []
              )
            )
          ),
        ].filter(Boolean);

        // ✅ Fetch student details
        const { students } = await fetchStudentDetails(winnerIds);

        // ✅ Map studentId → student
        const studentMap = Object.fromEntries(students.map((s) => [s._id, s]));

        // ✅ Merge into archives
        const enrichedData = data.map((archive) => ({
          ...archive,
          events: archive.events.map((event) => ({
            ...event,
            winners: event.winners?.map((w) => ({
              ...w,
              college: studentMap[w.studentId]?.college || "Unknown College",
            })),
          })),
        }));

        setArchives(enrichedData);

        // same year/month logic
        const uniqueYears = [...new Set(enrichedData.map((a) => a.year))].sort(
          (a, b) => b - a
        );
        setYears(uniqueYears);
        if (!uniqueYears.length) return;

        const latestYear = uniqueYears[0];
        setSelectedYear(latestYear);

        const yearMonths = enrichedData
          .filter((a) => a.year === latestYear)
          .map((a) => a.month)
          .sort((a, b) => a - b);
        setMonths(yearMonths);

        if (!yearMonths.length) return;

        const latestMonth = yearMonths[yearMonths.length - 1];
        setSelectedMonth(latestMonth);

        const defaultArchive = enrichedData.find(
          (a) => a.year === latestYear && a.month === latestMonth
        );
        setSelectedArchive(defaultArchive || null);
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

    const yearMonths = archives
      .filter((a) => a.year === year)
      .map((a) => a.month)
      .sort((a, b) => a - b);
    setMonths(yearMonths);

    if (!yearMonths.length) return;

    const latestMonth = yearMonths[yearMonths.length - 1];
    setSelectedMonth(latestMonth);

    const archive = archives.find(
      (a) => a.year === year && a.month === latestMonth
    );
    setSelectedArchive(archive || null);
  };

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
    const archive = archives.find(
      (a) => a.year === selectedYear && a.month === month
    );
    setSelectedArchive(archive || null);
  };

  // States
  if (loading) return <LoadingState />;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!selectedArchive)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <LoadingSkeleton />
        <p className="m-10">No data available.</p>
      </div>
    );

  // Archive data
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

  // Filtering
  let filteredEvents = events.filter(
    (e) =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.winners?.some((w) =>
        w.name?.toLowerCase().includes(search.toLowerCase())
      )
  );

  if (sortBy === "name") {
    filteredEvents.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  } else if (sortBy === "winners") {
    filteredEvents.sort(
      (a, b) => (b.winners?.length || 0) - (a.winners?.length || 0)
    );
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
              {MONTHS[m - 1]}
            </button>
          ))}
        </div>
      </div>

      {/* Archive detail */}
      <div className="bg-[var(--background)] shadow-md rounded-2xl p-6 sm:p-8 mb-10 border border-[var(--border)]">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--accent)] mb-4 text-center">
          {name || "Unnamed Fest"}
        </h2>
        <div className="space-y-2 text-sm sm:text-base text-[var(--secondary)]">
          <p>
            <strong>Month:</strong> {MONTHS[month - 1]} &nbsp;
            <strong>Year:</strong> {year}
          </p>
          {theme && (
            <p>
              <strong>Theme:</strong> {theme}
            </p>
          )}
          {tagline && (
            <p>
              <strong>Tagline:</strong> {tagline}
            </p>
          )}
          {description && <p>{description}</p>}
          {startDate && endDate && (
            <p>
              <strong>Dates:</strong> {startDate} – {endDate}
            </p>
          )}
          {venue && (
            <p>
              <strong>Venue:</strong> {venue}
            </p>
          )}
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-6">
          <StatCard
            title="Registered"
            value={registeredStudents.length}
            color="blue"
          />
          <StatCard
            title="Enrollments"
            value={enrolledStudents.length}
            color="green"
          />
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
            className="w-full pl-10 pr-4 py-2 border border-[color:var(--border)] rounded-lg shadow-sm focus:ring-2 focus:ring-[color:var(--accent)] text-[color:var(--secondary)]"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-[color:var(--border)] rounded-lg shadow-sm focus:ring-2 focus:ring-[color:var(--accent)] w-full sm:w-auto text-[color:var(--secondary)]"
        >
          <option value="default">Sort: Default</option>
          <option value="name">Sort: Name</option>
          <option value="winners">Sort: Winners</option>
        </select>
      </div>

      {/* Event Count */}
      <p className="text-sm text-[color:var(--secondary)] mb-4 text-center">
        Showing {filteredEvents.length} events & their winners
      </p>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, idx) => (
            <motion.div
              key={event._id || idx}
              className="relative bg-[color:var(--background)] border border-[color:var(--border)] p-6 rounded-3xl shadow-md hover:shadow-xl transition-transform transform hover:scale-[1.03] flex flex-col justify-between"
              whileHover={{ y: -5 }}
            >
              {/* Serial Number Badge */}
              <div className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-[var(--background)] text-[color:var(--accent)]">
                #{idx + 1}
              </div>

              {/* image */}
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-40 object-cover rounded-2xl mb-4"
                />
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-gray-100 text-gray-400 rounded-2xl mb-4">
                  No Image
                </div>
              )}

              {/* Badge */}
              <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                {event.category || "General"}
              </span>

              {/* Event Title */}
              <div className="mb-4">
                <h4 className="text-lg sm:text-xl font-bold text-[color:var(--foreground)] mb-1">
                  {event.title || "Unnamed Event"}
                </h4>
                <p className="text-sm text-[color:var(--secondary)]">
                  Event ID: {event.eventId || "N/A"}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-[color:var(--secondary)] leading-relaxed mb-4 line-clamp-3">
                {event.description || (
                  <span className="italic text-gray-400">
                    No description available
                  </span>
                )}
              </p>

              {/* Winners */}
              <motion.div
                className="mb-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
              >
                <h5 className="text-base font-bold text-yellow-500 mb-2 flex items-center gap-2">
                  🏆 Winners
                </h5>

                {event.winners?.length > 0 ? (
                  <ol className="space-y-3">
                    {event.winners.map((winner, widx) => {
                      const student = selectedArchive.registeredStudents?.find(
                        (s) => s._id === winner._id
                      );

                      // Medal emoji for 1st, 2nd, 3rd
                      const medal =
                        widx === 0
                          ? "🥇"
                          : widx === 1
                          ? "🥈"
                          : widx === 2
                          ? "🥉"
                          : "🏅";

                      return (
                        <motion.li
                          key={winner._id || widx}
                          className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 rounded-xl px-3 py-2 shadow-sm"
                          whileHover={{ scale: 1.02 }}
                        >
                          <span className="text-lg">{medal}</span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-[color:var(--foreground)]">
                              {winner.name || "Unnamed Winner"}
                            </span>
                            <span className="text-xs text-gray-600">
                              {student?.college ||
                                winner.college ||
                                "Unknown College"}
                            </span>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ol>
                ) : (
                  <p className="text-gray-400 italic text-sm">
                    No winners listed
                  </p>
                )}
              </motion.div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-6">
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
    <div
      className={`bg-gradient-to-br ${colors[color]} p-4 sm:p-6 rounded-xl text-center shadow`}
    >
      <h4 className="text-xs sm:text-sm font-medium">{title}</h4>
      <p className="text-lg sm:text-2xl font-extrabold">{value}</p>
    </div>
  );
}
