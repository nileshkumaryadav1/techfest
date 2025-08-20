"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";

export default function CampusAmbassadors() {
  const [ambSearch, setAmbSearch] = useState("");

  const campusAmbassadors = [
    { name: "Aarav Sharma", college: "IIT Delhi" },
    { name: "Priya Patel", college: "NIT Trichy" },
    { name: "Rahul Verma", college: "VIT Vellore" },
  ];

  const filteredAmbassadors = campusAmbassadors.filter((amb) =>
    amb.name.toLowerCase().includes(ambSearch.toLowerCase())
  );

  return (
    <section className="w-full max-w-6xl mx-auto p-4">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <h2 className="text-xl font-semibold flex items-center gap-2 text-[color:var(--accent)]">
          <Users className="w-5 h-5" /> Campus Ambassadors
        </h2>

        {/* Search */}
        <SearchBox
          value={ambSearch}
          setValue={setAmbSearch}
          placeholder="Search Ambassador..."
        />

        {/* Ambassador Grid */}
        {filteredAmbassadors.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredAmbassadors.map((amb, index) => (
              <MemberCard
                key={index}
                name={amb.name}
                role="Campus Ambassador"
                contact={amb.college}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[color:var(--secondary)] mt-4">
            No ambassadors found.
          </p>
        )}
      </div>
    </section>
  );
}

/* 🔹 Reusable Components */
function MemberCard({ name, role, contact }) {
  return (
    <div className="rounded-xl p-4 bg-white/10 border border-white/20 shadow-md hover:scale-[1.02] transition transform duration-200">
      <h3 className="font-semibold text-[color:var(--foreground)]">{name}</h3>
      <p className="text-sm text-[color:var(--secondary)]">{role}</p>
      <p className="text-xs text-[color:var(--accent)] mt-1">{contact}</p>
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
