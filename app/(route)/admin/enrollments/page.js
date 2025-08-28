"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Calendar, UserCircle } from "lucide-react";

export default function EnrolledInTeam() {
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | solo | team
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await axios.get("/api/admin/enrollments");
        setEnrollments(res.data || []);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  // Handle filters + search
  const filteredEnrollments = enrollments
    .filter((enroll) => {
      if (filter === "solo") return enroll.participants?.length === 1;
      if (filter === "team") return enroll.participants?.length > 1;
      return true;
    })
    .filter((enroll) => {
      const query = search.toLowerCase();
      return (
        enroll.eventDetails?.name?.toLowerCase().includes(query) ||
        enroll.registeredBy?.name?.toLowerCase().includes(query)
      );
    });

  return (
    <div className="max-w-7xl mx-auto md:p-6 p-3">
      <h1 className="text-3xl font-bold text-center mb-6">
        Total Enrollments ({enrollments.length})
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {["all", "solo", "team"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              filter === type
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type === "all" && "All"}
            {type === "solo" && "Solo (1)"}
            {type === "team" && "Team (>1)"}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search by event or student"
          className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Stats */}
      <p className="text-lg font-semibold text-center mb-6">
        Showing {filteredEnrollments.length} of {enrollments.length} enrollments
      </p>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-gray-500 col-span-full">
          Loading enrollments...
        </p>
      )}

      {/* Enrollment Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.length > 0 ? (
            filteredEnrollments.map((enroll) => (
              <div
                key={enroll._id}
                className="p-5 border rounded-2xl shadow hover:shadow-lg transition bg-white"
              >
                {/* Event Info */}
                <div className="flex flex-col items-center mb-4 text-center">
                  <Calendar className="w-10 h-10 text-blue-500 mb-2" />
                  <h2 className="text-lg font-semibold">
                    {enroll.eventDetails?.name || "Untitled Event"}
                  </h2>
                  {enroll.eventDetails?.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {enroll.eventDetails.description}
                    </p>
                  )}
                  {enroll.eventDetails?.date && (
                    <p className="text-sm text-gray-500">
                      📅 {enroll.eventDetails.date}
                    </p>
                  )}
                  {enroll.eventDetails?.venue && (
                    <p className="text-sm text-gray-500">
                      📍 {enroll.eventDetails.venue}
                    </p>
                  )}
                </div>

                {/* Team Name */}
                {enroll.teamName && (
                  <div className="mt-2 text-sm text-gray-700 text-center">
                    <span className="font-medium">Team:</span> {enroll.teamName}
                  </div>
                )}

                {/* Registered By */}
                <div className="text-sm mt-3 flex items-center gap-2 text-gray-700">
                  <UserCircle className="w-4 h-4 text-blue-500" />
                  <span>
                    Registered by:{" "}
                    <span className="font-medium">
                      {enroll.registeredBy?.name}
                    </span>{" "}
                    ({enroll.registeredBy?.email})
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
                          {p.name} <span className="text-gray-400">({p.email})</span>
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
      )}
    </div>
  );
}
