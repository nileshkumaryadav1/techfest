import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";

export async function GET(req) {
  try {
    const url = new URL(req.url, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000");
    const festId = url.searchParams.get("festId");

    if (!festId) {
      return NextResponse.json({ error: "Missing festId" }, { status: 400 });
    }

    await connectDB();

    // 1. Find student
    const student = await Student.findOne({ festId: festId.toLowerCase() });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // 2. Find enrollments + populate
    const enrollments = await Enrollment.find({ studentId: student._id }).populate("eventId");
    if (!enrollments.length) {
      return NextResponse.json({ error: "No enrolled events found" }, { status: 404 });
    }

    // 3. Event titles
    const eventTitles = enrollments.map(e => e.eventId?.title).filter(Boolean);
    if (!eventTitles.length) {
      return NextResponse.json({ error: "No event titles found" }, { status: 404 });
    }

    const festName = enrollments[0].eventId?.festName || "TechFest 2025";

    // 4. Event dates
    const validDates = enrollments
      .map(e => new Date(e.eventId?.date))
      .filter(d => !isNaN(d));

    let dateRange = "Date not available";
    if (validDates.length > 0) {
      const minDate = new Date(Math.min(...validDates));
      const maxDate = new Date(Math.max(...validDates));
      dateRange = minDate.toDateString() === maxDate.toDateString()
        ? minDate.toDateString()
        : `${minDate.toDateString()} - ${maxDate.toDateString()}`;
    }

    // 5. Certificate ID
    const certId = `CF-${festId.toUpperCase()}-${student._id.toString().slice(-5)}`;

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
