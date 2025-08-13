"use client";
import { useState } from "react";

export default function RegisterButton({ eventId, teams = [] }) {
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");

  async function register() {
    if (loading || registered) return;

    // ✅ If multiple teams, ensure user picked one
    if (teams.length > 1 && !selectedTeam) {
      alert("Please select a team to register with.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/event/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // include cookies
        body: JSON.stringify({
          eventId,
          ...(selectedTeam ? { teamId: selectedTeam } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      alert(
        `✅ Registered successfully${
          selectedTeam
            ? ` as team "${teams.find((t) => t._id === selectedTeam)?.name}"`
            : ""
        }!`
      );
      setRegistered(true);
    } catch (err) {
      console.error("Event registration error:", err);
      alert("❌ An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {teams.length > 1 && !registered && (
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>
      )}

      <button
        onClick={register}
        disabled={loading || registered}
        className={`px-4 py-2 rounded-lg text-white font-medium shadow-sm transition-all duration-200
    ${
      registered
        ? "bg-green-500 cursor-not-allowed"
        : loading
        ? "bg-[var(--accent)] opacity-60 cursor-wait"
        : "bg-[var(--accent)] hover:brightness-110 hover:scale-[1.02]"
    }`}
        aria-disabled={loading || registered}
      >
        {loading
          ? "⏳ Registering..."
          : registered
          ? "✅ Registered"
          : "👆 Register"}
      </button>
    </div>
  );
}
