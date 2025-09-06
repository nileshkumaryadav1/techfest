"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  Share2,
  MapPin,
  Clock,
  Calendar,
  ArrowRight,
} from "lucide-react";
import EnrollButton from "./EnrollButton";
import CountdownTimer from "../custom/CountdownTimer";

export default function EventCard({ event }) {
  const [student, setStudent] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    _id,
    title = "Untitled Event",
    slug = "",
    description = "",
    imageUrl = "",
    category = "",
    type = "",
    eventId = "",
    date = "",
    time = "",
    venue = "",
    registeredStudents = [],
    winners = [],
    status = "",
  } = event || {};

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
    CULTURAL: "bg-[var(--highlight)] text-gray-900",
    Cultural: "bg-[var(--highlight)]",
    Technical: "bg-[var(--accent)] text-white",
    default: "bg-gray-600",
  };
  function formatTo12Hour(time) {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);
    let suffix = hour >= 12 ? "PM" : "AM";
    let formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${suffix}`;
  }

  function formatDateToMonthName(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="relative flex flex-col h-full rounded-2xl border border-[color:var(--border)] shadow-md overflow-hidden group"
    >
      {/* IMAGE */}
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
            className={`absolute top-3 left-3 px-2 py-0.5 text-[11px] sm:text-xs font-semibold rounded-full shadow ${
              categoryColors[category] || categoryColors.default
            }`}
          >
            {category}- {eventId}
          </span>
        )}

        {/* Fav + Share */}
        <div className="absolute top-3 right-3 flex gap-2 z-20">
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

        {/* DESKTOP HOVER OVERLAY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="hidden md:flex absolute inset-0 flex-col justify-end bg-black/60 p-4 opacity-0 group-hover:opacity-100 transition-all"
        >
          <p className="text-sm text-white line-clamp-3 mb-3">{description}</p>

          <div className="flex gap-2">
            <EnrollButton eventId={_id} type={type} isEnrolled={isEnrolled} />
            <Link
              href={`/events/${slug}`}
              className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full border border-white text-white hover:bg-white hover:text-black transition-all"
            >
              View Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* CONTENT (ALWAYS VISIBLE ON MOBILE) */}
      <div className="flex flex-col flex-1 p-4 md:p-4">
        <h3 className="text-lg font-bold mb-2 line-clamp-1 text-[color:var(--foreground)]">
          {title}
        </h3>

        <div className="flex flex-wrap gap-2 text-xs text-[color:var(--foreground)] bg-[color:var(--background)] mb-3">
          {date && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded">
              <Calendar size={12} /> {formatDateToMonthName(date)}
            </span>
          )}
          {time && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded">
              <Clock size={12} /> {formatTo12Hour(time)}
            </span>
          )}
          {venue && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded">
              <MapPin size={12} /> {venue}
            </span>
          )}
          {/* Countdown */}
          <span className="flex items-center px-2 py-0.5 rounded">
            <CountdownTimer
              date={date}
              time={time}
              winnerDeclared={winnersCount > 0}
              cancelled={isCancelled}
            />
          </span>
        </div>

        {/* MOBILE ACTION BUTTONS (ALWAYS SHOWN) */}
        <div className="flex flex-col gap-2 mt-auto md:hidden">
          <EnrollButton eventId={_id} type={type} isEnrolled={isEnrolled} />
          <Link
            href={`/events/${slug}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 text-sm font-semibold rounded-full border border-[color:var(--highlight)] text-[color:var(--highlight)] hover:bg-[color:var(--highlight)] hover:text-white transition-all shadow-sm"
          >
            View Details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
