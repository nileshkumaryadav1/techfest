"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Pencil, Trash2 } from "lucide-react";
import EnrolledEvents from "@/components/fest/EnrolledEvent";
import StudentInfo from "@/components/dashboard/StudentInfo";
import EnrolledInTeam from "@/components/dashboard/EnrolledInTeam";

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
    if (!confirm("🔒 Are you sure you want to logout?")) return;
    localStorage.removeItem("student");
    router.replace("/login");
  };

  const handleDeleteAccount = async () => {
    if (!confirm("⚠️ This will permanently delete your account. Continue?"))
      return;
    if (!student?._id) return;

    try {
      const res = await fetch(`/api/student/${student._id}`, {
        method: "DELETE",
      });
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
    <main className="min-h-screen px-4 py-6 sm:px-6 md:px-12 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--foreground)] break-words">
            Welcome, {student.name || student.email}
          </h1>
          <div className="flex flex-wrap w-full md:w-auto gap-2 sm:gap-3 text-sm">
            <button
              onClick={() => router.push("/edit-profile")}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg w-full sm:w-auto bg-cyan-500/20 text-[var(--secondary)] hover:bg-cyan-500/30 transition"
            >
              <Pencil size={16} /> Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg w-full sm:w-auto bg-red-500/20 text-red-600 hover:bg-red-500/30 transition"
            >
              <LogOut size={16} /> Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg w-full sm:w-auto bg-red-600/20 text-red-400 hover:bg-red-600/30 transition"
            >
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>

        {/* Student Info */}
        <section>
          <StudentInfo student={student} />
        </section>

        {/* Enrolled Events */}
        <section>
          {/* <EnrolledEvents studentId={student._id} /> */}
        </section>

        {/* Teams */}
        <section className="p-5 sm:p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-lg space-y-4">
          {/* <h2 className="text-base sm:text-lg font-semibold text-[var(--foreground)]">
            Teams
          </h2> */}
          <EnrolledInTeam />
        </section>
      </div>
    </main>
  );
}
