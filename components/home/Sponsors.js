import { FestData } from "@/data/FestData";

export default function Sponsors() {
  const sponsorsArray = FestData.sponsors
    ? FestData.sponsors.split(",").map((s) => s.trim())
    : [];

  return (
    <section
      id="sponsors"
      className="py-20 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)] border-t border-[color:var(--border)]"
    >
      <div className="max-w-6xl mx-auto text-center space-y-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">
            Our <span className="text-[color:var(--accent)]">Sponsors</span>
          </h2>
          <p className="text-[color:var(--secondary)]">
            Proudly supported by innovators & leaders
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {sponsorsArray.map((name, idx) => (
            <div
              key={idx}
              className="px-6 py-3 bg-[color:var(--highlight)] text-[color:var(--background)] rounded-2xl text-sm sm:text-base font-medium shadow hover:scale-105 transition"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
