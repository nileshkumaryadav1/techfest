"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EnrollButton({ eventId, type, isEnrolled }) {
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error | already
  const [showModal, setShowModal] = useState(false);

  // Team form states
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([""]);

  // Load student from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("student");
      if (stored) {
        try {
          setStudent(JSON.parse(stored));
        } catch (e) {
          console.error("Invalid student data in localStorage");
        }
      }
    }
  }, []);

  // Solo enrollment
  const handleSoloEnroll = async () => {
    if (!student?._id) {
      alert("Please login to enroll in this event.");
      router.push("/student/login");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          registeredBy: student._id,
          participants: [student._id],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data?.message?.includes("already")) setStatus("already");
        else {
          setStatus("error");
          alert(data.message || "Enrollment failed.");
        }
        return;
      }

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  // Team enrollment
  const handleTeamEnroll = async () => {
    if (!student?._id) {
      alert("Please login to enroll in this event.");
      router.push("/student/login");
      return;
    }

    if (!teamName.trim()) {
      alert("Enter a team name.");
      return;
    }

    const filteredMembers = members.map((m) => m.trim()).filter(Boolean);
    if (filteredMembers.length === 0) {
      alert("Add at least one team member ID.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          registeredBy: student._id,
          teamName,
          participants: [student._id, ...filteredMembers],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data?.message?.includes("already")) setStatus("already");
        else setStatus("error");
        return;
      }

      setStatus("success");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  // Render main button
  const renderButton = () => {
    if (status === "loading")
      return (
        <button
          disabled
          className="px-4 py-2 rounded-lg bg-gray-400 text-white cursor-not-allowed w-full md:w-auto"
        >
          Enrolling...
        </button>
      );

    if (status === "success" || isEnrolled)
      return (
        <button
          disabled
          className="bg-green-600 text-white px-6 py-2.5 rounded-full font-semibold w-full md:w-auto cursor-not-allowed"
        >
          ✅ Enrolled
        </button>
      );

    if (status === "already")
      return (
        <button
          disabled
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold w-full cursor-not-allowed"
        >
          Already Enrolled
        </button>
      );

    if (status === "error")
      return (
        <button
          onClick={
            type === "single" ? handleSoloEnroll : () => setShowModal(true)
          }
          className="px-4 py-2 rounded-lg bg-red-600 text-white w-full"
        >
          Retry Enroll
        </button>
      );

    // default
    return (
      <button
        onClick={
          type === "single" ? handleSoloEnroll : () => setShowModal(true)
        }
        className="bg-[var(--accent)] text-black px-6 py-2.5 rounded-full font-semibold hover:scale-105 transition-all w-full md:w-auto"
      >
        {type === "single" ? "🚀 Enroll in this Event" : "🚀 Register Team"}
      </button>
    );
  };

  return (
    <div className="my-4 flex flex-col items-start w-full">
      {renderButton()}

      {/* Team Enrollment Modal */}
      {showModal && type === "team" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Team Registration</h2>

            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team Name"
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />

            <div className="space-y-2">
              {members.map((m, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={m}
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers[idx] = e.target.value;
                    setMembers(newMembers);
                  }}
                  placeholder={`Member ${idx + 1} ID`}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ))}
            </div>

            <button
              onClick={() => setMembers([...members, ""])}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              + Add Member
            </button>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 rounded-lg bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleTeamEnroll}
                className="px-3 py-2 rounded-lg bg-indigo-600 text-white"
              >
                Submit Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
