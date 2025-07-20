"use client";

import { useEffect, useRef } from "react";
import { FestData } from "@/data/FestData";
import { ArrowRight, ArrowLeft } from "lucide-react";

const highlightedEvents = [
  {
    title: "Hack Battle 2025",
    desc: "48-hour intense coding showdown for problem solvers.",
    image: "/events/hackathon.jpg",
  },
  {
    title: "Robo Rush",
    desc: "Showcase your bots in battle & racing challenges.",
    image: "/events/roborace.jpg",
  },
  {
    title: "Tech Quiz Mania",
    desc: "Fast-paced, brainy battles on tech & logic.",
    image: "/events/quiz.jpg",
  },
];

const categories = [
  { name: "Hackathon", icon: "🧠" },
  { name: "Robotics", icon: "🤖" },
  { name: "Design", icon: "🎨" },
  { name: "Coding", icon: "💻" },
  { name: "Gaming", icon: "🎮" },
  { name: "Cultural", icon: "🎭" },
];

export default function EventsSection() {
  const scrollRef = useRef();

  // Auto scroll
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
    <section
      className="w-full py-16 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)]"
      id="events"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Explore Our <span className="text-[color:var(--accent)]">Events</span>
        </h2>

        {/* Highlight Carousel */}
        <div className="overflow-hidden relative mb-16">
          <div
            className="flex gap-6 transition-all duration-500 ease-in-out overflow-x-auto no-scrollbar"
            ref={scrollRef}
          >
            {highlightedEvents.map((event, idx) => (
              <div
                key={idx}
                className="min-w-[300px] sm:min-w-[400px] bg-[color:var(--border)] bg-opacity-10 border border-[color:var(--border)] rounded-2xl shadow hover:shadow-lg transition"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="rounded-t-2xl w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="text-sm text-[color:var(--secondary)] mt-1">
                    {event.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 text-center">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="p-4 bg-[color:var(--border)] bg-opacity-10 rounded-xl shadow hover:shadow-md border border-[color:var(--border)]"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <p className="text-sm font-medium">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
