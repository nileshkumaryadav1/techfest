import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Event from "@/models/Event";
import Enrollment from "@/models/Enrollment";
import Student from "@/models/Student";

// 🔹 GET: Fetch all events with enrolled students and winners
export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().populate("winners", "name phone email").lean();
    const enrollments = await Enrollment.find().populate("studentId").lean();

    const enrollmentMap = {};
enrollments.forEach((e) => {
  const eid = e.eventId?.toString();
  const student = e.studentId;

  // Skip if student doesn't exist
  if (!eid || !student || !student._id) return;

  if (!enrollmentMap[eid]) enrollmentMap[eid] = [];

  enrollmentMap[eid].push({
    _id: student._id,
    name: student.name,
    email: student.email,
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
    const { eventId, winnerIds } = await req.json();

    if (!eventId || !Array.isArray(winnerIds)) {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    const enrolledIds = await Enrollment.find({ eventId }).distinct("studentId");

    const isValid = winnerIds.every((id) => enrolledIds.map(String).includes(id));
    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: "One or more winnerIds are not enrolled for this event.",
      }, { status: 400 });
    }

    event.winners = winnerIds;
    await event.save();

    const updated = await Event.findById(eventId).populate("winners", "name email").lean();

    return NextResponse.json({
      success: true,
      message: "Winners replaced successfully",
      updatedEvent: {
        _id: updated._id,
        title: updated.title,
        winners: updated.winners,
      },
    });
  } catch (err) {
    console.error("PATCH /api/admin/winners error:", err);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// 🔹 PUT: Add winner(s) to the existing list
export async function PUT(req) {
  try {
    await connectDB();
    const { eventId, winnerIds } = await req.json();

    if (!eventId || !Array.isArray(winnerIds)) {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    const enrolledIds = await Enrollment.find({ eventId }).distinct("studentId");

    const isValid = winnerIds.every((id) => enrolledIds.map(String).includes(id));
    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: "One or more winnerIds are not enrolled in the event.",
      }, { status: 400 });
    }

    // Add new unique winner IDs to existing list
    const existingIds = event.winners.map(String);
    const newWinners = [
      ...new Set([...existingIds, ...winnerIds.map(String)]),
    ];

    event.winners = newWinners;
    await event.save();

    const updated = await Event.findById(eventId).populate("winners", "name email").lean();

    return NextResponse.json({
      success: true,
      message: "Winners added successfully",
      updatedEvent: {
        _id: updated._id,
        title: updated.title,
        winners: updated.winners,
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
