import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import Event from "@/models/Event";

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

  // 2. Get all enrolled events
  const enrollments = await Enrollment.find({ studentId: student._id }).populate("eventId");
  if (!enrollments.length) {
    return NextResponse.json({ error: "No enrolled events found" }, { status: 404 });
  }

  // 3. Collect event titles, festName, and dates
  const eventTitles = enrollments.map((enroll) => enroll.eventId.title + " , ");
  const festName = enrollments[0].eventId.festName || "TechFest 2025";
  
  const allDates = enrollments.map((e) => new Date(e.eventId.date));
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));
  const dateRange = `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`;

  // 4. Generate certificate ID from festId + student._id
  const certId = `CF-${festId}-${student._id.toString().slice(-5)}`;

  // 5. Return response
  return NextResponse.json({
    name: student.name,
    festName,
    dateRange,
    events: eventTitles,
    certId,
    issuedOn: new Date().toDateString(),
  });
}
