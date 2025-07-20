import { sponsorsData } from "@/data/FestData";

export default function Sponsors() {
  return (
    <section
      id="sponsors"
      className="py-20 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)] border-t border-[color:var(--border)]"
    >
      <div className="max-w-6xl mx-auto text-center space-y-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">
            Our <span className="text-[color:var(--accent)]">Sponsors</span>
          </h2>
          <p className="text-[color:var(--secondary)]">
            Proudly supported by innovators & leaders
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 items-center">
          {sponsorsData.map((sponsor, idx) => (
            <a
              key={idx}
              href={sponsor.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 px-6 py-4 bg-[color:var(--highlight)] text-[color:var(--background)] rounded-2xl shadow hover:scale-105 transition-all w-[120px] h-[120px] justify-center"
            >
              <img
                src={sponsor.image}
                alt={sponsor.name}
                className="w-12 h-12 object-contain"
              />
              <span className="text-sm font-medium text-center">{sponsor.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
