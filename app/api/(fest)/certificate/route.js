import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import Event from "@/models/Event";
// import Fest from "@/models/Fest";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const festId = searchParams.get("festId");

  if (!festId) {
    return NextResponse.json({ error: "Missing festId" }, { status: 400 });
  }

  await connectDB();

  // 1. Find student by festId
  const student = await Student.findOne({ festId });
  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  // 2. Find enrollments by student._id
  const enrollments = await Enrollment.find({ studentId: student._id }).populate("eventId");
  if (!enrollments.length) {
    return NextResponse.json({ error: "No enrolled events found" }, { status: 404 });
  }

  // For demo, pick only one event. For multiple certificates, use map logic.
  const event = enrollments[0].eventId;

  // 3. Respond with certificate data
  return NextResponse.json({
    name: student.name,
    eventName: event.title,
    festName: event.festName || "TechFest 2025", // fallback
    date: new Date(event.date).toDateString(),
    certId: `CF-${festId}-${event._id.toString().slice(-5)}`,
  });
}
