"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Pencil, CalendarCheck, Trash2 } from "lucide-react";
import EnrolledEvents from "@/components/fest/EnrolledEvent";
import StudentInfo from "@/components/dashboard/StudentInfo";
import MyTeamCard from "@/components/dashboard/TeamComponent";
import CreateTeamForm from "@/components/fest/team/CreateTeamForm";

export default function DashboardPage() {
  const [student, setStudent] = useState(null);
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (!stored) {
      router.push("/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setStudent(parsed);

      fetch(`/api/student/${parsed._id}/events`)
        .then((res) => res.json())
        .then((data) => setEvents(data || []))
        .catch((err) => {
          console.error("Error fetching events", err);
          setEvents([]);
        });
    } catch (err) {
      console.error("Invalid student data", err);
      localStorage.removeItem("student");
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    const confirmed = confirm("🔒 Are you sure you want to logout?");
    if (!confirmed) return;

    try {
      localStorage.removeItem("student");
      router.replace("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Something went wrong during logout.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm("⚠️ This will permanently delete your account. Continue?");
    if (!confirmed || !student?._id) return;

    try {
      const res = await fetch(`/api/student/${student._id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Account deleted.");
        localStorage.removeItem("student");
        router.push("/register");
      } else {
        alert("Failed to delete account.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("An error occurred.");
    }
  };

  if (!student) {
    return (
      <main className="min-h-screen flex items-center justify-center text-[var(--foreground)] bg-[var(--background)]">
        <p className="text-sm">Loading your dashboard...</p>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-4 py-8 md:px-12 bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
          <h1 className="text-2xl font-bold text-[var(--highlight)]">
            Welcome, {student.name || student.email}
          </h1>

          <div className="flex flex-wrap gap-3 text-sm">
            <button
              onClick={() => router.push("/edit-profile")}
              className="flex items-center gap-1 px-3 py-1 rounded-md text-[var(--highlight)] border border-[var(--highlight)] hover:bg-[var(--highlight)] hover:text-[var(--background)] transition"
            >
              <Pencil size={16} /> Edit
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1 rounded-md text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition"
            >
              <LogOut size={16} /> Logout
            </button>

            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-1 px-3 py-1 rounded-md text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>

        {/* Student Info */}
        <section>
          <StudentInfo student={student} />
        </section>

        {/* Team Card */}
        <p>Teams:</p>
        <MyTeamCard />

        {/* Create Team */}
        <p>Create Team:</p>
        <CreateTeamForm />

        {/* Enrolled Events */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CalendarCheck size={20} /> Registered Events
          </h2>
          <EnrolledEvents studentId={student._id} />
        </section>
      </div>
    </main>
  );
}
