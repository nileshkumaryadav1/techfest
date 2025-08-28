import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/utils/db";
import Enrollment from "@/models/Enrollment";
import Student from "@/models/Student";
import Event from "@/models/Event";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    let { eventId, registeredBy, teamId, teamName, participants } = body;

    if (!eventId || !registeredBy) {
      return NextResponse.json(
        { success: false, message: "Missing eventId or registeredBy" },
        { status: 400 }
      );
    }

    // ✅ ObjectId safe conversion
    const toObjectId = (id) =>
      mongoose.Types.ObjectId.isValid(id)
        ? new mongoose.Types.ObjectId(id)
        : null;

    eventId = toObjectId(eventId);
    registeredBy = toObjectId(registeredBy);
    teamId = toObjectId(teamId) || null;

    if (!eventId || !registeredBy) {
      return NextResponse.json(
        { success: false, message: "Invalid eventId or registeredBy" },
        { status: 400 }
      );
    }

    // console.log("Incoming participants:", participants);

    // ✅ Separate festIds vs objectIds
    const festIds = participants?.filter((p) => typeof p === "string") || [];
    const objectIds =
      participants?.map((p) => toObjectId(p)).filter((id) => id !== null) || [];

    let participantDocs = [];

    if (festIds.length || objectIds.length) {
      const result = await Student.find({
        $or: [
          festIds.length ? { festId: { $in: festIds } } : {},
          objectIds.length ? { _id: { $in: objectIds } } : {},
        ],
      }).select("_id festId name email");

      // console.log("Found students:", result);

      // ✅ Filter only the participants entered
      const found = result.filter((s) => festIds.includes(s.festId));

      // console.log("Filtered students:", found);

      participantDocs = found.map((s) => ({
        studentId: s._id,
        festId: s.festId,
        name: s.name,
        email: s.email,
      }));
    }

    // ✅ Always add leader
    const leader = await Student.findById(registeredBy).select(
      "_id festId name email"
    );
    if (
      leader &&
      !participantDocs.find((p) => p.studentId.equals(leader._id))
    ) {
      participantDocs.push({
        studentId: leader._id,
        festId: leader.festId,
        name: leader.name,
        email: leader.email,
      });
    }

    // ✅ Team validation
    if (teamId && (!teamName || participantDocs.length < 2)) {
      return NextResponse.json(
        { success: false, message: "Team requires name + 2+ members" },
        { status: 400 }
      );
    }

    // ✅ Prevent duplicate enrollment
    const duplicate = await Enrollment.findOne({
      eventId,
      $or: teamId
        ? [
            { teamId },
            { participants: { $in: participantDocs.map((p) => p.studentId) } },
          ]
        : [{ participants: registeredBy }],
    });

    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "Already enrolled in this event" },
        { status: 409 }
      );
    }

    // i want to also find event deail and add it to the enrollment
    // i have event db id eventID and i want to find event details and add it to the enrollment
    // stored a object with name eventDetails
    // ✅ Fetch event details
    const event = await Event.findById(eventId).lean();
    const eventDetails = event
      ? {
          slug: event.slug,
          name: event.title,
          date: event.date,
          time: event.time,
          venue: event.venue,
          description: event.description,
          imageUrl: event.imageUrl,
          eventId: event.eventId,
          category: event.category,
          // add any other fields you want to snapshot
        }
      : null;

    // ✅ Save enrollment
    const enrollment = await Enrollment.create({
      eventId,
      eventDetails,
      registeredBy,
      participants: participantDocs.map((p) => p.studentId),
      teamId,
      teamName: teamName || null,
    });

    return NextResponse.json(
      { success: true, message: "Enrollment successful", data: enrollment },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ API ERROR in /api/enroll:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
