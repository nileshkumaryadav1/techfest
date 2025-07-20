"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function EventCard({ event }) {
  const [enrolling, setEnrolling] = useState(false);
  const [student, setStudent] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      const parsedStudent = JSON.parse(storedStudent);
      setStudent(parsedStudent);

      // Fetch enrolled events
      fetch(`/api/enrollments?studentId=${parsedStudent._id}`)
        .then((res) => res.json())
        .then((data) => {
          const enrolledEvents = data.enrolledEvents || [];
          const alreadyEnrolled = enrolledEvents.some(
            (e) => e._id === event._id
          );
          setIsEnrolled(alreadyEnrolled);
        })
        .catch((err) => console.error("Failed to check enrollment", err));
    }
  }, [event._id]);

  const handleEnroll = async () => {
    if (!student) {
      alert("Please log in first.");
      return;
    }

    setEnrolling(true);

    const res = await fetch("/api/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: student._id,
        eventId: event._id,
      }),
    });

    const data = await res.json();
    setEnrolling(false);

    if (res.ok) {
      // alert("✅ Enrolled successfully!");
      setIsEnrolled(true);
    } else {
      alert(data.message || "❌ Enrollment failed.");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full p-5 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-md hover:shadow-xl transition-shadow duration-200">
      <div>
        <h3 className="text-xl font-bold text-[color:var(--foreground)] mb-2">
          {event.title}
        </h3>
        <p className="text-sm text-[color:var(--secondary)] line-clamp-3">
          {event.description}
        </p>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleEnroll}
          disabled={enrolling || isEnrolled}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl font-medium transition ${
            isEnrolled
              ? "bg-green-500 text-white cursor-not-allowed"
              : "bg-[color:var(--accent)] text-white hover:opacity-90"
          }`}
        >
          {isEnrolled ? "Enrolled ✅" : enrolling ? "Enrolling..." : "Enroll"}
        </button>

        <Link
          href={`/events/${event.slug}`}
          className="w-full sm:w-auto px-4 py-2 rounded-xl border border-[color:var(--accent)] text-[color:var(--accent)] font-medium hover:bg-[color:var(--accent)] hover:text-white transition text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
