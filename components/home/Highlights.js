import { Sparkles } from "lucide-react";

const events = [
  { title: "AI Hackathon", description: "Build solutions with generative AI." },
  { title: "TechTalks", description: "Talks by Google, ISRO, and OpenAI alumni." },
  { title: "Game Dev Challenge", description: "48hr game building contest." },
];

const EventHighlightsSection = () => {
  return (
    <section className="bg-[color:var(--background)] text-[color:var(--foreground)] py-20 px-6 sm:px-16">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#00F0FF] mb-10">Event Highlights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <div key={i} className="p-6 bg-[#1a1a2e] rounded-xl shadow hover:shadow-blue-500/30 transition">
              <Sparkles className="text-[#00F0FF] mb-4" size={28} />
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-slate-400 mt-2">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventHighlightsSection;
