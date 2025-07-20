"use client";

import { FestData } from "@/data/FestData";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="w-full min-h-screen flex flex-col justify-center items-center text-center px-6 sm:px-12 lg:px-24"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Fest Name */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-md">
          {FestData.name}
        </h1>

        {/* Theme + Tagline */}
        <p className="text-lg sm:text-xl md:text-2xl text-[color:var(--highlight)] font-medium">
           {FestData.theme} -
           {FestData.tagline}
        </p>

        {/* Description */}
        {/* <p className="text-sm sm:text-base md:text-lg text-[color:var(--secondary)] max-w-2xl mx-auto">
          {FestData.description}
        </p> */}

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Link
            href="/events"
            className="px-6 py-3 text-sm font-semibold rounded-2xl bg-[color:var(--accent)] text-[color:var(--background)] hover:scale-105 transition-transform shadow-md"
          >
            Explore Events
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 text-sm font-semibold rounded-2xl border border-[color:var(--accent)] text-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-[color:var(--background)] transition-all shadow-md"
          >
            Register Now
          </Link>
        </div>

        {/* Date */}
        <p className="text-sm sm:text-base md:text-lg text-[color:var(--secondary)]">
          {FestData.date}
        </p>
      </div>
    </section>
  );
}
