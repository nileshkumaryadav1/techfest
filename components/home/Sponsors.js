import Image from "next/image";

const sponsors = [
  { name: "TechCorp", image: "/images/sponsors/techcorp.png" },
  { name: "AIWorks", image: "/images/sponsors/aiworks.png" },
];

const SponsorsSection = () => {
  return (
    <section className="bg-gray-100 py-20 px-6 sm:px-16 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-10">Our Sponsors</h2>
      <div className="flex flex-wrap justify-center items-center gap-10">
        {sponsors.map((s, i) => (
          <Image key={i} src={s.image} alt={s.name} width={140} height={60} className="object-contain" />
        ))}
      </div>
    </section>
  );
};

export default SponsorsSection;
