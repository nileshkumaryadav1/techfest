// /api/admin/users/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import Event from "@/models/Event";

export async function GET() {
  await connectDB();

  const students = await Student.find().lean();

  const allEnrollments = await Enrollment.find()
    .populate("eventId") // populate the Event details
    .populate("participants") // populate all participants
    .populate("registeredBy") // populate the student who registered
    .lean();

  const allEvents = await Event.find().lean();

  // Map enrollments to each student
  const enrichedStudents = students.map((student) => {
    const enrolled = allEnrollments.filter(
      (enr) => enr.studentId?._id.toString() === student._id.toString()
    );
    const enrolledEventNames = enrolled.map((enr) => {
      const ev = allEvents.find(
        (e) => e._id.toString() === enr.eventId?._id.toString()
      );
      return ev?.title || "Unknown Event";
    });

    return {
      ...student,
      enrolledEvents: enrolledEventNames,
    };
  });

  return NextResponse.json(enrichedStudents);
}
