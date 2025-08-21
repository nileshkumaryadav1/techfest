"use client";

import useMyTeam from "@/hooks/useMyTeam";
import { useState } from "react";

export default function MyTeamCard() {
  const { team, isLeader, mutate, isLoading } = useMyTeam();
  const [festId, setFestId] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  if (isLoading) return <p>Loading team...</p>;
  if (!team) return <p className="text-center text-[color:var(--secondary)]">No team yet 🚀</p>;

  // Add Member
  async function addMember() {
    if (!festId.trim()) return alert("Please enter a valid Fest ID.");
    setActionLoading(true);
    try {
      const res = await fetch("/api/team/add-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ festId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add member");
      setFestId("");
      mutate();
      alert("✅ Member added successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  // Remove Member
  async function removeMember(userId) {
    if (!confirm("Remove this member?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/team/remove-member/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove member");
      mutate();
      alert("✅ Member removed successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  // Leave Team
  async function leaveTeam() {
    if (!confirm("Leave team?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/team/leave`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to leave team");
      mutate();
      alert("✅ You left the team.");
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  // Delete Team
  async function deleteTeam() {
    if (!confirm("Delete entire team? This cannot be undone.")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/team/delete/${team._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete team");
      mutate();
      alert("✅ Team deleted successfully.");
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="p-5 sm:p-6 rounded-3xl border border-[color:var(--border)] bg-gradient-to-br from-[color:var(--card)] to-[color:var(--background)] shadow-xl max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-[color:var(--foreground)] flex items-center gap-2">
          👥 {team.teamName}
        </h3>
        {isLeader && (
          <button
            onClick={deleteTeam}
            disabled={actionLoading}
            className={`px-4 py-1.5 text-sm rounded-full bg-red-500/20 text-red-600 hover:bg-red-500/30 transition ${
              actionLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Delete Team
          </button>
        )}
      </div>

      {/* Members */}
      <ul className="space-y-3">
        {team.members.map((m) => (
          <li
            key={m._id}
            className="flex items-center justify-between bg-[color:var(--card)] border border-[color:var(--border)] p-3 rounded-xl shadow-sm"
          >
            <span className="text-sm sm:text-base text-[color:var(--foreground)]">
              {m.name} <span className="text-[color:var(--secondary)]">({m.festId})</span>{" "}
              {String(m._id) === String(team.leaderId) && "👑"}
            </span>

            {isLeader && String(m._id) !== String(team.leaderId) && (
              <button
                onClick={() => removeMember(m._id)}
                disabled={actionLoading}
                className={`px-3 py-1 text-xs sm:text-sm rounded-full bg-red-500/20 text-red-600 hover:bg-red-500/30 transition ${
                  actionLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Leave button for members */}
      {!isLeader && (
        <button
          onClick={leaveTeam}
          disabled={actionLoading}
          className={`mt-5 w-full px-4 py-2 rounded-xl bg-red-500/20 text-red-600 hover:bg-red-500/30 transition ${
            actionLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Leave Team
        </button>
      )}

      {/* Add Member (leader only) */}
      {isLeader && (
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <input
            className="border border-[color:var(--border)] p-2 rounded-xl flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
            placeholder="Enter Fest ID to add member"
            value={festId}
            onChange={(e) => setFestId(e.target.value)}
            disabled={actionLoading}
          />
          <button
            onClick={addMember}
            disabled={actionLoading}
            className={`px-4 py-2 rounded-xl bg-[var(--accent)] text-white font-medium shadow-md hover:opacity-90 transition ${
              actionLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {actionLoading ? "Processing..." : "Add"}
          </button>
        </div>
      )}
    </div>
  );
}
