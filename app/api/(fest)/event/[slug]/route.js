import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Event from "@/models/Event";

export async function GET(request, { params }) {
  const { slug } = params;

  await connectDB();
  const event = await Event.findOne({ slug });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(event, { status: 200 });
}
