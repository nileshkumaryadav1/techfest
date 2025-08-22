// app/api/(fest)/certificate/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Student from "@/models/Student";
import Event from "@/models/Event";
import Enrollment from "@/models/Enrollment";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    let festId = searchParams.get("festId");

    if (!festId || !festId.trim()) {
      return NextResponse.json(
        { error: "Missing festId. Please provide a valid festId." },
        { status: 400 }
      );
    }

    festId = festId.trim().toLowerCase();
    await connectDB();

    // 1️⃣ Find student by festId (case-insensitive)
    const student = await Student.findOne({
      festId: new RegExp(`^${festId}$`, "i"),
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found. Please enter a valid festId." },
        { status: 404 }
      );
    }

    // 2️⃣ Find enrollments where this student is a participant or the main student
    const enrollments = await Enrollment.find({
      $or: [
        { studentId: student._id },       // single enrollment
        { participants: student._id },    // team enrollments
      ],
    }).populate("eventId");

    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json(
        { error: "No participation events found for this student." },
        { status: 404 }
      );
    }

    // 3️⃣ Extract unique event titles and dates
    const events = enrollments
      .map((en) => en.eventId)
      .filter(Boolean); // remove nulls

    const eventTitles = events.map((e) => e.title).filter(Boolean);

    const festName = events[0]?.festName || "TechFest 2025";

    const validDates = events
      .map((e) => new Date(e.date))
      .filter((d) => !isNaN(d));

    let dateRange = "Date not available";
    if (validDates.length > 0) {
      const minDate = new Date(Math.min(...validDates));
      const maxDate = new Date(Math.max(...validDates));
      dateRange =
        minDate.toDateString() === maxDate.toDateString()
          ? minDate.toDateString()
          : `${minDate.toDateString()} - ${maxDate.toDateString()}`;
    }

    // 4️⃣ Generate Certificate ID
    const certId = `PART-${festId.toUpperCase()}-${student._id
      .toString()
      .slice(-5)}`;

    // 5️⃣ Return response
    return NextResponse.json({
      name: student.name,
      festName,
      dateRange,
      events: eventTitles,
      certId,
      issuedOn: new Date().toDateString(),
      type: "participation",
    });
  } catch (error) {
    console.error("❌ Participation Certificate API Error:", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
