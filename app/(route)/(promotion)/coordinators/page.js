"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";

export default function EventCoordinatorsPage() {
  const [search, setSearch] = useState("");

  const eventCoordinators = [
    { name: "Sanya Kapoor", event: "Hackathon" },
    { name: "Aditya Singh", event: "Robotics Challenge" },
    { name: "Neha Gupta", event: "Gaming Tournament" },
  ];

  const filteredCoordinators = eventCoordinators.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.event.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="w-full max-w-6xl mx-auto p-4">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <h2 className="text-xl font-semibold flex items-center gap-2 text-[color:var(--accent)]">
          <Users className="w-5 h-5" /> Event Coordinators
        </h2>

        {/* Search Box */}
        <SearchBox
          value={search}
          setValue={setSearch}
          placeholder="Search by coordinator or event..."
        />

        {/* Coordinators Grid */}
        {filteredCoordinators.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {filteredCoordinators.map((coord, idx) => (
              <MemberCard
                key={idx}
                name={coord.name}
                role={coord.event}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[color:var(--secondary)] mt-4">
            No coordinators found.
          </p>
        )}
      </div>
    </section>
  );
}

/* 🔹 Member Card Component */
function MemberCard({ name, role }) {
  return (
    <div className="rounded-xl p-4 bg-white/10 border border-white/20 shadow-md hover:scale-[1.02] transition transform duration-200">
      <h3 className="font-semibold text-[color:var(--foreground)]">{name}</h3>
      <p className="text-sm text-[color:var(--secondary)]">{role}</p>
    </div>
  );
}

/* 🔹 Search Box Component */
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
