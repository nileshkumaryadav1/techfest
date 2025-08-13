// app/api/team/update-name/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Team from "@/models/Team";
import { z } from "zod";
import { getCurrentStudent } from "@/utils/getCurrentStudent";

const BodySchema = z.object({
  teamName: z
    .string()
    .trim()
    .min(3, "Team name must be at least 3 characters")
    .max(50, "Team name cannot exceed 50 characters"),
});

export async function PATCH(req) {
  await connectDB();

  try {
    const me = await getCurrentStudent(req);
    if (!me) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!me.teamId) {
      return NextResponse.json({ error: "You are not in a team" }, { status: 400 });
    }

    const body = await req.json();
    const { teamName } = BodySchema.parse(body);

    const team = await Team.findById(me.teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    if (String(team.leaderId) !== String(me._id)) {
      return NextResponse.json({ error: "Only the team leader can rename the team" }, { status: 403 });
    }

    // Prevent renaming to the same name
    if (team.teamName.trim().toLowerCase() === teamName.trim().toLowerCase()) {
      return NextResponse.json({ error: "New team name must be different" }, { status: 400 });
    }

    team.teamName = teamName.trim();
    await team.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    // Zod validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors?.[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
