import { FestData } from "@/data/FestData";
import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16 py-12 sm:py-16 bg-[color:var(--background)]">
      <div
        className="max-w-4xl w-full text-center space-y-6 sm:space-y-8 p-6 sm:p-10 
                   rounded-3xl bg-white/10 backdrop-blur-xl 
                   border border-white/20 shadow-lg"
      >
        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold 
                       text-[color:var(--accent)] drop-shadow-md"
        >
          About {FestData.name}
        </h1>

        {/* Brochure Section */}
        <div className="pt-2 sm:pt-4">
          <Link
            href={FestData.brochure}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 
                       rounded-xl bg-[color:var(--accent)]/15 
                       text-[color:var(--accent)] font-semibold text-sm sm:text-base 
                       border border-[color:var(--accent)]/40 
                       hover:bg-[color:var(--accent)] hover:text-white 
                       shadow-md transition-all duration-300"
          >
            📄 View Brochure
          </Link>
        </div>

        {/* Description */}
        <div className="space-y-5 text-[color:var(--secondary)]">
          <p className="text-base sm:text-lg leading-relaxed text-justify">
            <span className="font-semibold">{FestData.name}</span> is a dynamic
            platform where students from diverse domains come together to
            showcase their talent, innovation, and creativity in the world of
            technology.
          </p>

          <p className="text-base sm:text-lg leading-relaxed text-justify">
            From developers to designers, problem-solvers to pioneers — we unite
            under a single banner to build, innovate, and push boundaries
            through engaging events, hackathons, and collaborative projects.
          </p>

          <p className="text-sm sm:text-base text-[color:var(--highlight)] italic">
            🚀 Empowering the next generation of tech leaders.
          </p>
        </div>
      </div>
    </section>
  );
}
