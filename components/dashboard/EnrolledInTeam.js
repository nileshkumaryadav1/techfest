"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Calendar, UserCircle } from "lucide-react";

export default function EnrolledInTeam() {
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | solo | team

  useEffect(() => {
    axios
      .get("/api/admin/enrollments")
      .then((res) => setEnrollments(res.data))
      .catch((err) => console.error("Error fetching enrollments", err));
  }, []);

  // Filtered and searched enrollments
  const filteredEnrollments = enrollments
    .filter((enroll) => {
      if (filter === "solo") return enroll.participants?.length === 1;
      if (filter === "team") return enroll.participants?.length > 1;
      return true; // all
    })
    .filter(
      (enroll) =>
        enroll.eventDetails?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        enroll.registeredBy?.name?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="max-w-6xl mx-auto md:p-6 p-3">
      <h1 className="text-3xl font-bold text-center mb-6">
        Total Enrollments ({enrollments.length})
      </h1>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl font-semibold ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("solo")}
          className={`px-4 py-2 rounded-xl font-semibold ${
            filter === "solo"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Solo (1)
        </button>
        <button
          onClick={() => setFilter("team")}
          className={`px-4 py-2 rounded-xl font-semibold ${
            filter === "team"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Team (&gt;1)
        </button>
      </div>

      <p className="text-xl font-bold text-center mb-6">
        Sorted Enrollments: {filteredEnrollments.length}
      </p>
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search by event or student"
        className="w-full px-4 py-3 mb-6 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Enrollment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEnrollments.length > 0 ? (
          filteredEnrollments.map((enroll) => (
            <div
              key={enroll._id}
              className="p-5 border rounded-2xl shadow hover:shadow-lg transition-shadow bg-white"
            >
              {/* Event Info */}
              <div className="flex flex-col items-center mb-4 text-center">
                <Calendar className="w-10 h-10 text-blue-500 mb-2" />
                <h2 className="text-lg font-semibold">
                  {enroll.eventDetails?.name}
                </h2>
                {enroll.eventDetails?.description && (
                  <p className="text-sm text-gray-500">
                    {enroll.eventDetails.description}
                  </p>
                )}
                {enroll.eventDetails?.date && (
                  <p className="text-sm text-gray-500">
                    {enroll.eventDetails.date}
                  </p>
                )}
                {enroll.eventDetails?.venue && (
                  <p className="text-sm text-gray-500">
                    {enroll.eventDetails.venue}
                  </p>
                )}
              </div>

              {/* Team Info */}
              {enroll.teamName && (
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Team:</span> {enroll.teamName}
                </div>
              )}

              {/* Registered By */}
              <div className="text-sm mt-2 flex items-center gap-2 text-gray-700">
                <UserCircle className="w-4 h-4 text-blue-500" />
                <span>
                  Registered by: {enroll.registeredBy?.name} (
                  {enroll.registeredBy?.email})
                </span>
              </div>

              {/* Participants */}
              <div className="mt-3">
                <p className="text-sm font-medium flex items-center gap-2 mb-2 text-gray-700">
                  <Users className="w-4 h-4" />
                  Participants ({enroll.participants?.length || 0})
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 pl-2 text-gray-600">
                  {enroll.participants?.length > 0 ? (
                    enroll.participants.map((p, idx) => (
                      <li key={idx}>
                        {p.name} ({p.email})
                      </li>
                    ))
                  ) : (
                    <li className="italic text-gray-400">No participants</li>
                  )}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No enrollments found.
          </p>
        )}
      </div>
    </div>
  );
}
