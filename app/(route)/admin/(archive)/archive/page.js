"use client";

import { FestData } from "@/data/FestData";
import { useEffect, useState, useMemo } from "react";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AdminArchivePage() {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    setAdmin(adminData);
  }, []);

  /** 🔹 Fetch archived data from DB */
  const fetchArchives = async () => {
    try {
      const res = await fetch("/api/admin/fest-archive");
      if (!res.ok) throw new Error("Failed to fetch archives");
      const data = await res.json();
      setArchives(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  /** 🔹 Archive a fest */
  const handleArchive = async (fest) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/fest-archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fest),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to archive fest");
      }

      const saved = await res.json();
      setArchives((prev) => [...prev, saved]); // sync state
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Delete an archived fest */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this archive?")) return;
    try {
      const res = await fetch("/api/admin/fest-archive", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (!res.ok) throw new Error("Failed to delete archive");
      setArchives((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  /** 🔹 Convert FestData (object) → array, then check archives */
  // const availableFests = useMemo(() => {
  //   const archivedNames = new Set(archives.map((a) => a.name));
  //   const festArray = [FestData]; // 👈 wrap single object into array
  //   return festArray.filter((fest) => !archivedNames.has(fest.name));
  // }, [archives]);

  /** 🔹 Convert FestData (object) → array, then check archives */
  const availableFests = useMemo(() => {
    // create a unique key like "7/2025"
    const archivedDates = new Set(archives.map((a) => `${a.month}/${a.year}`));

    const festArray = [FestData]; // 👈 wrap single object into array

    // compare using month/year
    return festArray.filter(
      (fest) => !archivedDates.has(`${fest.month}/${fest.year}`)
    );
  }, [archives]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:py-10 py-2">
      <h1 className="text-3xl font-bold text-center md:mb-10 mb-4">
        Admin Archive Page
      </h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* 🔹 FestData List (ready to archive) */}
      <h2 className="text-2xl font-semibold mb-6">Available Fests</h2>
      {availableFests.length === 0 ? (
        <p className="text-[var(--foreground)] mb-10">✅ All fests are archived.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {availableFests.map((fest, i) => (
            <div
              key={i}
              className="bg-[var(--background)] p-6 rounded-xl shadow hover:shadow-md transition border border-[var(--border)]"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {fest.name}
              </h3>
              <p>
                {fest.month} / {fest.year} – {fest.theme}
              </p>
              <p className="text-sm text-[var(--secondary)]">{fest.tagline}</p>
              {admin?.role === "superadmin" && (
                <button
                  onClick={() => handleArchive(fest)}
                  disabled={loading}
                  className="mt-3 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  {loading ? "Archiving..." : "Archive This Fest"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Archived Fests */}
      <h2 className="text-2xl font-semibold mb-6">
        Archived Fests ({archives.length})
      </h2>
      {archives.length === 0 ? (
        <p className="text-gray-500">📦 No archives yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {archives.map((archive) => (
            <div
              key={archive._id}
              className="bg-[var(--background)] p-6 rounded-2xl shadow hover:shadow-lg transition border border-[var(--border)]"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {archive.name}
              </h3>
              <p>
                <strong>Year:</strong> {archive.month} / {archive.year}
              </p>
              {archive.theme && (
                <p>
                  <strong>Theme:</strong> {archive.theme}
                </p>
              )}
              {archive.tagline && (
                <p>
                  <strong>Tagline:</strong> {archive.tagline}
                </p>
              )}
              {admin?.role === "superadmin" && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleDelete(archive._id)}
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
