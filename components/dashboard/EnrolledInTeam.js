"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Calendar, UserCircle } from "lucide-react";
import Link from "next/link";
import CountdownTimer from "../custom/CountdownTimer";
import LoadingSkeletonSmall from "../custom/myself/LoadingSkeletonSmall";
import LoadingSkeleton from "../custom/myself/LoadingSkeleton";

export default function EnrolledInTeam() {
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | solo | team
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch student + enrollments + full event details
  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) return setLoading(false);

    const parsedStudent = JSON.parse(storedStudent);
    setStudent(parsedStudent);

    const fetchEnrollments = async () => {
      try {
        const res = await axios.get("/api/admin/enrollments?full=true");
        setEnrollments(res.data);
      } catch (err) {
        console.error("Error fetching enrollments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // Filter student-specific enrollments
  const studentEnrollments = enrollments.filter(
    (enroll) =>
      student && enroll.participants?.some((p) => p._id === student._id)
  );

  // Apply search + filter
  const filteredEnrollments = studentEnrollments
    .filter((enroll) => {
      if (filter === "solo") return enroll.participants?.length === 1;
      if (filter === "team") return enroll.participants?.length > 1;
      return true;
    })
    .filter(
      (enroll) =>
        enroll.eventDetails?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        enroll.registeredBy?.name?.toLowerCase().includes(search.toLowerCase())
    );

  // De-enroll
  const handleDeEnroll = async (enrollId) => {
    if (!confirm("Are you sure you want to de-enroll from this event?")) return;
    try {
      const res = await axios.delete("/api/enrollments", {
        data: { enrollId, studentId: student._id },
      });
      if (res.status === 200) {
        setEnrollments((prev) => prev.filter((e) => e._id !== enrollId));
      } else {
        alert("Failed to de-enroll.");
      }
    } catch (err) {
      console.error("Error de-enrolling:", err);
      alert("Something went wrong.");
    }
  };

  if (loading)
    return (
      <section className="flex flex-col gap-4">
        <LoadingSkeletonSmall />
        <LoadingSkeleton />
      </section>
    );
  if (!student) return null;

  return (
    <section className="py-6 px-3 sm:px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-3xl font-extrabold text-center mb-4 sm:mb-6 drop-shadow-md">
          🎟️ Your Enrollments
        </h2>

        <p className="text-center text-sm sm:text-base mb-4 text-[color:var(--secondary)]">
          Total Enrollments:{" "}
          <span className="font-bold">{studentEnrollments.length}</span>
        </p>

        {/* Filter buttons */}
        <div className="flex justify-center gap-4 mb-2 flex-wrap">
          {["all", "solo", "team"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {f === "all" ? "All" : f === "solo" ? "Solo" : "Team"}
            </button>
          ))}
        </div>

        <p className="text-center text-sm sm:text-base mb-6 text-[color:var(--secondary)]">
          Showing {filteredEnrollments.length} {filter === "all" ? "" : filter}{" "}
          enrollments
        </p>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search by event or participant"
          className="w-full px-4 py-3 mb-6 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <ul className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredEnrollments.length > 0 ? (
            filteredEnrollments.map((enroll, idx) => {
              const event = enroll.eventDetails;

              return (
                <li
                  key={enroll._id}
                  className="group relative p-5 sm:p-6 rounded-2xl bg-[color:var(--background)]/50 backdrop-blur-lg border border-[color:var(--border)] shadow-lg hover:scale-[1.03] hover:shadow-[color:var(--accent)]/30 transition-all"
                >
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition bg-gradient-to-tr from-purple-500 via-pink-500 to-cyan-500 blur-2xl rounded-2xl"></div>

                  <div className="flex flex-col items-center text-center mb-2 md:mb-4 relative z-10">
                    <span className="text-sm sm:text-base font-bold text-[color:var(--accent)] mb-1">
                      #{idx + 1}
                    </span>
                    <Calendar className="w-10 h-10 text-blue-500 mb-2" />
                    <h3 className="text-lg font-semibold text-[color:var(--foreground)] break-words">
                      {event?.name}
                    </h3>
                    {/* {event?.description && (
                      <p className="text-sm text-[color:var(--secondary)]">
                        {event.description}
                      </p>
                    )} */}

                    <span className="text-sm text-[color:var(--secondary)]">
                      📅 {event.date} | ⏰ {event.time}
                    </span>

                    {event?.venue && (
                      <p className="text-sm text-[color:var(--secondary)]">
                        🏟️ {event.venue}
                      </p>
                    )}

                    {/* Countdown */}
                    <CountdownTimer
                      date={event?.date}
                      time={event?.time}
                      winnerDeclared={event?.winners?.length > 0}
                      cancelled={event?.status === "cancelled"}
                    />
                  </div>

                  {/* Event Badge Solo/Team */}
                  <div className="mt-1 flex justify-center gap-2 relative z-10 flex-wrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        enroll.participants?.length > 1
                          ? "bg-purple-500/20 text-purple-700"
                          : "bg-cyan-500/20 text-cyan-700"
                      }`}
                    >
                      {enroll.participants?.length > 1
                        ? "Team Event"
                        : "Solo Event"}
                    </span>
                  </div>

                  {/* Team Info */}
                  {enroll.teamName && (
                    <div className="mt-3 text-sm text-[color:var(--secondary)] relative z-10">
                      <span className="font-medium">Team:</span>{" "}
                      {enroll.teamName}
                    </div>
                  )}

                  {/* Registered By */}
                  <div className="text-sm mt-2 flex items-center gap-2 text-[color:var(--foreground)] relative z-10">
                    <UserCircle className="w-4 h-4 text-blue-500" />
                    <span>
                      Registered by: {enroll.registeredBy?.name}
                      {/*  ({enroll.registeredBy?.email}) */}
                    </span>
                  </div>

                  {/* Participants */}
                  <div className="mt-3 relative z-10">
                    <p className="text-sm font-medium flex items-center gap-2 mb-2 text-[color:var(--foreground)]">
                      <Users className="w-4 h-4" />
                      Participants ({enroll.participants?.length || 0})
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1 pl-2 text-[color:var(--secondary)]">
                      {enroll.participants?.map((p) => (
                        <li
                          key={p._id}
                          className={
                            p._id === student._id
                              ? "font-bold text-green-500"
                              : ""
                          }
                        >
                          {p.name} 
                          {/* ({p.email}) */}
                        </li>
                      )) || (
                        <li className="italic text-gray-400">
                          No participants
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap justify-center gap-2 mt-4 relative z-10">
                    <Link
                      href={`/events/${event?.slug || ""}`}
                      className="px-3 py-2 rounded-lg bg-cyan-500/20 text-[color:var(--foreground)] text-xs sm:text-sm hover:bg-cyan-500/30 transition w-full text-center"
                    >
                      View Event
                    </Link>

                    <button
                      onClick={() => handleDeEnroll(enroll._id)}
                      disabled={
                        event?.winners?.length > 0 ||
                        event?.status === "cancelled"
                      }
                      className={`px-3 py-2 rounded-lg text-xs sm:text-sm transition w-full text-center ${
                        event?.winners?.length > 0 ||
                        event?.status === "cancelled"
                          ? "bg-gray-500/20 text-[color:var(--secondary)] cursor-not-allowed"
                          : "bg-red-500/20 text-[color:var(--foreground)] hover:bg-red-500/30 hover:text-[color:var(--secondary)]"
                      }`}
                    >
                      {event?.winners?.length > 0
                        ? "Completed 🎉"
                        : event?.status === "cancelled"
                        ? "Cancelled ❌"
                        : "Remove"}
                    </button>
                  </div>
                </li>
              );
            })
          ) : (
            <p className="text-center text-[color:var(--secondary)] col-span-full italic mt-6">
              No enrollments found for you.
            </p>
          )}
        </ul>
      </div>
    </section>
  );
}
