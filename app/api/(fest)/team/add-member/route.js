// app/api/team/add-member/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Team from "@/models/Team";
import Student from "@/models/Student";
import mongoose from "mongoose";
import { z } from "zod";
import { getCurrentStudent } from "@/utils/getCurrentStudent";

// Input validation
const BodySchema = z.object({
  festId: z.string().min(3, "Fest ID is required"),
});

export async function POST(req) {
  await connectDB();

  // Get logged-in student
  const me = await getCurrentStudent(req);
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!me.teamId) {
    return NextResponse.json({ error: "You are not in a team" }, { status: 400 });
  }

  // Validate body
  const body = await req.json();
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { festId } = parsed.data;

  // Prevent leader from adding themselves
  if (festId === me.festId) {
    return NextResponse.json({ error: "You cannot add yourself" }, { status: 400 });
  }

  // Find team
  const team = await Team.findById(me.teamId);
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  // Check leader rights
  if (String(team.leaderId) !== String(me._id)) {
    return NextResponse.json({ error: "Only the team leader can add members" }, { status: 403 });
  }

  // Check team capacity
  if (team.members.length >= team.maxMembers) {
    return NextResponse.json({ error: "Team is already full" }, { status: 400 });
  }

  // Start DB transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find target student
    const studentToAdd = await Student.findOne({ festId }).session(session);
    if (!studentToAdd) {
      throw new Error("Student with this Fest ID not found");
    }
    if (studentToAdd.teamId) {
      throw new Error("Student is already in another team");
    }

    // Add to team
    team.members.push(studentToAdd._id);
    await team.save({ session });

    // Update student's teamId
    studentToAdd.teamId = team._id;
    await studentToAdd.save({ session });

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ success: true, message: "Member added successfully" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Add member error:", err);
    return NextResponse.json({ error: err.message || "Failed to add member" }, { status: 400 });
  }
}
