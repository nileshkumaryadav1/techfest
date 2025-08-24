"use client";

import { useEffect, useState } from "react";

const monthNames = [
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedArchive, setSelectedArchive] = useState(null);

  // Fetch all archives
  useEffect(() => {
    const fetchArchives = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/fest-archive");
        if (!res.ok) throw new Error("Failed to fetch archives");
        const data = await res.json();
        setArchives(data);

        const uniqueYears = Array.from(new Set(data.map((a) => a.year))).sort(
          (a, b) => b - a
        );
        setYears(uniqueYears);

        const lastYear = uniqueYears[0];
        setSelectedYear(lastYear);

        const monthsOfYear = data
          .filter((a) => a.year === lastYear)
          .map((a) => a.month)
          .sort((a, b) => a - b);
        setMonths(monthsOfYear);

        const lastMonth = monthsOfYear[monthsOfYear.length - 1];
        setSelectedMonth(lastMonth);

        const defaultArchive = data.find(
          (a) => a.year === lastYear && a.month === lastMonth
        );
        setSelectedArchive(defaultArchive);
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

    const lastMonth = monthsOfYear[monthsOfYear.length - 1];
    setSelectedMonth(lastMonth);

    const archive = archives.find(
      (a) => a.year === year && a.month === lastMonth
    );
    setSelectedArchive(archive);
  };

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
    const archive = archives.find(
      (a) => a.year === selectedYear && a.month === month
    );
    setSelectedArchive(archive);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!selectedArchive)
    return <div className="text-center mt-10">No data available</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-center text-4xl font-bold mb-10">🎖 Hall of Fame</h1>

      {/* Year dropdown */}
      <div className="flex justify-center mb-6">
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Month buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {months.map((m) => (
          <button
            key={m}
            onClick={() => handleMonthClick(m)}
            className={`px-4 py-2 rounded-lg border transition-transform transform hover:scale-105 ${
              selectedMonth === m
                ? "bg-blue-500 text-white border-blue-600"
                : "bg-white text-gray-800 border-gray-300"
            }`}
          >
            {monthNames[m - 1]}
          </button>
        ))}
      </div>

      {/* Archive detail */}
      <div className="bg-white shadow-lg rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          {selectedArchive.name}
        </h2>
        <p className="mb-2">
          <strong>Month:</strong> {monthNames[selectedArchive.month - 1]} &nbsp;{" "}
          <strong>Year:</strong> {selectedArchive.year}
        </p>
        {selectedArchive.theme && (
          <p className="mb-2">
            <strong>Theme:</strong> {selectedArchive.theme}
          </p>
        )}
        {selectedArchive.tagline && (
          <p className="mb-2">
            <strong>Tagline:</strong> {selectedArchive.tagline}
          </p>
        )}
        {selectedArchive.description && (
          <p className="mb-2">{selectedArchive.description}</p>
        )}
        {selectedArchive.startDate && selectedArchive.endDate && (
          <p className="mb-2">
            <strong>Dates:</strong> {selectedArchive.startDate} –{" "}
            {selectedArchive.endDate}
          </p>
        )}
        {selectedArchive.venue && (
          <p className="mb-2">
            <strong>Venue:</strong> {selectedArchive.venue}
          </p>
        )}
        {selectedArchive.brochureUrl && (
          <p className="mb-2">
            <a
              href={selectedArchive.brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Brochure
            </a>
          </p>
        )}
      </div>

      {/* Events / Winners */}
      <h3 className="text-2xl font-semibold text-center mb-6">
        All Events & Winners
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {selectedArchive.events?.length ? (
          selectedArchive.events.map((event) => (
            <div
              key={event._id}
              className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <h4 className="text-blue-600 font-semibold mb-2">{event.name}</h4>
              {event.winners?.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {event.winners.map((winner, idx) => (
                    <li key={idx}>{winner}</li>
                  ))}
                </ul>
              ) : (
                <p>No winners listed</p>
              )}
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No events for this archive.
          </p>
        )}
      </div>
    </div>
  );
}
