"use client";

import { useEffect, useState } from "react";
import { FestData } from "@/data/FestData";
import { Search, Users } from "lucide-react";
import CoordinatorCard from "@/components/management/CoordinatorCard";

export default function Contact() {
  const [coordSearch, setCoordSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/homepage");
        const data = await res.json();

        if (res.ok && data.events) {
          setEvents(data.events);
        } else {
          console.error("Failed to fetch events:", data?.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="py-16 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        {/* <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--accent)] drop-shadow-lg">
            Contact the {FestData.name} Coordinators
          </h1>
        </div> */}

        {/* Event Coordinators Section */}
        <CardSection
          title="Event Coordinators"
          icon={<Users className="w-5 h-5" />}
        >
          <SearchBox
            value={coordSearch}
            setValue={setCoordSearch}
            placeholder="Search by event or name..."
          />
          {loading ? (
            <p className="text-sm text-[color:var(--secondary)]">
              Loading coordinators...
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {events
                .filter(
                  (event) =>
                    event.title
                      .toLowerCase()
                      .includes(coordSearch.toLowerCase()) ||
                    event.coordinators?.some((c) =>
                      c.name.toLowerCase().includes(coordSearch.toLowerCase())
                    )
                )
                .map((event) => (
                  <CoordinatorCard key={event.slug} event={event} />
                ))}
            </div>
          )}
        </CardSection>
      </div>
    </section>
  );
}

/* 🔹 Reusable Components */
function CardSection({ title, icon, children }) {
  return (
    <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2 text-[color:var(--accent)]">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

function SearchBox({ value, setValue, placeholder }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/20 rounded-lg backdrop-blur-md">
      <Search className="w-4 h-4 text-[color:var(--secondary)]" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none w-full text-sm text-[color:var(--foreground)]"
      />
    </div>
  );
}
