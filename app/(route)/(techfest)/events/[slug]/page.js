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
        const res = await fetch(`/api/event/${slug}`); // ⚠️ fixed path
        const data = await res.json();

        if (!res.ok || data.error) {
          setEvent(null);
        } else {
          setEvent(data);
        }
      } catch (err) {
        console.error("Failed to load event:", err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  // ✅ Load Student from localStorage
  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) {
      router.push("/login");
    } else {
      try {
        setStudent(JSON.parse(storedStudent));
      } catch {
        setStudent(null);
        router.push("/login");
      }
    }
  }, [router]);

  // ✅ Handle Enroll
  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!student || !event?._id) return;

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event._id,
          studentId: student._id,
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else if (res.status === 409) {
        setStatus("already");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Enroll error:", err);
      setStatus("error");
    }
  };

  // ✅ Loading State
  if (loading) {
    return <div className="text-center mt-20">Loading event...</div>;
  }

  // ✅ Not Found
  if (!event) {
    return <div className="text-center mt-20 text-red-500">❌ Event not found.</div>;
  }

  return (
    <main className="px-6 md:px-20 py-12 max-w-5xl mx-auto text-[color:var(--foreground)]">
      <h1 className="text-3xl font-bold mb-2 text-[color:var(--accent)]">
        {event.title}
      </h1>
      <p className="text-sm text-[color:var(--secondary)] mb-6">
        {event.date} • {event.venue}
      </p>
      <p className="mb-8">{event.description}</p>

      <form onSubmit={handleEnroll} className="space-y-4 max-w-md">
        <h2 className="text-xl font-semibold">Enroll for this Event</h2>
        <button
          type="submit"
          className="bg-[color:var(--accent)] text-black px-5 py-2 rounded-xl"
        >
          Enroll Now
        </button>

        {status === "success" && (
          <p className="text-green-400">✅ Successfully enrolled!</p>
        )}
        {status === "already" && (
          <p className="text-yellow-400">⚠️ You&apos;re already enrolled in this event.</p>
        )}
        {status === "error" && (
          <p className="text-red-400">❌ Enrollment failed. Please try again.</p>
        )}
      </form>
    </main>
  );
}
