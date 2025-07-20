"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock4, MapPin } from "lucide-react";

export default function TimelineSection() {
  const [groupedEvents, setGroupedEvents] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/event");
        const data = await res.json();

        const sorted = data.sort((a, b) => new Date(a.time) - new Date(b.time));

        const grouped = sorted.reduce((acc, event) => {
          const eventDate = new Date(event.time);
          const dayKey = eventDate.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          if (!acc[dayKey]) acc[dayKey] = [];
          acc[dayKey].push(event);
          return acc;
        }, {});

        setGroupedEvents(grouped);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section
      className="w-full py-16 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)]"
      id="timeline"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Event <span className="text-[color:var(--accent)]">Timeline</span>
        </h2>

        {Object.entries(groupedEvents).map(([day, events], index) => (
          <div
            key={index}
            className="mb-10 border-l-4 border-[color:var(--accent)] pl-6"
          >
            <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[color:var(--secondary)]" />
              {day}
            </h3>

            <ul className="space-y-4 mt-4">
              {events.map((event, idx) => {
                const time = new Date(event.time).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                return (
                  <li
                    key={idx}
                    className="bg-[color:var(--border)] bg-opacity-10 p-4 rounded-xl border border-[color:var(--border)] shadow-sm"
                  >
                    <h4 className="text-lg font-medium mb-1">{event.name}</h4>
                    <div className="text-sm flex flex-col sm:flex-row gap-2 text-[color:var(--secondary)]">
                      <span className="flex items-center gap-1">
                        <Clock4 className="w-4 h-4" />
                        {time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.venue}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
