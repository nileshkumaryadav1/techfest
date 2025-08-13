"use client";

import useMyTeam from "@/hooks/useMyTeam";
import { useState, useEffect } from "react";

export default function CreateTeamForm() {
  const [teamName, setTeamName] = useState("");
  const [festIds, setFestIds] = useState("");
  const [loading, setLoading] = useState(false);
  const { mutate } = useMyTeam();
  const [student, setStudent] = useState(null);

  // Safely load student from localStorage on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("student"));
        setStudent(stored || null);
      } catch (err) {
        console.error("Failed to parse student from localStorage:", err);
        setStudent(null);
      }
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!teamName.trim()) {
      return alert("Please enter a team name.");
    }

    if (!student?._id) {
      return alert("Student data not found. Please log in again.");
    }

    const membersFestIds = festIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      const res = await fetch("/api/team/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student, teamName, membersFestIds }),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.error || "Failed to create team");
      }

      alert("✅ Team created successfully!");
      setTeamName("");
      setFestIds("");
      mutate(); // Refresh team data
    } catch (err) {
      console.error("Create team error:", err);
      alert("❌ An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        type="text"
        className="border p-2 rounded w-full"
        placeholder="Team name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        disabled={loading}
      />
      <input
        type="text"
        className="border p-2 rounded w-full"
        placeholder="Member Fest IDs (comma separated)"
        value={festIds}
        onChange={(e) => setFestIds(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        className={`bg-[var(--accent)] text-white px-4 py-2 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Team"}
      </button>
    </form>
  );
}
