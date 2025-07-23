"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EventDetailPage() {
  const router = useRouter();
  const { slug } = useParams();

  const [student, setStudent] = useState(null);
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/event/${slug}`);
        const data = await res.json();
        setEvent(res.ok && !data.error ? data : null);
      } catch (err) {
        console.error("Fetch error:", err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  // Load student from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("student");
      if (stored) setStudent(JSON.parse(stored));
    } catch {
      setStudent(null);
    }
  }, []);

  // Handle enrollment
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

  // Loading state
  if (loading) {
    return (
      <div className="text-center mt-24 text-lg text-[var(--secondary)] animate-pulse">
        Loading event details...
      </div>
    );
  }

  // Event not found
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

  return (
    <main className="min-h-screen px-3 md:px-20 py-10 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-4xl mx-auto rounded-2xl shadow-xl border border-[var(--border)] bg-[var(--card)] md:p-8 p-4 space-y-8">

        {/* 📸 Event Image */}
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-64 object-cover rounded-xl shadow-md"
        />

        {/* 🏷️ Event Info */}
        <div className="flex flex-col md:flex-row md:gap-4">
          <div className="md:border-r border-[var(--border)] md:pr-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--accent)] mb-3">
              {event.title}
            </h1>
            <h4 className="text-sm md:text-md font-semibold text-[var(--highlight)] mb-5">
              Event ID: {event.eventId} {" | "} Category: {event.category}
            </h4>
            <p className="text-sm text-[var(--secondary)] mb-3">
              📅 {event.date} | 🕧 {event.time} | 📍 {event.venue}
            </p>
          </div>

          {/* 📝 Description */}
          <div className="md:pl-4 pt-4 md:pt-0 text-base leading-relaxed whitespace-pre-line">
            {event.description}
          </div>
        </div>

        {/* 🚀 Enroll Section */}
        <form onSubmit={handleEnroll} className="space-y-5 max-w-xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-[var(--highlight)]">
            {event?.winners?.length > 0 ? (
              <>
                <p className="text-sm text-[var(--secondary)]">
                  <span>🏁 Event Concluded</span><br />
                  🏆 Winners: {event.winners.map(w => w.name).join(", ")}
                </p>
              </>
            ) : status === "success" || status === "already" ? (
              "✅ You're Already Enrolled"
            ) : (
              "🚀 Participate Now"
            )}
          </h2>

          {/* Button + Rulebook */}
          {student ? (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              {event?.winners?.length > 0 ? (
                <button
                  disabled
                  className="bg-gray-400 text-white px-6 py-2.5 font-semibold rounded-xl shadow-md cursor-not-allowed"
                >
                  🏆 Winners Declared
                </button>
              ) : status === "success" || status === "already" ? (
                <button
                  disabled
                  className="bg-green-600 text-white px-6 py-2.5 font-semibold rounded-xl shadow-md cursor-not-allowed"
                >
                  ✅ Enrolled
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-[var(--accent)] text-black px-6 py-2.5 font-semibold rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-all"
                >
                  🚀 Enroll Now
                </button>
              )}

              {event.ruleBookPdfUrl && (
                <a
                  href={event.ruleBookPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[var(--accent)] text-[var(--accent)] px-6 py-2.5 font-semibold rounded-xl hover:bg-[var(--accent)] hover:text-black transition shadow"
                >
                  📘 View Rulebook
                </a>
              )}
            </div>
          ) : (
            <p className="text-yellow-400">
              ⚠️ Please{" "}
              <a href="/login" className="underline text-blue-400 hover:text-blue-300 transition">
                login
              </a>{" "}
              to enroll.
            </p>
          )}

          {/* Status Messages */}
          {status === "success" && <p className="text-green-400">✅ Successfully enrolled!</p>}
          {status === "already" && <p className="text-yellow-400">👍 You&apos;re already enrolled.</p>}
          {status === "error" && <p className="text-red-400">❌ Something went wrong. Try again.</p>}
        </form>

        {/* 👥 Coordinators */}
        {Array.isArray(event.coordinators) && event.coordinators.length > 0 && (
          <section className="mt-14 border-t border-[var(--border)] pt-8">
            <h2 className="text-2xl font-semibold mb-6 text-[var(--accent)] text-center">
              👥 Event Coordinators
            </h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {event.coordinators.map((coord, i) => {
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
                    {contact ? (
                      <p className="text-sm mt-1 text-[var(--secondary)]">📞 {contact}</p>
                    ) : (
                      <p className="text-sm mt-1 text-gray-400">📞 Contact not available</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 🔙 Back Button */}
        <div className="pt-12 text-center">
          <button
            onClick={() => router.back()}
            className="text-sm underline text-[var(--secondary)] hover:text-[var(--highlight)] transition"
          >
            ← Back to Events
          </button>
        </div>
      </div>
    </main>
  );
}
