"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserCircle, Mail, Phone, GraduationCap, Calendar } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("/api/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users", err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto md:p-6 p-3 bg-[color:var(--background)] text-[color:var(--foreground)]">
      {/* Header */}
      <h1 className="md:text-3xl text-2xl font-bold text-center mb-6 text-[color:var(--highlight)]">
        Registered Students ({users.length})
      </h1>

      {/* Search */}
      <input
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search by name"
        className="w-full px-4 py-2 mb-8 rounded-xl border border-[color:var(--border)] bg-white/5 backdrop-blur placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-[color:var(--accent)] transition"
      />

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users
          .filter((user) =>
            user.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((user) => (
            <div
              key={user._id}
              className="p-5 border border-[color:var(--border)] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] bg-[color:var(--card)] backdrop-blur-md hover:scale-[1.01] transition"
            >
              {/* User Header */}
              <div className="flex flex-col items-center mb-4">
                <UserCircle className="w-12 h-12 text-[color:var(--accent)] mb-2" />
                <h2 className="text-lg font-semibold text-[color:var(--foreground)] text-center">
                  {user.name}
                </h2>
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm">
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
              <div className="mt-4">
                <p className="text-sm font-medium text-[color:var(--accent)] flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Enrolled Events ({user.enrolledEvents?.length || 0})
                </p>
                <ul className="list-disc list-inside text-xs text-[color:var(--foreground)] mt-2 space-y-1 pl-2">
                  {user.enrolledEvents?.length > 0 ? (
                    user.enrolledEvents.map((event, idx) => (
                      <li key={idx} className="text-[color:var(--secondary)]">
                        {event}
                      </li>
                    ))
                  ) : (
                    <li className="italic text-[color:var(--secondary)]">
                      None
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
