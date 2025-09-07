// /api/admin/enrollments/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Enrollment from "@/models/Enrollment";

export async function GET() {
  await connectDB();

  try {
    const enrollments = await Enrollment.find()
      .populate("participants", "name email")
      .populate("registeredBy", "name email");

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  await connectDB();

  const { studentId, eventId, enrollmentId } = await req.json();

  try {
    if (enrollmentId) {
      // Delete by enrollmentId directly
      const deleted = await Enrollment.findByIdAndDelete(enrollmentId);
      if (!deleted) {
        return NextResponse.json(
          { error: "Enrollment not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: "Enrollment deleted successfully" });
    }

    if (!studentId) {
      return NextResponse.json({ error: "Missing studentId" }, { status: 400 });
    }

    if (eventId) {
      // Remove a single event for a student
      const deleted = await Enrollment.findOneAndDelete({
        participants: studentId,
        eventId,
      });
      if (!deleted) {
        return NextResponse.json(
          { error: "Enrollment not found" },
          { status: 404 }
        );
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
