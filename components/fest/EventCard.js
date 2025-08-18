"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CountdownTimer from "../custom/CountdownTimer";
import {
  Bookmark,
  Share2,
  MapPin,
  Clock,
  Calendar,
  ArrowRight,
} from "lucide-react";

export default function EventCard({ event }) {
  const [enrolling, setEnrolling] = useState(false);
  const [student, setStudent] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    _id,
    title = "Untitled Event",
    slug = "",
    description = "",
    imageUrl = "",
    category = "",
    eventId = "",
    date = "",
    time = "",
    venue = "",
    prizes = "",
    ruleBookPdfUrl = "",
    coordinators = [],
    registeredStudents = [],
    winners = [],
    status = "",
    maxParticipants = 0,
  } = event || {};

  const coordinatorPrimary = coordinators?.[0];
  const registeredCount = registeredStudents?.length || 0;
  const winnersCount = winners?.length || 0;
  const isCancelled = status === "cancelled";

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) return;

    const parsedStudent = JSON.parse(storedStudent);
    setStudent(parsedStudent);

    fetch(`/api/enrollments?studentId=${parsedStudent._id}`)
      .then((res) => res.json())
      .then((data) => {
        const alreadyEnrolled = data?.enrolledEvents?.some(
          (e) => e._id === _id
        );
        setIsEnrolled(alreadyEnrolled);
      })
      .catch(console.error);
  }, [_id]);

  const handleEnroll = async () => {
    if (!student) return alert("Please log in first.");
    setEnrolling(true);

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: student._id, eventId: _id }),
      });

      const data = await res.json();
      setEnrolling(false);

      if (res.ok) setIsEnrolled(true);
      else alert(data.message || "❌ Enrollment failed.");
    } catch (err) {
      setEnrolling(false);
      alert("Something went wrong. Try again.");
    }
  };

  const handleShare = async (slug, title) => {
    // Build event detail URL dynamically
    const eventUrl = `${window.location.origin}/events/${slug}`;

    try {
      await navigator.share({
        title,
        text: `Check out this event: ${title}`,
        url: eventUrl,
      });
    } catch {
      // Fallback: copy link to clipboard
      await navigator.clipboard.writeText(eventUrl);
      alert("🔗 Event link copied to clipboard!");
    }
  };

  const toggleFavorite = () => setIsFavorite((prev) => !prev);
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

  const categoryColors = {
    Gaming: "bg-purple-600",
    CULTURAL: "bg-[var(--highlight)]",
    Cultural: "bg-[var(--highlight)]",
    Technical: "bg-[var(--accent)]",
    default: "bg-gray-600",
  };

  // Utility function
  function formatTo12Hour(time) {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);

    let suffix = hour >= 12 ? "PM" : "AM";
    let formattedHour = hour % 12 || 12; // convert 0 -> 12
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${suffix}`;
  }

  // utils/date.js
  function formatDateToMonthName(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", // "short" for Aug, "long" for August
      day: "numeric",
    });
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col h-full rounded-2xl border border-[color:var(--border)] shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
    >
      {/* IMAGE SECTION */}
      <div className="relative">
        {imageUrl ? (
          <Link href={`/events/${slug}`}>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-44 sm:h-52 object-cover"
            />
          </Link>
        ) : (
          <div className="w-full h-44 flex items-center justify-center text-gray-400 bg-gray-100 text-sm">
            No Image
          </div>
        )}

        {/* Category Tag */}
        {category && (
          <span
            className={`absolute top-3 left-3 px-2 py-0.5 text-[11px] sm:text-xs font-semibold rounded-full text-white shadow ${
              categoryColors[category] || categoryColors.default
            }`}
          >
            {category}- {eventId}
          </span>
        )}

        {/* Fav + Share */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full bg-white shadow hover:bg-gray-50 transition ${
              isFavorite ? "text-yellow-500" : "text-gray-600"
            }`}
          >
            <Bookmark size={16} />
          </button>
          <button
            onClick={() => handleShare(event.slug, event.title)}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-50 transition text-gray-600"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <h3 className="text-lg font-bold mb-2 line-clamp-1 text-[color:var(--foreground)]">
          {title}
        </h3>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
          {date && (
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
              <Calendar size={12} />{" "}
              <p className="text-sm text-gray-600">
                {formatDateToMonthName(event.date)}
              </p>
            </span>
          )}
          {time && (
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
              <Clock size={12} />{" "}
              <p className="text-sm text-gray-600">
                {formatTo12Hour(event.time)}
              </p>
            </span>
          )}
          {venue && (
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
              <MapPin size={12} /> {venue}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {/* Countdown */}
        {/* <CountdownTimer
          date={date}
          time={time}
          winnerDeclared={winnersCount > 0}
          cancelled={isCancelled}
        /> */}

        {/* Seats Progress */}
        {/* {maxParticipants > 0 && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    (registeredCount / maxParticipants) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {registeredCount}/{maxParticipants} seats filled
            </p>
          </div>
        )} */}

        {/* Prizes */}
        {/* {prizes && (
          <p className="mt-3">
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-0.5 rounded font-medium shadow text-sm">
              🏆 {prizes}
            </span>
          </p>
        )} */}

        {/* Winners */}
        {/* {winnersCount > 0 && (
          <div className="mt-3 text-xs">
            <p className="font-semibold text-gray-800 mb-1">Winners:</p>
            <div className="flex flex-wrap gap-1">
              {winners.map((w, i) => (
                <span
                  key={w._id}
                  className={`px-2 py-0.5 rounded text-white ${
                    i === 0
                      ? "bg-yellow-500"
                      : i === 1
                      ? "bg-gray-400"
                      : "bg-amber-700"
                  }`}
                >
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"} {w.name}
                </span>
              ))}
            </div>
          </div>
        )} */}

        {/* Show More */}
        {/* {(ruleBookPdfUrl || coordinatorPrimary) && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              className="text-xs font-medium underline underline-offset-2 text-blue-600"
            >
              {showMore ? "Hide details ▲" : "More details ▼"}
            </button>

            {showMore && (
              <div className="mt-2 space-y-1 text-xs text-gray-700">
                {ruleBookPdfUrl && (
                  <p>
                    📘{" "}
                    <a
                      href={ruleBookPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      Rulebook (PDF)
                    </a>
                  </p>
                )}
                {coordinatorPrimary?.name && (
                  <p>
                    👥 <strong>{plural(coordinators.length, "Coordinator")}:</strong>{" "}
                    {coordinatorPrimary.name}{" "}
                    {coordinatorPrimary.contact && (
                      <a
                        href={`tel:${coordinatorPrimary.contact}`}
                        className="text-blue-600"
                      >
                        {coordinatorPrimary.contact}
                      </a>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        )} */}

        {/* BOTTOM BUTTONS */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={handleEnroll}
            disabled={
              enrolling || isEnrolled || winnersCount > 0 || isCancelled
            }
            className={`w-full px-4 py-2 rounded-full font-semibold text-sm sm:text-base transition ${
              isCancelled
                ? "bg-red-500 text-white"
                : winnersCount > 0
                ? "bg-gray-400 text-white"
                : isEnrolled
                ? "bg-green-500 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isCancelled
              ? "Cancelled ❌"
              : winnersCount > 0
              ? "Closed 🏁"
              : isEnrolled
              ? "Enrolled ✅"
              : enrolling
              ? "Enrolling..."
              : "Enroll"}
          </button>

          <Link
            href={`/events/${slug}`}
            className="inline-flex items-center gap-2 px-8 py-2 text-base font-semibold rounded-full border border-[color:var(--highlight)] text-[color:var(--highlight)] hover:bg-[color:var(--highlight)] hover:text-[color:var(--background)] transition-all shadow-md"
          >
            View Details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
