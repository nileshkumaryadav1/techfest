// app/api/team/remove-member/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import mongoose from "mongoose";
import Team from "@/models/Team";
import Student from "@/models/Student";
import { getCurrentStudent } from "@/utils/getCurrentStudent";

export async function DELETE(req, { params }) {
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

    // Check leader rights
    if (String(team.leaderId) !== String(me._id)) {
      return NextResponse.json({ error: "Only the team leader can remove members" }, { status: 403 });
    }

    const targetStudentId = params.id;

    // Prevent leader from removing themselves
    if (String(targetStudentId) === String(me._id)) {
      return NextResponse.json(
        { error: "Leader cannot remove themselves. Transfer leadership or delete the team." },
        { status: 400 }
      );
    }

    // Check if target student is actually in this team
    if (!team.members.some((m) => String(m) === String(targetStudentId))) {
      return NextResponse.json({ error: "Member not found in this team" }, { status: 404 });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    // Remove from team
    team.members = team.members.filter((m) => String(m) !== String(targetStudentId));
    await team.save({ session });

    // Update student document
    await Student.updateOne(
      { _id: targetStudentId, teamId: team._id },
      { $set: { teamId: null } },
      { session }
    );

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
