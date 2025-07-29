import { sponsorsData } from "@/data/FestData";
import FadeInSection from "../dashboard/custom/FadeInSection";
import Link from "next/link";

export default function Sponsors() {
  return (
    <FadeInSection>
      <section
        id="sponsors"
        className="py-20 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)] border-t border-[color:var(--border)]"
      >
        <div className="max-w-6xl mx-auto text-center space-y-12">
          {/* Heading */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Our{" "}
              <Link
                href="/sponsors"
                className="text-[color:var(--accent)] hover:underline hover:cursor-pointer"
              >
                Sponsors
              </Link>
            </h2>
            <p className="text-[color:var(--secondary)] text-base sm:text-lg">
              Proudly supported by trailblazing brands & industry leaders
            </p>
          </div>

          {/* Sponsor Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center justify-center">
            {sponsorsData.map((sponsor, idx) => (
              <a
                key={idx}
                href={sponsor.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center bg-white/5 backdrop-blur-md border border-[color:var(--border)] rounded-2xl p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-center"
              >
                <img
                  src={sponsor.image}
                  alt={sponsor.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-3 transition-transform group-hover:scale-110"
                />
                <span className="text-sm sm:text-base font-medium text-[color:var(--foreground)]">
                  {sponsor.name}
                </span>
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap justify-center items-center gap-4 pt-8">
            <Link
              href="/new-sponsor"
              className="px-6 py-3 text-sm font-semibold rounded-full bg-[color:var(--accent)] text-[color:var(--background)] hover:scale-105 transition-transform shadow-md"
            >
              Become Our Sponsor
            </Link>
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
