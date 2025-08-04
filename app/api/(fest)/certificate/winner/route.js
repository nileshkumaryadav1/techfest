// app/api/(fest)/certificate/winner/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Student from "@/models/Student";
import Event from "@/models/Event";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const festId = searchParams.get("festId");

    if (!festId) {
      return NextResponse.json({ error: "Missing festId" }, { status: 400 });
    }

    await connectDB();

    // 1️⃣ Find the student by festId
    const student = await Student.findOne({ festId });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // 2️⃣ Find all events where this student is a winner
    const winningEvents = await Event.find({ "winners._id": student._id });
    if (!winningEvents.length) {
      return NextResponse.json({ error: "No winning events found" }, { status: 404 });
    }

    // 3️⃣ Collect event titles
    const eventTitles = winningEvents
      .map((event) => event.title)
      .filter(Boolean);

    // 4️⃣ Consistent fest name (fallback included)
    const festName = winningEvents[0]?.festName || "TechFest 2025";

    // 5️⃣ Date range handling
    const validDates = winningEvents
      .map((e) => new Date(e.date))
      .filter((d) => !isNaN(d));

    const minDate = new Date(Math.min(...validDates));
    const maxDate = new Date(Math.max(...validDates));

    const dateRange =
      minDate.toDateString() === maxDate.toDateString()
        ? minDate.toDateString()
        : `${minDate.toDateString()} - ${maxDate.toDateString()}`;

    // 6️⃣ Generate a certificate ID
    const certId = `WIN-${festId.toUpperCase()}-${student._id.toString().slice(-5)}`;

    // 7️⃣ Return
    return NextResponse.json({
      name: student.name,
      festName,
      dateRange,
      events: eventTitles,
      certId,
      issuedOn: new Date().toDateString(),
      type: "winner", // optional for frontend to differentiate
    });
  } catch (error) {
    console.error("❌ Winner Certificate API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
