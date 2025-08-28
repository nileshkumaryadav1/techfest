// /api/admin/winners/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Event from "@/models/Event";
import Enrollment from "@/models/Enrollment";

// ---------------------------------------------------------------------------
// GET: Return all events + enrolled students (flattened per event) + winners
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    await connectDB();

    // Pull only the fields you actually render
    const events = await Event.find(
      {},
      "title category venue date time coordinators winners"
    ).lean();

    // Pull minimal enrollment fields; populate participants with minimal fields
    const enrollments = await Enrollment.find(
      {},
      "eventId participants registeredBy"
    )
      .populate("participants", "name email phone festId")
      .lean();

    // Build: eventId -> Map(studentId -> studentObj) to de-duplicate
    const enrollmentMap = {};

    for (const e of enrollments) {
      const eid = e.eventId?.toString();
      if (!eid || !Array.isArray(e.participants)) continue;

      if (!enrollmentMap[eid]) enrollmentMap[eid] = new Map();

      for (const student of e.participants) {
        const sid = student?._id?.toString();
        if (!sid) continue;
        // Ensure unique student per event
        if (!enrollmentMap[eid].has(sid)) {
          enrollmentMap[eid].set(sid, {
            _id: student._id,
            name: student.name,
            phone: student.phone,
            email: student.email,
            festId: student.festId,
          });
        }
      }
    }

    const fullData = events.map((event) => {
      const list = Array.from(
        (enrollmentMap[event._id.toString()] || new Map()).values()
      );
      return {
        _id: event._id,
        title: event.title,
        category: event.category,
        venue: event.venue,
        date: event.date,
        time: event.time,
        coordinators: event.coordinators,
        enrolledStudents: list,
        enrolledCount: list.length,
        winners: event.winners || [],
      };
    });

    return NextResponse.json({ success: true, events: fullData });
  } catch (err) {
    console.error("GET /api/admin/winners error:", err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Helpers for PATCH/PUT
// ---------------------------------------------------------------------------
function normalizeWinnerId(w) {
  // Winners might be objects with _id, or plain ids; normalize to string
  const id = typeof w === "string" ? w : w?._id;
  return id ? String(id) : null;
}

// ---------------------------------------------------------------------------
// PATCH: Replace winners entirely (validate they are enrolled participants)
// ---------------------------------------------------------------------------
export async function PATCH(req) {
  try {
    await connectDB();
    const { eventId, winners } = await req.json();

    if (!eventId || !Array.isArray(winners)) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    // All enrolled student ids (from participants array)
    const enrolledIds = await Enrollment.find({ eventId }).distinct(
      "participants"
    );
    const enrolledSet = new Set(enrolledIds.map(String));

    const invalid = winners.find((w) => {
      const wid = normalizeWinnerId(w);
      return !wid || !enrolledSet.has(wid);
    });
    if (invalid) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more winners are not enrolled for this event.",
        },
        { status: 400 }
      );
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
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// PUT: Add winners (merge with existing; no duplicates; validate enrollment)
// ---------------------------------------------------------------------------
export async function PUT(req) {
  try {
    await connectDB();
    const { eventId, winners } = await req.json();

    if (!eventId || !Array.isArray(winners)) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    // Validate winners belong to enrolled participants
    const enrolledIds = await Enrollment.find({ eventId }).distinct(
      "participants"
    );
    const enrolledSet = new Set(enrolledIds.map(String));

    const invalid = winners.find((w) => {
      const wid = normalizeWinnerId(w);
      return !wid || !enrolledSet.has(wid);
    });
    if (invalid) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more winners are not enrolled in the event.",
        },
        { status: 400 }
      );
    }

    // Merge by _id (object or id string supported)
    const byId = new Map();
    for (const w of event.winners || []) {
      const wid = normalizeWinnerId(w);
      if (wid) byId.set(wid, w);
    }
    for (const w of winners) {
      const wid = normalizeWinnerId(w);
      if (wid) byId.set(wid, w);
    }

    event.winners = Array.from(byId.values());
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
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE: Clear winners for an event
// ---------------------------------------------------------------------------
export async function DELETE(req) {
  try {
    await connectDB();
    const { eventId } = await req.json();

    if (!eventId) {
      return NextResponse.json(
        { success: false, message: "Event ID required" },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    event.winners = [];
    await event.save();

    return NextResponse.json({
      success: true,
      message: "Winners cleared successfully",
    });
  } catch (err) {
    console.error("DELETE /api/admin/winners error:", err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
