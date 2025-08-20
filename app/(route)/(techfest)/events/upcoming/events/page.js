"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import EventCard from "@/components/fest/EventCard";

export default function UpcomingEvents() {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [sortOrder, setSortOrder] = useState("oldest"); // default: soonest first

  // Fetch events
  useEffect(() => {
    fetch("/api/homepage")
      .then((res) => res.json())
      .then((data) => setEvents(data.events)) // ✅ only events
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // Helper: normalize to local "date only"
  const parseDate = (dateStr) => {
    if (!dateStr) return null;

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split("-");
      return new Date(Number(year), Number(month) - 1, Number(day)); // local date only
    }

    return new Date(dateStr); // fallback
  };

  // Calculate upcoming events
  useEffect(() => {
    if (events.length) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const filtered = events.filter((ev) => {
        const eventDate = parseDate(ev.date);
        return eventDate && eventDate >= today;
      });

      setUpcomingEvents(filtered);
    }
  }, [events]);

  // Search + Sort filter
  const filteredEvents = upcomingEvents
    .filter((ev) =>
      (ev.name || ev.eventId || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);

      if (sortOrder === "newest") return dateB - dateA;
      return dateA - dateB;
    });

  return (
    <section className="flex flex-col gap-6 items-center w-full py-8">
      {/* Search & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl gap-4">
        {/* Search Box */}
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search upcoming events..."
            className="w-full px-4 py-3 pl-10 rounded-2xl bg-primary-foreground text-foreground border border-border shadow-md focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <FaSearch className="absolute left-3 top-3.5 text-muted-foreground" />
        </div>

        {/* Sort Button */}
        <button
          onClick={() =>
            setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground shadow hover:shadow-lg transition"
        >
          {sortOrder === "newest" ? (
            <>
              <FaSortAmountDown /> Newest First
            </>
          ) : (
            <>
              <FaSortAmountUp /> Oldest First
            </>
          )}
        </button>
      </div>

      {/* Title + Count */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">
          🚀 Upcoming Events
        </h1>
        <p className="text-muted-foreground">
          Showing <span className="font-semibold">{filteredEvents.length}</span>{" "}
          events
        </p>
      </div>

      {/* Event Grid */}
      <div className="w-full max-w-5xl">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, i) => (
              <motion.div
                key={event.slug || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center mt-10">
            No upcoming events found.
          </p>
        )}
      </div>
    </section>
  );
}
