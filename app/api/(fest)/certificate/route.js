// /api/(fest)/certificate/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import Event from "@/models/Event";

export async function GET(req) {
  try {
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

    // 2. Get all enrolled events (with event data populated)
    const enrollments = await Enrollment.find({ studentId: student._id }).populate("eventId");
    if (!enrollments.length) {
      return NextResponse.json({ error: "No enrolled events found" }, { status: 404 });
    }

    // 3. Collect event details
    const eventTitles = enrollments
      .map((enroll) => enroll.eventId?.title)
      .filter(Boolean); // skip if any event is missing

    const festName = enrollments[0].eventId?.festName || "TechFest 2025";

    // 4. Find the range of event dates
    const validDates = enrollments
      .map((e) => new Date(e.eventId?.date))
      .filter((d) => !isNaN(d));

    const minDate = new Date(Math.min(...validDates));
    const maxDate = new Date(Math.max(...validDates));

    const dateRange = minDate.toDateString() === maxDate.toDateString()
      ? minDate.toDateString()
      : `${minDate.toDateString()} - ${maxDate.toDateString()}`;

    // 5. Generate certificate ID
    const certId = `CF-${festId.toUpperCase()}-${student._id.toString().slice(-5)}`;

    // 6. Return certificate details
    return NextResponse.json({
      name: student.name,
      festName,
      dateRange,
      events: eventTitles,
      certId,
      issuedOn: new Date().toDateString(),
    });
  } catch (error) {
    console.error("❌ Certificate Generation Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
