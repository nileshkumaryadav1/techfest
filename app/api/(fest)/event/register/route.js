import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { z } from "zod";
// import Team from "@/models/Team";
import Enrollment from "@/models/Enrollment";
import { getCurrentStudent } from "@/utils/getCurrentStudent";

const BodySchema = z.object({
  eventId: z.string().nonempty("Event ID is required"),
  teamId: z.string().optional(),
});

export async function POST(req) {
  await connectDB();

  try {
    // ✅ Get the current student
    const me = await getCurrentStudent(req);
    if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ✅ Validate body
    const { eventId, teamId } = BodySchema.parse(await req.json());

    // TEAM REGISTRATION
    if (teamId) {
      // const team = await Team.findById(teamId).lean();
      if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

      const isLeader = String(team.leaderId) === String(me._id);
      if (!isLeader) return NextResponse.json(
        { error: "Only the team leader can register the team" },
        { status: 403 }
      );

      // Prevent duplicate registration for team members
      const existing = await Enrollment.findOne({
        eventId,
        participants: { $in: team.members },
      });

      if (existing) return NextResponse.json(
        { error: "Team or member already registered for this event" },
        { status: 400 }
      );

      // ✅ Create team registration
      const registration = await Enrollment.create({
        eventId,
        type: "team",
        teamId: team._id,
        participants: team.members,
        registeredBy: me._id,
      });

      return NextResponse.json({ success: true, registration });
    }

    // SINGLE STUDENT REGISTRATION
    const existingSingle = await Enrollment.findOne({
      eventId,
      participants: me._id,
    });

    if (existingSingle) return NextResponse.json(
      { error: "Already registered for this event" },
      { status: 400 }
    );

    const registration = await Enrollment.create({
      eventId,
      type: "single",
      teamId: null,
      participants: [me._id],
      registeredBy: me._id,
    });

    return NextResponse.json({ success: true, registration });

  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors?.[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    console.error("❌ Event registration error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
