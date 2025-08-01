"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [enrolledEvent, setEnrolledEvent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    coordinators: "",
  });

  useEffect(() => {
    if (!id) return;
    fetchEventDetails();
    fetchEnrolledStudents();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const res = await axios.get(`/api/admin/events/${id}`);
      const evt = res.data.event;
      setEvent(evt);
      setFormData({
        title: evt.title || "",
        date: evt.date?.slice(0, 10) || "",
        time: evt.time || "",
        venue: evt.venue || "",
        coordinators: (evt.coordinators || [])
          .map((c) => c.name || c)
          .join(", "),
      });
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

  const handleEventUpdate = async () => {
    try {
      const updated = {
        ...formData,
        coordinators: formData.coordinators.split(",").map((c) => c.trim()),
      };
      const res = await axios.put(`/api/admin/events/${id}`, updated);
      setEvent(res.data.event);
      setEditMode(false);
    } catch (err) {
      console.error("❌ Update failed:", err);
    }
  };

  const handleEventDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`/api/admin/events/${id}`);
      alert("Event deleted successfully");
      window.location.href = "/admin/events";
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Registered Students for "${event?.title}"`, 14, 16);
    const data = students.map((s, i) => [i + 1, s.name, s.phone, s.email]);
    autoTable(doc, {
      startY: 20,
      head: [["#", "Name", "Phone", "Email"]],
      body: data,
    });
    doc.save(`${event?.title}_Registered_Students.pdf`);
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading event details...
      </div>
    );
  if (error)
    return (
      <div className="text-center mt-10 text-red-600 font-medium">{error}</div>
    );

  return (
    <div className="md:max-w-4xl md:mx-auto md:px-4 md:py-8 md:space-y-10 space-y-2">
      {/* <h1 className="text-3xl font-bold">{event?.title}</h1> */}

      {/* Event Info */}
      <section className="bg-white md:p-6 rounded-xl shadow md:space-y-3 bg-[color:var(--foreground)] text-[color:var(--background)]">
        <div className="">
          {/* <h2 className="text-xl font-semibold">📅 Event Information</h2> */}
          {/* <div className="flex justify-around p-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-blue-600 hover:underline border p-1 rounded px-5"
            >
              {editMode ? "Cancel" : "Edit"}
            </button>
            <button
              onClick={handleEventDelete}
              className="text-red-600 hover:underline border p-1 rounded"
            >
              Delete
            </button>
          </div> */}
        </div>

        {editMode ? (
          <>
            {["title", "date", "time", "venue", "coordinators"].map((field) => (
              <input
                key={field}
                type={field === "date" ? "date" : "text"}
                className="input w-full mb-2 border px-3 py-2 rounded"
                value={formData[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              />
            ))}
            <button
              onClick={handleEventUpdate}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </>
        ) : (
          <div className="bg-white shadow-md rounded-xl md:p-6 p-3 md:space-y-4 border">
            <h2 className="text-lg md:text-2xl font-bold text-[color:var(--primary)] text-center">
              {event.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:gap-4 text-sm">
              <p>
                <span className="font-semibold">ID:</span> {event._id}
              </p>
              <p>
                <span className="font-semibold">Slug:</span> {event.slug}
              </p>
              <p>
                <span className="font-semibold">Event ID:</span> {event.eventId}
              </p>
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {event.category}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(event.date).toDateString()}
              </p>
              <p>
                <span className="font-semibold">Time:</span> {event.time}
              </p>
              <p>
                <span className="font-semibold">Venue:</span> {event.venue}
              </p>
              <p className="col-span-1 md:col-span-2">
                <span className="font-semibold">Description:</span>{" "}
                {event.description}
              </p>
            </div>

            <div className="md:space-y-2 text-sm">
              <p>
                <span className="font-semibold">Rules:</span>{" "}
                <a
                  href={event.ruleBookPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {event.ruleBookPdfUrl}
                </a>
              </p>

              <p>
                <span className="font-semibold">Image:</span>{" "}
                <a
                  href={event.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {event.imageUrl.slice(0,100)+"..."}
                </a>
              </p>

              <p>
                <span className="font-semibold">Coordinators:</span>{" "}
                {Array.isArray(event.coordinators)
                  ? event.coordinators.map((c, idx) => (
                      <span key={idx}>
                        {c.name || c}
                        {idx < event.coordinators.length - 1 ? ", " : ""}
                      </span>
                    ))
                  : "N/A"}
              </p>

              <p>
                <span className="font-semibold">Prizes:</span>{" "}
                {event.prizes || "N/A"}
              </p>

              <p>
                <span className="font-semibold">Workshops:</span>{" "}
                {event.workshops || "N/A"}
              </p>

              <p>
                <span className="font-semibold">Speakers:</span>{" "}
                {event.speakers || "N/A"}
              </p>

              {enrolledEvent && (
                <p>
                  <span className="font-semibold text-green-700">
                    Students Enrolled:
                  </span>{" "}
                  {enrolledEvent.enrolledCount}
                </p>
              )}

              <p className="text-sm font-medium text-[color:var(--accent)]">
                <span className="font-semibold">Winner:</span>{" "}
                {event.winners?.length > 0
                  ? event.winners.map((w) => w.name).join(", ")
                  : "Not declared"}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Registered Students */}
      <section className="bg-white md:p-6 p-3 rounded-xl shadow md:space-y-4 bg-[color:var(--foreground)] text-[color:var(--background)]">
        <h2 className="text-md font-semibold">
          👥 Registered Students ({students.length})
        </h2>

        <button
          onClick={downloadPDF}
          className="text-sm bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Download PDF of Regd. Student
        </button>

        <ul className="mt-4 space-y-2">
          {students.length === 0 ? (
            <li className="text-sm italic text-gray-500">
              No students enrolled for this event.
            </li>
          ) : (
            students.map((user, idx) => (
              <li key={idx} className="text-sm">
                <span className="font-semibold">{user.name}</span> -{" "}
                {user.phone} - {user.email}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
