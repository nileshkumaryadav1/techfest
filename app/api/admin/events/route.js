// app/api/admin/events/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Event from "@/models/Event";

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ date: 1 });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);

    return NextResponse.json(
      { error: "Failed to fetch events. Please try again later." },
      { status: 500 }
    );
  }
}
