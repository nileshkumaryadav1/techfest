import Image from "next/image";
import Link from "next/link";

// Fetch all homepage data in a single request
async function getHomePageData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/homepage`, {
    cache: "no-store", // Ensures fresh data on each request
  });

  if (!res.ok) throw new Error("Failed to fetch homepage data");

  return res.json();
}

export default async function HomePage() {
  const { events, sponsors, highlights } = await getHomePageData();

  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section
        className="relative h-[80vh] md:h-[100vh] flex items-center justify-center text-center text-white bg-cover bg-center px-6 sm:px-12 lg:px-24 mt-5"
        style={{ backgroundImage: "url('/techfest-banner.jpg')" }}
      >
        <div className="bg-gray-100 bg-opacity-60 p-6 sm:p-12 rounded-lg max-w-2xl text-black">
          <h1 className="text-3xl sm:text-5xl font-bold">Welcome to TechFest&apos;25</h1>
          <p className="mt-4 text-base sm:text-lg">
            Experience the future of technology with innovation, competitions, and knowledge sharing.
          </p>
          <Link
            href="/events"
            className="mt-6 inline-block bg-blue-500 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Explore Events
          </Link>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 px-6 sm:px-12 lg:px-24 md:h-[80vh]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Featured Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} title={event.title} date={event.date} />
            ))}
          </div>
          <Link href="/events" className="mt-6 inline-block text-blue-500 font-semibold hover:underline">
            View All Events →
          </Link>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="bg-gray-200 py-12 px-6 sm:px-12 lg:px-24 md:h-[40vh]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">Our Sponsors</h2>
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            {sponsors.map((sponsor, index) => (
              <Image key={index} src={sponsor.image} alt={sponsor.name} width={150} height={80} className="h-16 sm:h-20" />
            ))}
          </div>
        </div>
      </section>

      {/* Last Year's Event Photos */}
      <section className="py-12 px-6 sm:px-12 lg:px-24 md:h-[70vh]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Last Year’s Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights.map((highlight, index) => (
              <Image
                key={index}
                src={highlight.image}
                alt={`Event ${index + 1}`}
                width={400}
                height={250}
                className="rounded-lg w-full h-56 sm:h-64 object-cover"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Event Card Component
function EventCard({ title, date }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-center transition-transform hover:scale-105">
      <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{date}</p>
      <Link href="/events" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        Learn More
      </Link>
    </div>
  );
}
