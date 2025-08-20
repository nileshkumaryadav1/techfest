// app/api/admin/(generation)/generate-next-year-events/route.js
import EventTemplate from "@/models/EventTemplate";
import EventInstance from "@/models/EventInstance";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    // Get the next year
    const nextYear = new Date().getFullYear() + 1;

    // Fetch all templates
    const templates = await EventTemplate.find();

    // Create new instances for next year
    const instances = await Promise.all(
      templates.map((template) =>
        EventInstance.create({
          templateId: template._id,
          festYear: nextYear,
          date: null, // Admin can set later
          status: "upcoming",
          participants: [],
          winners: [],
        })
      )
    );

    return NextResponse.json({ success: true, instances });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to generate events" },
      { status: 500 }
    );
  }
}
