"use client";

import { FestData } from "@/data/FestData";
import { Clock4, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 sm:px-12 lg:px-24 overflow-hidden"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Main Content */}
      <div className="max-w-5xl mx-auto z-10 text-center space-y-7 pt-32 md:pt-2">
        {/* Fest Name */}
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tight leading-tight drop-shadow-xl">
          <span className="bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--highlight)] bg-clip-text text-transparent">
            {FestData.name}
          </span>
        </h1>

        {/* Theme + Tagline */}
        <p className="text-lg sm:text-xl md:text-2xl text-[color:var(--highlight)] font-semibold">
          {FestData.theme} — {FestData.tagline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-2xl bg-[color:var(--accent)] text-[color:var(--background)] hover:scale-105 transition-transform shadow-lg"
          >
            Explore Events <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-2xl border border-[color:var(--accent)] text-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-[color:var(--background)] transition-all shadow-lg"
          >
            Register Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Date & Venue */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 text-sm sm:text-base md:text-lg text-[color:var(--secondary)]">
          <div className="flex items-center gap-2">
            <Clock4 className="w-5 h-5 text-[color:var(--accent)]" />
            <span>{FestData.date}</span>
          </div>
          <span className="hidden sm:inline-block">|</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[color:var(--accent)]" />
            <span>{FestData.venue}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
