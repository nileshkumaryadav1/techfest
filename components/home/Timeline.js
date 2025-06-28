const timeline = [
  { date: "Jan 1", event: "Registrations Open" },
  { date: "jan 10", event: "Workshops Begin" },
  { date: "jan 15", event: "Main Fest Day 1" },
  { date: "jan 16", event: "Main Fest Day 2" },
  { date: "jan 17", event: "Main Fest Day 3" },
  { date: "jan 18", event: "Main Fest Day 4" },
  { date: "jan 19", event: "Main Fest Day 5" },
  { date: "jan 20", event: "Closing Ceremony" },
];

const TimelineSection = () => {
  return (
    <section className="bg-gray-900 text-white py-20 px-6 sm:px-16">
      <h2 className="text-3xl text-center font-bold text-[#00F0FF] mb-10">Fest Timeline</h2>
      <div className="max-w-4xl mx-auto space-y-6 border-l-2 border-[#00F0FF] pl-6">
        {timeline.map((item, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-3 top-1 w-3 h-3 rounded-full bg-[#00F0FF]"></div>
            <h4 className="text-lg font-semibold">{item.date}</h4>
            <p className="text-slate-300">{item.event}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TimelineSection;
