import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section
        className="relative h-[90vh] flex items-center justify-center text-center text-white bg-cover bg-center px-6 sm:px-12 lg:px-24 mt-5"
        style={{ backgroundImage: "url('https://png.pngtree.com/png-vector/20220715/ourmid/pngtree-business-concept-hackathon-programming-technology-png-image_5927140.png')" }}
      >
        <div className="bg-gray-100 bg-opacity-60 p-6 sm:p-12 rounded-lg max-w-2xl text-black">
          <h1 className="text-3xl sm:text-5xl font-bold">
            Welcome to TechFest&apos;25
          </h1>
          <p className="mt-4 text-base sm:text-lg">
            Experience the future of technology with innovation, competitions,
            and knowledge sharing.
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
      <section className="py-12 px-6 sm:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Featured Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <EventCard title="AI Hackathon" date="March 15, 2025" />
            <EventCard title="Cybersecurity Workshop" date="March 16, 2025" />
            <EventCard title="Robotics Championship" date="March 17, 2025" />
          </div>
          <Link
            href="/events"
            className="mt-6 inline-block text-blue-500 font-semibold hover:underline"
          >
            View All Events →
          </Link>
        </div>
      </section>

      {/* About TechFest */}
      <section className="bg-white py-12 px-6 sm:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">About TechFest</h2>
          <p className="mt-4 text-base sm:text-lg">
            TechFest is an annual celebration of technology, innovation, and
            collaboration. Organized by multiple colleges, it brings together
            students, researchers, and industry leaders to share knowledge and
            compete in exciting challenges.
          </p>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="bg-gray-200 py-12 px-6 sm:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">Our Sponsors</h2>
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <img
              src="https://img.freepik.com/free-vector/hackathon-doodle-hand-drawing-team-programmers-web-developers-managers-graphic-designers-deve_88138-1348.jpg"
              alt="Sponsor 1"
              className="h-16 sm:h-20"
            />
            <img
              src="https://img.freepik.com/free-vector/hackathon-doodle-hand-drawing-team-programmers-web-developers-managers-graphic-designers-deve_88138-1348.jpg"
              alt="Sponsor 2"
              className="h-16 sm:h-20"
            />
            <img
              src="https://img.freepik.com/free-vector/hackathon-doodle-hand-drawing-team-programmers-web-developers-managers-graphic-designers-deve_88138-1348.jpg"
              alt="Sponsor 2"
              className="h-16 sm:h-20"
            />
            <img
              src="https://img.freepik.com/free-vector/hackathon-doodle-hand-drawing-team-programmers-web-developers-managers-graphic-designers-deve_88138-1348.jpg"
              alt="Sponsor 2"
              className="h-16 sm:h-20"
            />
            {/* <img src="/sponsor3.png" alt="Sponsor 3" className="h-16 sm:h-20"/> */}
          </div>
        </div>
      </section>

      {/* Last Year's Event Photos */}
      <section className="py-12 px-6 sm:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Last Year’s Highlights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <img
              src="https://img.freepik.com/free-vector/hackathon-doodle-hand-drawing-team-programmers-web-developers-managers-graphic-designers-deve_88138-1348.jpg"
              alt="Event 1"
              className="rounded-lg w-full h-56 sm:h-64 object-cover"
            />
            <img
              src="https://img.freepik.com/free-vector/hackathon-doodle-hand-drawing-team-programmers-web-developers-managers-graphic-designers-deve_88138-1348.jpg"
              alt="Event 2"
              className="rounded-lg w-full h-56 sm:h-64 object-cover"
            />
            <img
              src="https://img.freepik.com/free-vector/hackathon-doodle-hand-drawing-team-programmers-web-developers-managers-graphic-designers-deve_88138-1348.jpg"
              alt="Event 3"
              className="rounded-lg w-full h-56 sm:h-64 object-cover"
            />
            {/* <img src="/event3.jpg" alt="Event 3" className="rounded-lg w-full h-56 sm:h-64 object-cover"/> */}
          </div>
        </div>
      </section>
    </div>
  );
}

function EventCard({ title, date }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-center transition-transform hover:scale-105">
      <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{date}</p>
      <Link
        href="/events"
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Learn More
      </Link>
    </div>
  );
}
