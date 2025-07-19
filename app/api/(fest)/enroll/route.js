import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Enrollment from "@/models/Enrollment";

export async function POST(req) {
  try {
    const { eventId, studentId } = await req.json();

    console.log("📥 Received enrollment request:", { eventId, studentId });

    if (!eventId || !studentId) {
      return NextResponse.json(
        { error: "Missing eventId or studentId" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check for duplicate enrollment
    const alreadyEnrolled = await Enrollment.findOne({ eventId, studentId });

    if (alreadyEnrolled) {
      return NextResponse.json(
        { message: "Already enrolled in this event." },
        { status: 409 }
      );
    }

    // Create enrollment
    const enrollment = await Enrollment.create({ eventId, studentId });

    console.log("✅ Enrolled successfully:", enrollment);

    return NextResponse.json(
      { message: "Enrollment successful!" },
      { status: 200 }
    );

  } catch (err) {
    console.error("❌ Enrollment error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
