// app/api/enrollments/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Enrollment from "@/models/Enrollment";
import Event from "@/models/Event";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json({ error: "Missing studentId" }, { status: 400 });
  }

  await connectDB();
  const enrollments = await Enrollment.find({ studentId }).populate("eventId");
  const enrolledEvents = enrollments.map((e) => e.eventId);

  return NextResponse.json({ enrolledEvents });
}

export async function DELETE(req) {
  await connectDB();
  const { studentId, eventId } = await req.json();

  try {
    const deleted = await Enrollment.findOneAndDelete({ studentId, eventId });
    if (!deleted) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "De-enrolled successfully" });
  } catch (error) {
    console.error("De-enrollment error:", error);
    return NextResponse.json({ error: "Failed to de-enroll" }, { status: 500 });
  }
}
