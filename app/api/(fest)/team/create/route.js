// app/api/(fest)/team/create/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";

import connectDB from "@/utils/db";
import Student from "@/models/Student";
import Team from "@/models/Team";

// Validation schema
const BodySchema = z.object({
  student: z.object({
    _id: z.string(),
    festId: z.string(),
    teamId: z.string().nullable().optional(),
  }),
  teamName: z
    .string()
    .min(3, "Team name must be at least 3 characters")
    .max(50, "Team name must not exceed 50 characters"),
  membersFestIds: z.array(z.string()).optional(), // Excluding leader
  maxMembers: z.number().min(2).max(10).optional(),
});

export async function POST(req) {
  let session;

  try {
    await connectDB();

    const json = await req.json();
    const parsed = BodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { student: me, teamName, membersFestIds = [], maxMembers = 4 } = parsed.data;

    // Check if already in a team
    if (me.teamId) {
      return NextResponse.json({ error: "You are already in a team" }, { status: 400 });
    }

    // Remove leader's Fest ID if mistakenly included
    const invitedFestIds = membersFestIds.filter(id => id !== me.festId);

    session = await mongoose.startSession();
    session.startTransaction();

    // Find invited members by Fest ID
    const invitedMembers = await Student.find({
      festId: { $in: invitedFestIds },
    }).session(session);

    if (invitedMembers.length !== invitedFestIds.length) {
      throw new Error("One or more Fest IDs do not exist");
    }

    for (const member of invitedMembers) {
      if (member.teamId) {
        throw new Error(`Student ${member.festId} is already in a team`);
      }
    }

    // Create team
    const [team] = await Team.create(
      [
        {
          teamName,
          leaderId: me._id,
          members: [me._id, ...invitedMembers.map(m => m._id)],
          maxMembers,
        },
      ],
      { session }
    );

    // Update students' teamId
    await Student.updateMany(
      { _id: { $in: [me._id, ...invitedMembers.map(m => m._id)] } },
      { $set: { teamId: team._id } },
      { session }
    );

    await session.commitTransaction();

    return NextResponse.json({ success: true, team });

  } catch (err) {
    if (session) await session.abortTransaction();
    console.error("Team creation error:", err);
    return NextResponse.json(
      { error: err.message || "Server error. Please try again later." },
      { status: 400 }
    );

  } finally {
    if (session) session.endSession();
  }
}
