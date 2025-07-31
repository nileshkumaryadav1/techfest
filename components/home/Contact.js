"use client";

import Link from "next/link";
import { ArrowRightCircle } from "lucide-react";
import { CollegeData, FestData } from "@/data/FestData";
import FadeInSection from "../dashboard/custom/FadeInSection";

export default function RegisterCTA() {
  return (
    <FadeInSection>
    <section
      className="w-full py-20 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)]"
      id="register"
    >
      <div className="max-w-5xl mx-auto text-center space-y-8">
        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          Ready to{" "}
          <span className="text-[color:var(--accent)]">Join the Revolution</span>?
        </h2>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-[color:var(--secondary)] max-w-3xl mx-auto leading-relaxed">
          Register now and become a part of the most{" "}
          <span className="font-semibold text-[color:var(--highlight)]">innovative</span>,{" "}
          <span className="font-semibold text-[color:var(--highlight)]">exciting</span>, and{" "}
          <span className="font-semibold text-[color:var(--highlight)]">unforgettable</span>{" "}
          {FestData.name} at <span className="hover:underline decoration-[color:var(--accent)] text-[color:var(--highlight)]">{CollegeData.name}</span>.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex justify-center flex-wrap gap-6">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-lg font-semibold bg-[color:var(--accent)] text-[color:var(--background)] shadow-md hover:scale-105 transition-transform hover:shadow-lg"
          >
            Register Now <ArrowRightCircle className="w-5 h-5" />
          </Link>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-lg font-semibold border-2 border-[color:var(--accent)] text-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-[color:var(--background)] transition-all"
          >
            Explore Events
          </Link>
        </div>
      </div>
    </section>
    </FadeInSection>
  );
}
