// app/api/team/delete/[teamId]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import mongoose from "mongoose";
import Team from "@/models/Team";
import Student from "@/models/Student";
import { getCurrentStudent } from "@/utils/getCurrentStudent";

export async function DELETE(req, { params }) {
  await connectDB();

  try {
    // Validate logged-in student
    const me = await getCurrentStudent(req);
    if (!me) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate team existence
    const team = await Team.findById(params.teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check leader permission
    if (String(team.leaderId) !== String(me._id)) {
      return NextResponse.json(
        { error: "Only the team leader can delete the team" },
        { status: 403 }
      );
    }

    // Transaction for deleting team & updating members
    const session = await mongoose.startSession();
    session.startTransaction();

    await Student.updateMany(
      { _id: { $in: team.members } },
      { $set: { teamId: null } },
      { session }
    );

    await Team.deleteOne({ _id: team._id }, { session });

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.abortTransaction?.();
    }
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
