import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/utils/db";
import Enrollment from "@/models/Enrollment";

export async function POST(req) {
  try {
    const body = await req.json();
    let { eventId, registeredBy, teamId, teamName, participants } = body;

    // Validate required fields
    if (!eventId || !registeredBy) {
      return NextResponse.json(
        { success: false, message: "Missing eventId or registeredBy" },
        { status: 400 }
      );
    }

    // Validate ObjectId format before converting
    const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId(eventId) || !isValidObjectId(registeredBy)) {
      return NextResponse.json(
        { success: false, message: "Invalid eventId or registeredBy format" },
        { status: 400 }
      );
    }

    // Connect to DB
    await connectDB();

    // Convert IDs to ObjectId
    eventId = new mongoose.Types.ObjectId(eventId);
    registeredBy = new mongoose.Types.ObjectId(registeredBy);

    if (teamId && isValidObjectId(teamId)) {
      teamId = new mongoose.Types.ObjectId(teamId);
    } else {
      teamId = null;
    }

    if (participants && participants.length) {
      participants = participants
        .filter((p) => isValidObjectId(p))
        .map((p) => new mongoose.Types.ObjectId(p));
    } else {
      participants = [registeredBy]; // Solo enrollment
    }

    // Team validation
    if (teamId && (!teamName || participants.length < 2)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Team registration requires teamName and at least 2 participants.",
        },
        { status: 400 }
      );
    }

    // 🔎 Duplicate check
    let duplicateQuery = { eventId };
    if (teamId) {
      duplicateQuery.$or = [
        { teamId },
        { participants: { $in: participants } },
      ];
    } else {
      duplicateQuery.$or = [{ participants: registeredBy }];
    }

    const alreadyEnrolled = await Enrollment.findOne(duplicateQuery);
    if (alreadyEnrolled) {
      return NextResponse.json(
        { success: false, message: "Already enrolled in this event." },
        { status: 409 }
      );
    }

    // ✅ Create enrollment
    const enrollment = await Enrollment.create({
      eventId,
      registeredBy,
      participants,
      teamId: teamId || null,
      teamName: teamName || null,
    });

    return NextResponse.json(
      { success: true, message: "Enrollment successful!", data: enrollment },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Enrollment error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
