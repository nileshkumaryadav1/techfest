"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Pencil, CalendarCheck } from "lucide-react";
import EnrolledEvents from "@/components/fest/EnrolledEvent";
import EnrolledInTeam from "@/components/dashboard/EnrolledInTeam";

export default function DashboardPage() {
  const [student, setStudent] = useState(null);
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");

    if (!storedStudent) {
      router.push("/login");
      return;
    }

    try {
      const parsed = JSON.parse(storedStudent);
      setStudent(parsed);

      // Fetch registered events
      fetch(`/api/student/${parsed._id}/events`)
        .then((res) => res.json())
        .then((data) => setEvents(data || []))
        .catch((err) => {
          console.error("Error fetching events", err);
          setEvents([]);
        });
    } catch (err) {
      console.error("Invalid student data in localStorage", err);
      localStorage.removeItem("student");
      router.push("/login");
    }
  }, [router]);

  if (!student) {
    return (
      <main className="min-h-screen flex items-center justify-center text-[var(--foreground)] bg-[var(--background)]">
        <p className="text-center text-sm">Loading your Registered Events...</p>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-4 py-8 md:px-12"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <section>
          {/* <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CalendarCheck size={20} /> Registered Events
          </h2> */}

          <EnrolledEvents studentId={student._id} />
        </section>
        <section>
          <EnrolledInTeam />
        </section>
      </div>
    </main>
  );
}
