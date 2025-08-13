// app/api/team/leave/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import mongoose from "mongoose";
import Team from "@/models/Team";
import { getCurrentStudent } from "@/utils/getCurrentStudent";

export async function POST(req) {
  await connectDB();

  try {
    const me = await getCurrentStudent(req);
    if (!me) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!me.teamId) {
      return NextResponse.json({ error: "You are not in a team" }, { status: 400 });
    }

    const team = await Team.findById(me.teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Prevent leader from leaving without transferring leadership or deleting team
    if (String(team.leaderId) === String(me._id)) {
      return NextResponse.json(
        { error: "Leader cannot leave. Delete the team or transfer leadership first." },
        { status: 400 }
      );
    }

    // Ensure the user is actually in the team members list
    if (!team.members.some((m) => String(m) === String(me._id))) {
      return NextResponse.json({ error: "You are not a member of this team" }, { status: 400 });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    // Remove member from team
    team.members = team.members.filter((m) => String(m) !== String(me._id));
    await team.save({ session });

    // Update student's teamId
    me.teamId = null;
    await me.save({ session });

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
