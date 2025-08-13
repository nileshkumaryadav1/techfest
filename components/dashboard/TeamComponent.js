"use client";

import useMyTeam from "@/hooks/useMyTeam";
import { useState } from "react";

export default function MyTeamCard() {
  const { team, isLeader, mutate, isLoading } = useMyTeam();
  const [festId, setFestId] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  if (isLoading) return <p>Loading team...</p>;
  if (!team) return <p>No team yet.</p>;

  // Add a member by Fest ID
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

  // Remove a member
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

  // Leave the team
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

  // Delete the team
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
    <div className="border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{team.teamName}</h3>
        {isLeader && (
          <button
            onClick={deleteTeam}
            className={`text-red-600 ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={actionLoading}
          >
            Delete Team
          </button>
        )}
      </div>

      <ul className="mt-3 space-y-1">
        {team.members.map((m) => (
          <li key={m._id} className="flex items-center justify-between">
            <span>
              {m.name} ({m.festId}) {String(m._id) === String(team.leaderId) ? "👑" : ""}
            </span>
            {isLeader && String(m._id) !== String(team.leaderId) && (
              <button
                onClick={() => removeMember(m._id)}
                className={`text-sm text-red-600 ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={actionLoading}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      {!isLeader && (
        <button
          onClick={leaveTeam}
          className={`mt-4 text-red-600 ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={actionLoading}
        >
          Leave Team
        </button>
      )}

      {isLeader && (
        <div className="mt-4 flex gap-2">
          <input
            className="border p-2 rounded flex-1"
            placeholder="Add member by Fest ID"
            value={festId}
            onChange={(e) => setFestId(e.target.value)}
            disabled={actionLoading}
          />
          <button
            onClick={addMember}
            className={`bg-[var(--accent)] text-white px-3 rounded ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={actionLoading}
          >
            {actionLoading ? "Processing..." : "Add"}
          </button>
        </div>
      )}
    </div>
  );
}
