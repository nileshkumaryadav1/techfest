"use client";

import { CollegeData, FestData } from "@/data/FestData";

export default function AboutSection() {
  return (
    <section
      className="w-full py-16 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)]"
      id="about"
    >
      <div className="max-w-5xl mx-auto text-center space-y-6">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          About <span className="text-[color:var(--accent)]">{FestData.name}</span>
        </h2>

        {/* College Name */}
        <p className="text-base sm:text-lg text-[color:var(--secondary)] font-medium">
          Presented by <span className="font-semibold text-[color:var(--highlight)]">{CollegeData.name}</span>
          <br/>
          Organised by <div className="font-semibold text-[color:var(--highlight)]">{FestData.organizers}</div>
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-[color:var(--foreground)] max-w-3xl mx-auto leading-relaxed">
          {FestData.description}
        </p>
      </div>
    </section>
  );
}
