// app/api/(fest)/team/my/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Team from "@/models/Team";
import Student from "@/models/Student";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ error: "No studentId provided" }, { status: 400 });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (!student.teamId) {
      return NextResponse.json({ team: null, isLeader: false });
    }

    const team = await Team.findById(student.teamId)
      .populate("members", "name email festId _id")
      .lean();

    if (!team) {
      return NextResponse.json({ team: null, isLeader: false });
    }

    const isLeader = String(team.leaderId) === String(student._id);

    return NextResponse.json({ team, isLeader });
  } catch (error) {
    console.error("❌ Error fetching team:", error);
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}
