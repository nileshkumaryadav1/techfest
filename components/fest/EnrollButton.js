"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Users } from "lucide-react";

/**
 * EnrollButton Component
 *
 * Handles enrollment for:
 * - Solo events (instant enroll)
 * - Team events (open modal, collect team info, then enroll)
 *
 * Props:
 * - eventId: string (required)
 * - type: string ("single" | "team")
 */
export default function EnrollButton({ eventId, type, isEnrolled }) {
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([""]); // festIds entered by leader

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }
  }, []);

  // -------------------- Solo Enroll --------------------
  const handleSoloEnroll = async () => {
    if (!student?._id) {
      alert("Please login to enroll in this event.");
      router.push("/login");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          registeredBy: student._id, // DB id
          teamName: null,
          participants: [], // ✅ empty → API will add leader automatically
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Enrollment failed");

      setStatus("success");
      alert("Enrolled successfully!");
      router.refresh();
    } catch (err) {
      console.error("Enrollment error:", err);
      setStatus("error");
      alert("Enrollment failed: " + err.message);
    } finally {
      setStatus("idle");
    }
  };

  // -------------------- Team Enroll --------------------
  const handleTeamEnroll = async () => {
    if (!student?._id || !student?.festId) {
      alert("Please login to enroll in this event.");
      router.push("/login");
      return;
    }

    if (!teamName.trim()) {
      alert("Enter a team name.");
      return;
    }

    const filteredMembers = members.map((m) => m.trim()).filter(Boolean);

    if (filteredMembers.length === 0) {
      alert("Add at least one team member Fest ID.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          registeredBy: student._id, // DB id of leader
          teamName,
          participants: filteredMembers, // ✅ only festIds of members
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Team enrollment failed");

      setStatus("success");
      alert("Team enrolled successfully!");
      setShowTeamModal(false);
      setTeamName("");
      setMembers([""]);
      router.refresh();
    } catch (err) {
      console.error("Team enrollment error:", err);
      setStatus("error");
      alert("Team enrollment failed: " + err.message);
    } finally {
      setStatus("idle");
    }
  };

  // -------------------- UI --------------------
  if (isEnrolled) {
    return (
      <button className="px-4 py-2 bg-green-600 text-white rounded-full cursor-not-allowed">
        Already Enrolled
      </button>
    );
  }

  if (type === "single") {
    return (
      <button
        onClick={handleSoloEnroll}
        disabled={status === "loading"}
        className="px-4 py-2 bg-blue-600 text-white rounded-full cursor-pointer"
      >
        {status === "loading" ? (
          "Enrolling..."
        ) : (
          <div className="flex items-center justify-center">
            <User className="mr-2 w-4 h-4" />
            <span>Enroll</span>
          </div>
        )}
      </button>
    );
  }

  // Team enrollment button
  return (
    <>
      <button
        onClick={() => setShowTeamModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-full cursor-pointer"
      >
        <div className="flex items-center justify-center">
          <Users className="mr-2" />
          Enroll Team
        </div>
      </button>

      {showTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Team Enrollment</h2>

            {/* Team name input */}
            <input
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            {/* Member festId inputs */}
            <div className="space-y-2">
              {members.map((member, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder="Member Fest ID"
                  value={member}
                  onChange={(e) => {
                    const updated = [...members];
                    updated[idx] = e.target.value;
                    setMembers(updated);
                  }}
                  className="w-full border p-2 rounded"
                />
              ))}
            </div>

            {/* Add Member button */}
            <button
              onClick={() => setMembers([...members, ""])}
              className="mt-2 text-sm text-blue-600"
            >
              + Add Member
            </button>

            {/* Submit button */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowTeamModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleTeamEnroll}
                disabled={status === "loading"}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {status === "loading" ? "Enrolling..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
