"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EventDetailPage({ params }) {
  const router = useRouter();
  const slug = params.slug;

  const [student, setStudent] = useState(null);
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/event/${slug}`);
        const data = await res.json();
        if (!res.ok || data.error) setEvent(null);
        else setEvent(data);
      } catch (err) {
        console.error("Failed to load event:", err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  // ✅ Load Student (if logged in)
  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      try {
        setStudent(JSON.parse(storedStudent));
      } catch {
        setStudent(null);
      }
    }
  }, []);

  // ✅ Enroll
  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!student || !event?._id) return;

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          studentId: student._id,
        }),
      });

      if (res.ok) setStatus("success");
      else if (res.status === 409) setStatus("already");
      else setStatus("error");
    } catch (err) {
      console.error("Enroll error:", err);
      setStatus("error");
    }
  };

  // ✅ Loading
  if (loading) {
    return (
      <div className="text-center mt-24 text-lg text-[var(--secondary)] animate-pulse">
        Loading event details...
      </div>
    );
  }

  // ✅ Not Found
  if (!event) {
    return (
      <div className="text-center mt-24 text-red-500 text-xl font-semibold">
        ❌ Event not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen px-6 md:px-20 py-16 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-4xl mx-auto rounded-2xl shadow-lg border border-[var(--border)] bg-[var(--card)] p-8">
        <h1 className="text-4xl font-bold text-[var(--accent)] mb-3">
          {event.title}
        </h1>
        <p className="text-sm text-[var(--secondary)] mb-6">
          📅 {event.date} &nbsp; | &nbsp; 📍 {event.venue}
        </p>

        <p className="text-base leading-relaxed mb-10 whitespace-pre-line">
          {event.description}
        </p>

        <form onSubmit={handleEnroll} className="space-y-4 max-w-md">
          <h2 className="text-xl font-semibold">Enroll for this Event</h2>

          {student ? (
            <button
              type="submit"
              className="bg-[var(--accent)] text-black px-6 py-2.5 font-medium rounded-lg shadow hover:opacity-90 transition"
            >
              🚀 Enroll Now
            </button>
          ) : (
            <p className="text-yellow-400">
              ⚠️ Please{" "}
              <a href="/login" className="underline text-blue-400">
                login
              </a>{" "}
              to enroll in this event.
            </p>
          )}

          {status === "success" && (
            <p className="text-green-400">✅ Successfully enrolled!</p>
          )}
          {status === "already" && (
            <p className="text-yellow-400">
              ⚠️ You&apos;re already enrolled in this event.
            </p>
          )}
          {status === "error" && (
            <p className="text-red-400">
              ❌ Enrollment failed. Please try again later.
            </p>
          )}
        </form>

        <div className="mt-12">
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
