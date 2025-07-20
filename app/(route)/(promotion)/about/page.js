import { FestData } from "@/data/FestData";

export default function AboutPage() {
  return (
    <section className="py-16 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--accent)]">
          About {FestData.name}
        </h1>
        <p className="text-base sm:text-lg text-[color:var(--secondary)] leading-relaxed">
          {FestData.name} is a dynamic platform where students from diverse domains
          come together to showcase their talent, innovation, and creativity in the world of technology.
        </p>
        <p className="text-base sm:text-lg text-[color:var(--secondary)] leading-relaxed">
          From developers to designers, problem-solvers to pioneers — we unite under
          a single banner to build, innovate, and push boundaries through events,
          challenges, and collaborative projects.
        </p>
        <p className="text-sm text-[color:var(--border)] italic">
          Empowering the next generation of tech leaders.
        </p>
      </div>
    </section>
  );
}
