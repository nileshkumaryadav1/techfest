"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CountdownTimer from "@/components/custom/CountdownTimer";
import TextType from "@/components/custom/ui/TextType";
import RegisterButton from "@/components/fest/RegisterInEventBtn";

// ✅ Utilities for date/time formatting
function formatDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(time) {
  if (!time) return "";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(`1970-01-01T${time}`));
}

export default function EventDetailPage() {
  const router = useRouter();
  const { slug } = useParams();

  const [student, setStudent] = useState(null);
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/event/${slug}`);
        const data = await res.json();
        setEvent(res.ok && !data.error ? data : null);
      } catch {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  // 🔹 Load student from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("student");
      if (stored) setStudent(JSON.parse(stored));
    } catch {
      setStudent(null);
    }
  }, []);

  // 🔹 Handle enrollment
  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!student || !event?._id) return;

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event._id, studentId: student._id }),
      });

      if (res.ok) setStatus("success");
      else if (res.status === 409) setStatus("already");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="text-center mt-24 text-lg text-[var(--secondary)] animate-pulse">
        Loading event details...
      </div>
    );
  }

  // 🔹 Not found state
  if (!event) {
    return (
      <div className="text-center mt-24 text-red-500 text-xl font-semibold">
        ❌ Event not found.
        <div className="mt-6">
          <button
            onClick={() => router.push("/events")}
            className="text-sm px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition"
          >
            🔙 Back to Events
          </button>
        </div>
      </div>
    );
  }

  // Extract fields
  const { _id, title, eventId, category, date, time, venue, status: eventStatus, winners, imageUrl, description, ruleBookPdfUrl, coordinators } = event;
  const winnersCount = winners?.length || 0;

  return (
    <main className="min-h-screen px-3 md:px-20 md:py-10 py-5 bg-[var(--background)] text-[var(--foreground)]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto rounded-2xl shadow-xl border border-[var(--border)] bg-[var(--card)] md:p-8 p-4 md:space-y-10 space-y-4"
      >
        {/* 📸 Image */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-64 object-cover rounded-xl shadow-md"
        />

        {/* Title + Meta */}
        <div className="space-y-3 border-b md:pb-6 pb-4 border-[var(--border)]">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--accent)]">
            {title}
          </h1>
          <h4 className="text-sm md:text-base text-[var(--highlight)]">
            🎯 Event ID: {eventId} | 📂 Category: {category}
          </h4>
          <p className="text-sm text-[var(--secondary)]">
            📅 {formatDate(date)} | 🕒 {formatTime(time)} | 📍 {venue}
          </p>

          <CountdownTimer
            date={date}
            time={time}
            winnerDeclared={winnersCount > 0}
            cancelled={eventStatus === "cancelled"}
          />
        </div>

        {/* 📝 Description */}
        <TextType
          text={description}
          className="text-base leading-relaxed whitespace-pre-line"
          typingSpeed={40}
          pauseDuration={1500}
          showCursor
          cursorCharacter="|"
        />

        {/* 📘 Rulebook & Enroll */}
        <form onSubmit={handleEnroll} className="space-y-6 text-center">
          <h2 className="text-xl font-semibold text-[var(--highlight)]">
            {winnersCount > 0 ? (
              <>
                ✅ Event Completed <br />
                🏆 Winners: {winners.map((w) => w.name).join(", ")}
              </>
            ) : status === "success" || status === "already" ? (
              "✅ You're Already Enrolled"
            ) : (
              "🚀 Participate Now"
            )}
          </h2>

          <div className="flex flex-wrap gap-4 justify-center">
            {/* Team Registration */}
            {/* <RegisterButton eventId={_id} /> */}

            {/* Single Registration */}
            {student ? (
              eventStatus === "cancelled" ? (
                <button disabled className="bg-gray-400 text-white px-6 py-2.5 rounded-full font-semibold cursor-not-allowed">
                  🚫 Event Cancelled
                </button>
              ) : winnersCount > 0 ? (
                <button disabled className="bg-gray-400 text-white px-6 py-2.5 rounded-full font-semibold cursor-not-allowed">
                  🏆 Winners Declared
                </button>
              ) : status === "success" || status === "already" ? (
                <button disabled className="bg-green-600 text-white px-6 py-2.5 rounded-full font-semibold cursor-not-allowed">
                  ✅ Enrolled
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-[var(--accent)] text-black px-6 py-2.5 rounded-full font-semibold hover:scale-105 transition-all"
                >
                  🚀 Enroll Now
                </button>
              )
            ) : (
              <p className="text-yellow-400">
                ⚠️ Please{" "}
                <a href="/login" className="underline text-blue-400 hover:text-blue-300">
                  login
                </a>{" "}
                to enroll.
              </p>
            )}

            {ruleBookPdfUrl && (
              <a
                href={ruleBookPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[var(--accent)] text-[var(--accent)] px-6 py-2.5 rounded-full hover:bg-[var(--accent)] hover:text-black transition shadow"
              >
                📘 View Rulebook
              </a>
            )}
          </div>

          {/* Enrollment messages */}
          {status === "success" && <p className="text-green-400">✅ Successfully enrolled!</p>}
          {status === "already" && <p className="text-yellow-400">👍 You&apos;re already enrolled.</p>}
          {status === "error" && <p className="text-red-400">❌ Something went wrong. Try again.</p>}
        </form>

        {/* 👥 Coordinators */}
        {coordinators?.length > 0 && (
          <section className="border-t border-[var(--border)] pt-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-[var(--accent)] text-center">
              👥 Event Coordinators
            </h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {coordinators.map((coord, i) => {
                const isString = typeof coord === "string";
                const name = isString ? coord : coord.name || "Unnamed";
                const contact = !isString && coord.contact;
                const role = !isString && coord.role;

                return (
                  <div
                    key={i}
                    className="bg-[var(--card)] p-4 border border-[var(--border)] rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-bold">{name}</h3>
                    {role && <p className="text-sm italic text-[var(--highlight)]">{role}</p>}
                    <p className="text-sm mt-1 text-[var(--secondary)]">
                      📞 {contact || "Not available"}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Back button */}
        <div className="pt-10 text-center">
          <button
            onClick={() => router.back()}
            className="text-sm underline text-[var(--secondary)] hover:text-[var(--highlight)] transition"
          >
            ← Back to Events
          </button>
        </div>
      </motion.div>
    </main>
  );
}
