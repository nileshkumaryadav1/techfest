"use client";

import { FestData } from "@/data/FestData";
import {
  CalendarCheck,
  Users,
  Mic,
  Trophy,
  Rocket,
  Star,
} from "lucide-react";

const highlights = [
  {
    icon: <CalendarCheck size={32} />,
    title: `${FestData.totalNumberOfDays} Days of Events`,
    desc: "A power-packed lineup of technical and cultural excitement.",
  },
  {
    icon: <Users size={32} />,
    title: `${FestData.totalParticipantCount}+ Participants`,
    desc: "From top colleges across the country, joining the innovation wave.",
  },
  {
    icon: <Mic size={32} />,
    title: "Expert Speakers",
    desc: "Insights from industry leaders, entrepreneurs, and tech pioneers.",
  },
  {
    icon: <Trophy size={32} />,
    title: `${FestData.totalEventCount}+ Competitions`,
    desc: "Hackathons, debates, robo-races, and more!",
  },
  {
    icon: <Rocket size={32} />,
    title: "Startup Showcase",
    desc: "Innovation meets opportunity at our student startup expo.",
  },
  {
    icon: <Star size={32} />,
    title: "Cultural Night",
    desc: "Unwind with performances, music, and fun under the stars.",
  },
];

export default function HighlightsSection() {
  return (
    <section
      className="w-full py-16 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)]"
      id="highlights"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          Fest <span className="text-[color:var(--accent)]">Highlights</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[color:var(--border)] bg-opacity-10 shadow hover:shadow-xl transition duration-300 border border-[color:var(--border)]"
            >
              <div className="text-[color:var(--accent)] mb-4 flex justify-center">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-[color:var(--secondary)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
