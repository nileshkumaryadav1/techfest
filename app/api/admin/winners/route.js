import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Event from "@/models/Event";
import Enrollment from "@/models/Enrollment";
import Student from "@/models/Student";

// 🔹 GET: Fetch all events with enrolled students and winners
export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().lean();
    const enrollments = await Enrollment.find().populate("studentId").lean();

    const enrollmentMap = {};
    enrollments.forEach((e) => {
      const eid = e.eventId?.toString();
      const student = e.studentId;

      if (!eid || !student || !student._id) return;

      if (!enrollmentMap[eid]) enrollmentMap[eid] = [];

      enrollmentMap[eid].push({
        _id: student._id,
        name: student.name,
        phone: student.phone,
        email: student.email,
        festId: student.festId,
      });
    });

    const fullData = events.map((event) => ({
      _id: event._id,
      title: event.title,
      category: event.category,
      venue: event.venue,
      date: event.date,
      time: event.time,
      coordinators: event.coordinators,
      enrolledStudents: enrollmentMap[event._id.toString()] || [],
      enrolledCount: (enrollmentMap[event._id.toString()] || []).length,
      winners: event.winners || [],
    }));

    return NextResponse.json({ success: true, events: fullData });
  } catch (err) {
    console.error("GET /api/admin/winners error:", err);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// 🔹 PATCH: Replace the winner list entirely
export async function PATCH(req) {
  try {
    await connectDB();
    const { eventId, winners } = await req.json();

    if (!eventId || !Array.isArray(winners)) {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    const enrolledIds = await Enrollment.find({ eventId }).distinct("studentId");
    const enrolledSet = new Set(enrolledIds.map(String));

    const isValid = winners.every((w) => enrolledSet.has(w._id));
    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: "One or more winners are not enrolled for this event.",
      }, { status: 400 });
    }

    event.winners = winners;
    await event.save();

    return NextResponse.json({
      success: true,
      message: "Winners replaced successfully",
      updatedEvent: {
        _id: event._id,
        title: event.title,
        winners: event.winners,
      },
    });
  } catch (err) {
    console.error("PATCH /api/admin/winners error:", err);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// 🔹 PUT: Add winners to existing list
export async function PUT(req) {
  try {
    await connectDB();
    const { eventId, winners } = await req.json();

    if (!eventId || !Array.isArray(winners)) {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    const enrolledIds = await Enrollment.find({ eventId }).distinct("studentId");
    const enrolledSet = new Set(enrolledIds.map(String));

    const isValid = winners.every((w) => enrolledSet.has(w._id));
    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: "One or more winners are not enrolled in the event.",
      }, { status: 400 });
    }

    const existingMap = new Map(event.winners.map(w => [w._id.toString(), w]));
    winners.forEach(w => existingMap.set(w._id.toString(), w));

    event.winners = Array.from(existingMap.values());
    await event.save();

    return NextResponse.json({
      success: true,
      message: "Winners added successfully",
      updatedEvent: {
        _id: event._id,
        title: event.title,
        winners: event.winners,
      },
    });
  } catch (err) {
    console.error("PUT /api/admin/winners error:", err);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// 🔹 DELETE: Remove all winners from an event
export async function DELETE(req) {
  try {
    await connectDB();
    const { eventId } = await req.json();

    if (!eventId) {
      return NextResponse.json({ success: false, message: "Event ID required" }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    event.winners = [];
    await event.save();

    return NextResponse.json({
      success: true,
      message: "Winners cleared successfully",
    });
  } catch (err) {
    console.error("DELETE /api/admin/winners error:", err);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
