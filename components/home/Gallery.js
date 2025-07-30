"use client";

import { useEffect, useRef, useState } from "react";
import { FestData } from "@/data/FestData";
import Link from "next/link";
import FadeInSection from "../dashboard/custom/FadeInSection";

export default function EventsSection() {
  const scrollRef = useRef(null);
  const [highlightedEvents, setHighlightedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    { name: "Hackathon", icon: "🧠" },
    { name: "Robotics", icon: "🤖" },
    { name: "Design", icon: "🎨" },
    { name: "Coding", icon: "💻" },
    { name: "Gaming", icon: "🎮" },
    { name: "Cultural", icon: "🎭" },
  ];

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/homepage");
        const data = await res.json();
        // console.log(data.events);
        setHighlightedEvents(data.events.slice(0, 6)); // limit to 6
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Unable to load events.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Auto scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 300;
        if (
          scrollRef.current.scrollLeft >=
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth
        ) {
          scrollRef.current.scrollLeft = 0;
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <FadeInSection>
    <section
      id="events"
      className="w-full py-16 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Explore Our <Link href="/events" className="text-[color:var(--accent)] hover:underline hover:cursor-pointer">Events</Link>
        </h2>

        {/* Highlighted Events Carousel */}
        <div className="overflow-hidden relative mb-16">
          {loading ? (
            <p className="text-center text-sm text-[color:var(--secondary)]">Loading events...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div
              className="flex gap-6 transition-all duration-500 ease-in-out overflow-x-auto no-scrollbar scroll-smooth"
              ref={scrollRef}
            >
              {highlightedEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="min-w-[300px] sm:min-w-[400px] bg-[color:var(--border)] bg-opacity-10 border border-[color:var(--border)] rounded-2xl shadow hover:shadow-lg transition"
                >
                  <Link href={`/events/${event.slug}`} className="block h-full">
                  <img
                    src={event.imageUrl || "/logo.png"}
                    alt={event.title}
                    className="rounded-t-2xl w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <p className="text-sm text-[color:var(--secondary)] mt-1">📅 {event.date} | ⏲️ {event.time}</p>
                    <p className="text-sm text-[color:var(--secondary)] mt-1">
                      {event.description.slice(0, 100) || "No description available."}
                    </p>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 text-center">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="p-4 bg-[color:var(--border)] bg-opacity-10 rounded-xl shadow hover:shadow-md border border-[color:var(--border)]"
            >
              <Link href={`/events?category=${cat.name}`} className="block h-full">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <p className="text-sm font-medium">{cat.name}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
    </FadeInSection>
  );
}
