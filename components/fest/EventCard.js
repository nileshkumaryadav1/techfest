"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function EventCard({ event }) {
  const [enrolling, setEnrolling] = useState(false);
  const [student, setStudent] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // ---- Derived / safe values ----
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
  const coordinatorCount = coordinators?.length || 0;
  const registeredCount = registeredStudents?.length || 0;
  const winnersCount = winners?.length || 0;

  // ---- Load student + enrollment check ----
  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) return;

    const parsedStudent = JSON.parse(storedStudent);
    setStudent(parsedStudent);

    fetch(`/api/enrollments?studentId=${parsedStudent._id}`)
      .then((res) => res.json())
      .then((data) => {
        const enrolledEvents = data.enrolledEvents || [];
        const alreadyEnrolled = enrolledEvents.some((e) => e._id === _id);
        setIsEnrolled(alreadyEnrolled);
      })
      .catch((err) => console.error("Failed to check enrollment", err));
  }, [_id]);

  // ---- Enroll ----
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
        eventId: _id,
      }),
    });

    const data = await res.json();
    setEnrolling(false);

    if (res.ok) {
      setIsEnrolled(true);
    } else {
      alert(data.message || "❌ Enrollment failed.");
    }
  };

  // ---- UI Helpers ----
  const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

  return (
    <div
      className="
        flex flex-col justify-between h-full p-5 rounded-2xl
        border border-[color:var(--border)]
        bg-[color:var(--card)]
        shadow-md hover:shadow-xl transition-shadow duration-200
      "
    >
      {/* Image + Category Badge */}
      <div className="relative mb-4">
        {imageUrl ? (
          <Link href={`/events/${slug}`}>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-40 object-cover rounded-xl border border-[color:var(--border)]"
            />
          </Link>
        ) : (
          <div
            className="
              w-full h-40 rounded-xl border border-[color:var(--border)]
              flex items-center justify-center text-sm text-[color:var(--secondary)]
            "
          >
            No Image
          </div>
        )}

        {category && (
          <span
            className="
              absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full
              bg-[color:var(--accent)] text-white shadow
            "
          >
            {category}
          </span>
        )}
      </div>

      {/* Title + Short Desc */}
      <h3 className="text-xl font-bold text-[color:var(--foreground)] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[color:var(--secondary)] line-clamp-3 mb-3">
          {description.slice(0, 100) + (description.length > 100 ? "..." : "")}
        </p>
      )}

      {/* Quick Meta */}
      {(date || time || venue) && (
        <p className="text-xs text-[color:var(--highlight)] mb-2">
          {date && <>📅 {date} </>}
          {time && <>• ⏰ {time} </>}
          {venue && <>• 📍 {venue}</>}
        </p>
      )}

      {/* Prizes */}
      {prizes && (
        <p className="text-xs mb-3">
          <span className="inline-block py-1 rounded bg-[color:var(--primary)]/10 text-[color:var(--primary)] font-medium">
            <span className="font-bold text-md">🏆 Prizes : </span>
            {prizes}
          </span>
        </p>
      )}

      {/* Expand / collapse extra details */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="
            text-xs font-medium underline underline-offset-2
            text-[color:var(--accent)]
            hover:opacity-80 transition
          "
        >
          {showMore ? "Hide details ▲" : "Show details ▼"}
        </button>

        {showMore && (
          <div className="mt-3 space-y-2 text-xs text-[color:var(--foreground)]">
            {/* Rulebook */}
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

            {/* Coordinators */}
            {coordinatorCount > 0 && (
              <p>
                👥 {plural(coordinatorCount, "Coordinator")}
                {coordinatorPrimary?.name && (
                  <>
                    {": "}
                    <span className="font-semibold">
                      {coordinatorPrimary.name}
                    </span>
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
                  </>
                )}
              </p>
            )}

            {/* Registered Students */}
            {/* <p>🧑‍🎓 {plural(registeredCount, "Registered Student")}</p> */}

            {/* Winners */}
            {winnersCount > 0 && <p>🏅 {plural(winnersCount, "Winner")}</p>}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleEnroll}
          disabled={enrolling || isEnrolled}
          className={`
            w-full sm:w-auto px-4 py-2 rounded-xl font-medium transition
            ${
              isEnrolled
                ? "bg-green-500 text-white cursor-not-allowed"
                : "bg-[color:var(--accent)] text-white hover:opacity-90"
            }
          `}
        >
          {isEnrolled ? "Enrolled ✅" : enrolling ? "Enrolling..." : "Enroll"}
        </button>

        <Link
          href={`/events/${slug}`}
          className="
            w-full sm:w-auto px-4 py-2 rounded-xl border
            border-[color:var(--accent)] text-[color:var(--accent)]
            font-medium hover:bg-[color:var(--accent)] hover:text-white
            transition text-center
          "
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
