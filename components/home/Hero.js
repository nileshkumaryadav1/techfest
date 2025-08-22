"use client";

import { FestData } from "@/data/FestData";
import { Clock4, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import FadeInSection from "../custom/FadeInSection";
import BlurText from "../custom/ui/BlurText";
import ElectricBorder from "../custom/ui/ElectricBorder";

export default function HeroSection() {
  return (
    <FadeInSection>
      <section
        className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 md:py-20 overflow-hidden text-center"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <ElectricBorder
          color="var(--accent)"
          thickness={0}
          speed={1}
          chaos={0.1}
        >
          <div className="max-w-6xl w-full z-10 md:space-y-8">
            {/* Fest Name */}
            <h1 className="text-[clamp(3rem,10vw,6rem)] font-extrabold leading-tight tracking-tight drop-shadow-md">
              <span className="bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--highlight)] bg-clip-text text-transparent">
                {FestData.name}
              </span>
            </h1>

            {/* Theme + Tagline */}
            <p className="flex flex-col items-center">
              <BlurText
                text={`${FestData.theme} - ${FestData.tagline}`}
                delay={150}
                animateBy="words"
                direction="top"
                className="text-[clamp(1rem,3vw,1.5rem)] font-semibold text-[color:var(--highlight)]"
              />
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-full bg-[color:var(--accent)] text-[color:var(--background)] hover:scale-105 transition-transform shadow-md"
              >
                Explore Events <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-full border border-[color:var(--accent)] text-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-[color:var(--background)] transition-all shadow-md"
              >
                Register Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Date & Venue */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-6 text-sm sm:text-base md:text-lg text-[color:var(--secondary)]">
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
        </ElectricBorder>
      </section>
    </FadeInSection>
  );
}
