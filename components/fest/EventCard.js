"use client";
import Link from "next/link";
import { useState } from "react";

export default function EventCard({ event }) {
  const [enrolling, setEnrolling] = useState(false);
  const [student, setStudent] = useState(null);

  const handleEnroll = async () => {
    const storedStudent = localStorage.getItem("student");

    const parsed = JSON.parse(storedStudent);
      setStudent(parsed);

    if (!storedStudent) {
      alert("Please log in first.");
      return;
    }

    setEnrolling(true);

    const res = await fetch("/api/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: JSON.parse(storedStudent)._id,
        eventId: event._id,
      }),
    });

    const data = await res.json();
    setEnrolling(false);

    if (res.ok) {
      alert("Enrolled successfully!");
    } else {
      alert(data.message || "Enrollment failed.");
    }
  };

  return (
    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <h3 className="text-lg font-semibold">{event.title}</h3>
      <p className="text-sm text-[var(--secondary)]">{event.description}</p>
      <button
        onClick={handleEnroll}
        disabled={enrolling}
        className="mt-3 px-4 py-2 bg-[var(--accent)] text-white rounded"
      >
        {enrolling ? "Enrolling..." : "Enroll"}
      </button>
      <Link
        href={`/events/${event.slug}`}
        className="mt-3 px-4 py-2 bg-[var(--accent)] text-white rounded"
      >
        View Details
      </Link>
    </div>
  );
}
