'use client';

import React, { useState, useEffect } from "react";
import EventCard from "@/components/fest/EventCard";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
//   const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("upcoming"); // upcoming | past
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Failed to fetch events:", err));
  }, []);

  const parseDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d) ? null : d;
  };

  const today = new Date();

  const filteredEvents = events
    // .filter(ev => {
    //   const evDate = parseDate(ev.date);

    //   // Year filter
    //   if (yearFilter && evDate?.getFullYear() !== parseInt(yearFilter)) return false;

    //   // Month filter
    //   if (monthFilter && evDate?.getMonth() + 1 !== parseInt(monthFilter)) return false;

    //   // Category filter
    //   if (categoryFilter && ev.templateId?.category !== categoryFilter) return false;

    //   // Status filter
    //   if (statusFilter === "upcoming" && evDate && evDate < today) return false;
    //   if (statusFilter === "past" && evDate && evDate >= today) return false;

    //   return true;
    // })
    // .sort((a, b) => {
    //   const dateA = parseDate(a.date) || today;
    //   const dateB = parseDate(b.date) || today;
    //   return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    // });

//   const years = Array.from(new Set(events.map(ev => parseDate(ev.date)?.getFullYear()))).filter(Boolean).sort((a, b) => b - a);
//   const categories = Array.from(new Set(events.map(ev => ev.templateId?.category))).filter(Boolean);

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <section className="flex flex-col gap-6 items-center w-full py-8">
      <h1 className="text-3xl font-bold text-center text-primary mb-4">🎉 Events</h1>
      <p className="text-muted-foreground text-center mb-6">
        Showing <span className="font-semibold">{filteredEvents.length}</span> events
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center justify-center flex-wrap">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border">
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="">All</option>
        </select>

        {/* <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border">
          <option value="">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select> */}

        <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border">
          <option value="">All Months</option>
          {monthNames.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
        </select>

        {/* <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select> */}

        <button
          onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          {sortOrder === "newest" ? "Sort: Newest First" : "Sort: Oldest First"}
        </button>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {filteredEvents.map((ev, i) => <EventCard key={ev._id || i} event={ev} />)}
        </div>
      ) : (
        <p className="text-muted-foreground text-center mt-10">No events found.</p>
      )}
    </section>
  );
}
