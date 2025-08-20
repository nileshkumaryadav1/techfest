import { FestData } from "@/data/FestData";
import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="py-16 px-4 sm:px-8 lg:px-16 bg-[color:var(--background)] min-h-screen flex flex-col items-center justify-center">
      <div
        className="max-w-4xl w-full text-center space-y-8 p-6 sm:p-10 rounded-3xl 
                      bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg"
      >
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[color:var(--accent)] drop-shadow-md">
          About {FestData.name}
        </h1>

        {/* Description */}
        <div className="space-y-5 text-[color:var(--secondary)]">
          <p className="text-base sm:text-lg leading-relaxed">
            {FestData.name} is a dynamic platform where students from diverse
            domains come together to showcase their talent, innovation, and
            creativity in the world of technology.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            From developers to designers, problem-solvers to pioneers — we unite
            under a single banner to build, innovate, and push boundaries
            through events, challenges, and collaborative projects.
          </p>
          <p className="text-sm sm:text-base text-[color:var(--border)] italic">
            Empowering the next generation of tech leaders.
          </p>
        </div>

        {/* Brochure Section */}
        <div className="pt-6 border-t border-white/20 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-[color:var(--accent)]">
            Brochure of {FestData.name}
          </h2>
          <Link
            href={FestData.brochure}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-xl bg-[color:var(--accent)]/20 
                       text-[color:var(--accent)] font-medium text-sm sm:text-base 
                       border border-[color:var(--accent)]/40 
                       hover:bg-[color:var(--accent)] hover:text-white 
                       shadow-md transition-all duration-300 backdrop-blur-md"
          >
            📄 View Brochure (PDF)
          </Link>
        </div>
      </div>
    </section>
  );
}
