"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock4, MapPin } from "lucide-react";
import FadeInSection from "../custom/FadeInSection";
import Link from "next/link";

export default function TimelineSection() {
  const [groupedEvents, setGroupedEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/homepage");
        const data = await res.json();

        const events = data.events || [];

        // Sort by date
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Group by date
        const groupedMap = events.reduce((acc, event) => {
          const dateKey = event.date;
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(event);
          return acc;
        }, {});

        const groupedArray = Object.entries(groupedMap).sort(
          ([a], [b]) => new Date(a) - new Date(b)
        );

        setGroupedEvents(groupedArray);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const formatIndianTime = (timeStr) => {
    try {
      const date = new Date(`1970-01-01T${timeStr}`);
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (err) {
      return timeStr; // fallback
    }
  };

  return (
    <FadeInSection>
      <section
        className="w-full py-16 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)]"
        id="timeline"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Event <span className="text-[color:var(--accent)]">Timeline</span>
          </h2>

          {groupedEvents.map(([date, events], index) => {
            const formattedDate = new Date(date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
              <div
                key={index}
                className="mb-10 border-l-4 border-[color:var(--accent)] pl-6"
              >
                <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[color:var(--secondary)]" />
                  {formattedDate}
                </h3>

                <ul className="space-y-4 mt-4">
                  {events.map((event, idx) => (
                    <li
                      key={idx}
                      className="bg-[color:var(--border)] bg-opacity-10 p-4 rounded-xl border border-[color:var(--border)] shadow-sm"
                    >
                      <Link
                        href={`/events/${event.slug}`}
                        className="hover:underline hover:cursor-pointer"
                      >
                      <h4 className="text-lg font-medium mb-1">
                        {event.title}
                      </h4>
                      <div className="text-sm flex flex-col sm:flex-row gap-2 text-[color:var(--secondary)]">
                        <span className="flex items-center gap-1">
                          <Clock4 className="w-4 h-4" />
                          {formatIndianTime(event.time)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.venue}
                        </span>
                      </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </FadeInSection>
  );
}
