"use client";

import { CollegeData, FestData } from "@/data/FestData";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="w-full py-20 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-8">
        {/* Title */}
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          About <span className="text-[color:var(--accent)]">{FestData.name}</span>
        </h2>

        {/* Subtitle */}
        <div className="space-y-2 text-base sm:text-lg text-[color:var(--secondary)]">
          <p>
            Presented by{" "}
            <span className="font-semibold text-[color:var(--highlight)]">
              {CollegeData.name}
            </span>
          </p>
          <p>
            Organised by{" "}
            <span className="font-semibold text-[color:var(--highlight)]">
              {FestData.organizers}
            </span>
          </p>
        </div>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl leading-relaxed text-[color:var(--foreground)] max-w-3xl">
          {FestData.description}
        </p>
      </div>
    </section>
  );
}
