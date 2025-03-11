import Link from "next/link";

// Fetch all events
async function getHomePageData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/homepage`, {
    cache: "no-store", // Ensures fresh data on each request
  });

  if (!res.ok) throw new Error("Failed to fetch homepage data");

  return res.json();
}

export default async function HomePage() {
  const { events } = await getHomePageData();

  return (
    <div className="bg-gray-100">
      {/* Events Section */}
      <section className="py-12 px-6 sm:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Featured Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                title={event.title}
                date={event.date}
                id={event._id}
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
    <div className="flex flex-col p-6 bg-white rounded-lg shadow-md text-center transition-transform hover:scale-105">
      <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{date}</p>
      <Link
        // href={`/events/${id}`}
        href={"/events"}
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        View Details →
      </Link>

      <Link
        href={"/events"}
        // href={`/events/${id}`}
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Enroll Now
      </Link>
    </div>
  );
}
