"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  UserCircle,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  XCircle,
} from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    axios
      .get("/api/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users", err));
  }, []);

  useEffect(() => {
    axios
      .get("/api/admin/enrollments")
      .then((res) => setEnrollments(res.data))
      .catch((err) => console.error("Error fetching enrollments", err));
  }, []);

  // Get events a user is enrolled in
  const getUserEvents = (user) => {
    return enrollments
      .filter((enrollment) =>
        enrollment.participants.some(
          (p) => p._id === user._id || p.email === user.email
        )
      )
      .map((enrollment) => enrollment.eventDetails?.name || "Unnamed Event");
  };

  return (
    <div className="max-w-7xl mx-auto md:p-6 p-3 bg-[color:var(--background)] text-[color:var(--foreground)]">
      {/* Header */}
      <h1 className="md:text-3xl text-2xl font-bold text-center mb-8 text-[color:var(--highlight)]">
        Registered Students ({users.length})
      </h1>

      {/* Search */}
      <div className="relative mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search by name"
          className="w-full px-4 py-2 rounded-xl border border-[color:var(--border)] bg-white/5 backdrop-blur placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-[color:var(--accent)] transition"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[color:var(--accent)] transition"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users
          .filter((user) =>
            user.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((user) => {
            const events = getUserEvents(user);

            return (
              <div
                key={user._id}
                className="p-6 border border-[color:var(--border)] rounded-2xl shadow-md bg-[color:var(--card)] backdrop-blur-md hover:shadow-lg hover:scale-[1.01] transition duration-300"
              >
                {/* User Header */}
                <div className="flex flex-col items-center mb-4">
                  <UserCircle className="w-14 h-14 text-[color:var(--accent)] mb-2" />
                  <h2 className="text-lg font-semibold text-[color:var(--foreground)] text-center">
                    {user.name}
                  </h2>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm border-t border-[color:var(--border)] pt-3">
                  <p className="flex items-center gap-2 text-[color:var(--secondary)]">
                    <Mail className="w-4 h-4 text-[color:var(--highlight)]" />
                    <span>{user.email}</span>
                  </p>
                  <p className="flex items-center gap-2 text-[color:var(--secondary)]">
                    <GraduationCap className="w-4 h-4 text-[color:var(--highlight)]" />
                    <span>{user.college}</span>
                  </p>
                  <p className="flex items-center gap-2 text-[color:var(--secondary)]">
                    <Phone className="w-4 h-4 text-[color:var(--highlight)]" />
                    <span>{user.phone}</span>
                  </p>
                </div>

                {/* Enrolled Events */}
                <div className="mt-5 border-t border-[color:var(--border)] pt-3">
                  <p className="text-sm font-medium text-[color:var(--accent)] flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    Enrolled Events ({events.length})
                  </p>
                  {events.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {events.map((event, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs bg-[color:var(--accent)]/10 text-[color:var(--accent)] border border-[color:var(--accent)]/30"
                        >
                          {event}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="italic text-xs text-[color:var(--secondary)]">
                      No events enrolled
                    </p>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
