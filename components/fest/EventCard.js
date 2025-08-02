"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CountdownTimer from "../custom/CountdownTimer";

export default function EventCard({ event }) {
  const [enrolling, setEnrolling] = useState(false);
  const [student, setStudent] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const {
    _id,
    title = "Untitled Event",
    slug = "",
    description = "",
    imageUrl = "",
    category = "",
    date = "",
    time = "",
    venue = "",
    prizes = "",
    ruleBookPdfUrl = "",
    coordinators = [],
    registeredStudents = [],
    winners = [],
  } = event || {};

  const coordinatorPrimary = coordinators?.[0];
  const registeredCount = registeredStudents?.length || 0;
  const winnersCount = winners?.length || 0;

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) return;

    const parsedStudent = JSON.parse(storedStudent);
    setStudent(parsedStudent);

    fetch(`/api/enrollments?studentId=${parsedStudent._id}`)
      .then((res) => res.json())
      .then((data) => {
        const alreadyEnrolled = data?.enrolledEvents?.some((e) => e._id === _id);
        setIsEnrolled(alreadyEnrolled);
      })
      .catch(console.error);
  }, [_id]);

  const handleEnroll = async () => {
    if (!student) return alert("Please log in first.");
    setEnrolling(true);

    const res = await fetch("/api/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: student._id, eventId: _id }),
    });

    const data = await res.json();
    setEnrolling(false);

    if (res.ok) setIsEnrolled(true);
    else alert(data.message || "❌ Enrollment failed.");
  };

  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

  return (
    <div className="flex flex-col justify-between h-full p-4 sm:p-5 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* Image */}
      <div className="relative mb-3 sm:mb-4">
        {imageUrl ? (
          <Link href={`/events/${slug}`}>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-40 object-cover rounded-xl border border-[color:var(--border)]"
            />
          </Link>
        ) : (
          <div className="w-full h-40 flex items-center justify-center text-sm text-[color:var(--secondary)] bg-muted rounded-xl border border-[color:var(--border)]">
            No Image
          </div>
        )}

        {category && (
          <span className="absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full bg-[color:var(--accent)] text-white shadow-sm">
            {category}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold text-[color:var(--foreground)] mb-1">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-[color:var(--secondary)] line-clamp-3 mb-2 sm:mb-3">
          {description.slice(0, 100) + (description.length > 100 ? "..." : "")}
        </p>
      )}

      {/* Meta Info */}
      {(date || time || venue) && (
        <p className="text-xs text-[color:var(--highlight)] mb-2 space-x-1">
          {date && <>📅 {date}</>}
          {time && <>• ⏰ {time}</>}
          {venue && <>• 📍 {venue}</>}
        </p>
      )}

      {/* Timer */}
      <CountdownTimer date={date} time={time} winnerDeclared={winnersCount > 0} />

      {/* Prizes */}
      {prizes && (
        <p className="text-xs mt-2">
          <span className="inline-block bg-[color:var(--primary)]/10 text-[color:var(--primary)] px-2 py-1 rounded font-medium">
            🏆 <strong>Prizes:</strong> {prizes}
          </span>
        </p>
      )}

      {/* Winners */}
      {winnersCount > 0 && (
        <div className="text-xs mt-1 space-y-1">
          {winners.map((w) => (
            <div key={w._id} className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded">
              🏅 <strong>Winner:</strong> {w.name}
            </div>
          ))}
        </div>
      )}

      {/* Show More */}
      <div className="my-3">
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="text-xs font-medium underline underline-offset-2 text-[color:var(--accent)] hover:opacity-80 transition"
        >
          {showMore ? "Hide details ▲" : "Show details ▼"}
        </button>

        {showMore && (
          <div className="mt-3 space-y-2 text-xs text-[color:var(--foreground)]">
            {ruleBookPdfUrl && (
              <p>
                📘{" "}
                <a
                  href={ruleBookPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--accent)] hover:underline"
                >
                  View Rulebook (PDF)
                </a>
              </p>
            )}

            {coordinatorPrimary?.name && (
              <p>
                👥 <strong>{plural(coordinators.length, "Coordinator")}:</strong>{" "}
                {coordinatorPrimary.name}
                {coordinatorPrimary.contact && (
                  <>
                    {" "}
                    (
                    <a
                      href={`tel:${coordinatorPrimary.contact}`}
                      className="text-[color:var(--accent)] hover:underline"
                    >
                      {coordinatorPrimary.contact}
                    </a>
                    )
                  </>
                )}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-auto flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={handleEnroll}
          disabled={enrolling || isEnrolled || winnersCount > 0}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl font-semibold transition ${
            winnersCount > 0
              ? "bg-gray-400 text-white cursor-not-allowed"
              : isEnrolled
              ? "bg-green-500 text-white cursor-not-allowed"
              : "bg-[color:var(--accent)] text-white hover:opacity-90"
          }`}
        >
          {winnersCount > 0
            ? "Enrollment Closed 🏁"
            : isEnrolled
            ? "Enrolled ✅"
            : enrolling
            ? "Enrolling..."
            : "Enroll"}
        </button>

        <Link
          href={`/events/${slug}`}
          className="w-full sm:w-auto px-4 py-2 text-center rounded-xl border border-[color:var(--accent)] text-[color:var(--accent)] font-semibold hover:bg-[color:var(--accent)] hover:text-white transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
