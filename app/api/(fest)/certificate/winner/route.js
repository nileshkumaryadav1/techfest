// app/api/certificate/winner/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Student from "@/models/Student";
import Event from "@/models/Event";

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

    festId = festId.trim().toLowerCase(); // normalize festId
    await connectDB();

    // 🔎 Debug log
    console.log("🔍 Looking up student with festId:", festId);

    // 1️⃣ Find Student
    const student = await Student.findOne({
      festId: new RegExp(`^${festId}$`, "i"),
    });
    if (!student) {
      console.warn(`⚠️ No student found for festId=${festId}`);
      return NextResponse.json(
        { error: "Student not found. Please enter a valid festId." },
        { status: 404 }
      );
    }

    // 2️⃣ Find Events where this student is a winner
    let winningEvents = await Event.find({ "winners._id": student._id });

    // If not found, fallback to match by festId
    if (!winningEvents.length) {
      winningEvents = await Event.find({ "winners.festId": festId });
    }

    if (!winningEvents || winningEvents.length === 0) {
      console.warn(`⚠️ No winning events found for studentId=${student._id}`);
      return NextResponse.json(
        { error: "No winning events found for this student." },
        { status: 404 }
      );
    }

    // 3️⃣ Collect event titles
    const eventTitles = winningEvents.map((e) => e.title).filter(Boolean);

    // 4️⃣ Fest name (fallback to default)
    const festName = winningEvents[0]?.festName || "TechFest 2025";

    // 5️⃣ Handle dates safely
    const validDates = winningEvents
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

    // 6️⃣ Generate a Certificate ID
    const certId = `WIN-${festId.toUpperCase()}-${student._id
      .toString()
      .slice(-5)}`;

    // 7️⃣ Success Response
    return NextResponse.json({
      name: student.name,
      festName,
      dateRange,
      events: eventTitles,
      certId,
      issuedOn: new Date().toDateString(),
      type: "winner",
    });
  } catch (error) {
    console.error("❌ Winner Certificate API Error:", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
