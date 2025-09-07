"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  LogIn,
  User,
  FolderOpen,
  Award,
} from "lucide-react";

import CountdownTimer from "@/components/custom/CountdownTimer";
import TextType from "@/components/custom/ui/TextType";
import EnrollButton from "@/components/fest/EnrollButton";
import LoadingState from "@/components/custom/myself/LoadingState";

// ✅ Format helpers
const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(date))
    : "";

const formatTime = (time) =>
  time
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(`1970-01-01T${time}`))
    : "";

export default function EventDetailPage() {
  const router = useRouter();
  const { slug } = useParams();

  const [student, setStudent] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);

  // 🔹 Fetch event details
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

  // 🔹 Check enrollment
  useEffect(() => {
    if (!student || !event?._id) return;

    const checkEnrollment = async () => {
      try {
        const res = await fetch(`/api/enrollments?studentId=${student._id}`);
        const data = await res.json();
        const already = data?.enrolledEvents?.some((e) => e._id === event._id);
        setIsEnrolled(already);
        setStatus(already ? "success" : "default");
      } catch (err) {
        console.error(err);
      }
    };

    checkEnrollment();
  }, [student, event]);

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

      if (res.ok) {
        setStatus("success");
        setIsEnrolled(true);
      } else if (res.status === 409) {
        setStatus("already");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  // 🔹 Loading state
  if (loading)
    return <LoadingState text="Loading event details…" tips={[]} />;

  // 🔹 Not found
  if (!event)
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

  const {
    _id,
    title,
    eventId,
    category,
    type,
    date,
    time,
    venue,
    status: eventStatus,
    winners,
    imageUrl,
    description,
    ruleBookPdfUrl,
    coordinators,
  } = event;

  const winnersCount = winners?.length || 0;

  return (
    <main className="min-h-screen px-3 md:px-20 md:py-10 py-5 bg-[var(--background)] text-[var(--foreground)]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto rounded-2xl shadow-xl border border-[var(--border)] bg-[var(--card)] md:p-8 p-4 md:space-y-10 space-y-6"
      >
        {/* 📸 Event Banner */}
        <motion.img
          src={imageUrl}
          alt={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full md:h-[300px] object-cover rounded-xl shadow-lg"
        />

        {/* 📌 Event Info */}
        <div className="space-y-3 border-b md:pb-6 pb-4 border-[var(--border)]">
          <h1 className="text-3xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-[var(--accent)] to-purple-400 bg-clip-text text-transparent">
            {title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[var(--highlight)] text-sm md:text-base">
            <span className="flex items-center gap-1">
              <FolderOpen size={16} /> {category}
            </span>
            <span className="flex items-center gap-1">
              <User size={16} /> {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
            <span className="flex items-center gap-1">
              <Award size={16} /> ID: {eventId}
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[var(--secondary)] text-sm">
            <span className="flex items-center gap-1">
              <Calendar size={16} /> {formatDate(date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} /> {formatTime(time)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={16} /> {venue}
            </span>
          </div>

          <CountdownTimer
            date={date}
            time={time}
            winnerDeclared={winnersCount > 0}
            cancelled={eventStatus === "cancelled"}
          />
        </div>

        {/* 📝 Event Description */}
        <TextType
          text={description}
          className="text-base leading-relaxed whitespace-pre-line text-center md:text-left"
          typingSpeed={40}
          pauseDuration={1500}
          showCursor
          cursorCharacter="|"
        />

        {/* 🚀 Enrollment Section */}
        <motion.form
          onSubmit={handleEnroll}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="md:space-y-6 space-y-3 text-center"
        >
          <h2 className="text-lg md:text-xl font-semibold text-[var(--highlight)]">
            {winnersCount > 0
              ? `✅ Event Completed! 🏆 Winners: ${winners.map((w) => w.name).join(", ")}`
              : status === "success" || status === "already"
              ? "✅ You're Already Enrolled"
              : "✒️ Participate Now"}
          </h2>

          <div className="flex flex-wrap md:gap-4 gap-2 justify-center">
            {student ? (
              <EnrollButton eventId={_id} type={type} isEnrolled={isEnrolled} />
            ) : (
              <div className="flex items-center gap-2 text-yellow-400">
                <LogIn size={18} />
                <a
                  href="/login"
                  className="px-6 py-2 border border-[var(--accent)] rounded-full text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition shadow cursor-pointer"
                >
                  Login to Enroll
                </a>
              </div>
            )}

            {ruleBookPdfUrl && (
              <a
                href={ruleBookPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 border border-[var(--accent)] text-[var(--accent)] rounded-full hover:bg-[var(--accent)] hover:text-black transition shadow w-full md:w-auto"
              >
                📘 View Rulebook
              </a>
            )}
          </div>

          {/* ✅ Enrollment Feedback */}
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400"
            >
              ✅ Successfully enrolled!
            </motion.p>
          )}
          {status === "already" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-yellow-400"
            >
              👍 You&apos;re already enrolled.
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400"
            >
              ❌ Something went wrong. Try again.
            </motion.p>
          )}
        </motion.form>

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
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="bg-[var(--card)] p-5 border border-[var(--border)] rounded-xl shadow hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-bold">{name}</h3>
                    {role && (
                      <p className="text-sm italic text-[var(--highlight)]">
                        {role}
                      </p>
                    )}
                    <p className="text-sm mt-1 text-[var(--secondary)]">
                      📞 {contact || "Not available"}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* 🔙 Back Button */}
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
