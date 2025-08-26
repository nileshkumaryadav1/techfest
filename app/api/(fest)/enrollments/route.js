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

  const enrollments = await Enrollment.find({ participants: studentId }).populate("eventId");
  const enrolledEvents = enrollments
    .map((e) => e.eventId)
    .filter((e) => e && e._id); // Skip missing/deleted event references

  return NextResponse.json({ enrolledEvents });
}

export async function DELETE(req) {
  await connectDB();
  const { studentId, eventId } = await req.json();

  try {
    if (!studentId) {
      return NextResponse.json({ error: "Missing studentId" }, { status: 400 });
    }

    if (eventId) {
      // Remove a single event
      const deleted = await Enrollment.findOneAndDelete({ participants: studentId, eventId });
      if (!deleted) {
        return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "De-enrolled successfully" });
    } else {
      // Bulk remove all enrollments for this student
      const result = await Enrollment.deleteMany({ participants: studentId });
      return NextResponse.json({
        message: `De-enrolled from ${result.deletedCount} event(s)`,
      });
    }
  } catch (error) {
    console.error("De-enrollment error:", error);
    return NextResponse.json({ error: "Failed to de-enroll" }, { status: 500 });
  }
}
