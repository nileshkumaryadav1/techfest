"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileDown } from "lucide-react";

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [enrolledEvent, setEnrolledEvent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchEventDetails();
    fetchEnrolledStudents();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const res = await axios.get(`/api/admin/events/${id}`);
      setEvent(res.data.event);
    } catch (err) {
      setError("Failed to load event details.");
      console.error("❌ Event fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledStudents = async () => {
    try {
      const res = await axios.get("/api/admin/winners");
      const evt = res.data.events.find((e) => e._id === id);
      if (evt) {
        setEnrolledEvent(evt);
        setStudents(evt.enrolledStudents || []);
      }
    } catch (err) {
      console.error("❌ Enrolled fetch error:", err);
    }
  };

  const downloadPDF = () => {
    if (!event) return;
    const doc = new jsPDF();
    doc.text(`Registered Students for "${event.title}"`, 14, 16);
    const data = students.map((s, i) => [i + 1, s.name, s.phone, s.email]);
    autoTable(doc, {
      startY: 20,
      head: [["#", "Name", "Phone", "Email"]],
      body: data,
    });
    doc.save(`${event.title}_Registered_Students.pdf`);
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-[color:var(--secondary)] text-sm">
        Loading event details...
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-10 text-red-500 font-medium text-sm">
        {error}
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-6 space-y-4">
      {/* Event Info */}
      <section className="bg-[color:var(--background)] border border-[color:var(--border)] rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[color:var(--primary)] mb-3 sm:mb-4">
          {event.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 sm:gap-y-2 text-xs sm:text-sm leading-relaxed">
          <p><span className="font-medium text-[color:var(--secondary)]">ID:</span> {event._id}</p>
          <p><span className="font-medium text-[color:var(--secondary)]">Slug:</span> {event.slug}</p>
          <p><span className="font-medium text-[color:var(--secondary)]">Event ID:</span> {event.eventId}</p>
          <p><span className="font-medium text-[color:var(--secondary)]">Category:</span> {event.category}</p>
          <p><span className="font-medium text-[color:var(--secondary)]">Date:</span> {new Date(event.date).toDateString()}</p>
          <p><span className="font-medium text-[color:var(--secondary)]">Time:</span> {event.time}</p>
          <p><span className="font-medium text-[color:var(--secondary)]">Venue:</span> {event.venue}</p>

          <p className="sm:col-span-2">
            <span className="font-medium text-[color:var(--secondary)]">Description:</span>{" "}
            {event.description}
          </p>

          <p className="sm:col-span-2 break-words">
            <span className="font-medium text-[color:var(--secondary)]">Rules:</span>{" "}
            <a
              href={event.ruleBookPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--highlight)] hover:underline"
            >
              {event.ruleBookPdfUrl}
            </a>
          </p>

          <p className="sm:col-span-2 break-words">
            <span className="font-medium text-[color:var(--secondary)]">Image:</span>{" "}
            <a
              href={event.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--highlight)] hover:underline"
            >
              {event.imageUrl.slice(0, 60)}...
            </a>
          </p>

          <p className="sm:col-span-2">
            <span className="font-medium text-[color:var(--secondary)]">Coordinators:</span>{" "}
            {Array.isArray(event.coordinators) && event.coordinators.length > 0
              ? event.coordinators.map((c, idx) => (
                  <span key={idx}>
                    {c.name || c}
                    {idx < event.coordinators.length - 1 ? ", " : ""}
                  </span>
                ))
              : "N/A"}
          </p>

          <p><span className="font-medium text-[color:var(--secondary)]">Prizes:</span> {event.prizes || "N/A"}</p>
          <p><span className="font-medium text-[color:var(--secondary)]">Workshops:</span> {event.workshops || "N/A"}</p>
          <p><span className="font-medium text-[color:var(--secondary)]">Speakers:</span> {event.speakers || "N/A"}</p>

          {enrolledEvent && (
            <p>
              <span className="font-medium text-green-600">Students Enrolled:</span>{" "}
              {enrolledEvent.enrolledCount}
            </p>
          )}

          <p className="sm:col-span-2 text-[color:var(--accent)] font-semibold">
            Winner:{" "}
            {event.winners?.length > 0
              ? event.winners.map((w) => w.name).join(", ")
              : "Not declared"}
          </p>
        </div>
      </section>

      {/* Registered Students */}
      <section className="bg-[color:var(--background)] border border-[color:var(--border)] rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-[color:var(--primary)]">
            👥 Registered Students ({students.length})
          </h2>
          <button
            onClick={downloadPDF}
            className="flex items-center justify-center gap-1.5 text-xs sm:text-sm bg-[color:var(--primary)] text-[color:var(--foreground)] px-3 py-1.5 rounded-lg hover:opacity-90 transition border border-[color:var(--border)]"
          >
            <FileDown className="w-4 h-4" />
            PDF
          </button>
        </div>

        <div className="max-h-64 sm:max-h-72 overflow-y-auto rounded-lg border border-[color:var(--border)]">
          <ul className="divide-y divide-[color:var(--border)]">
            {students.length === 0 ? (
              <li className="text-xs sm:text-sm italic text-[color:var(--accent)] p-3">
                No students enrolled for this event.
              </li>
            ) : (
              students.map((user, idx) => (
                <li
                  key={idx}
                  className={`py-2 px-3 text-xs sm:text-sm ${
                    idx % 2 === 0 ? "bg-[color:var(--muted)]/30" : ""
                  }`}
                >
                  <span className="font-semibold text-[color:var(--foreground)]">
                    {user.name}
                  </span>{" "}
                  — <span className="text-[color:var(--secondary)]">{user.phone}</span>{" "}
                  — <span className="text-[color:var(--secondary)]">{user.email}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
