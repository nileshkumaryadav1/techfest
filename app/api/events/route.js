import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Event from "@/models/Event";

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({});
    return NextResponse.json({ success: true, events }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { title, description, location, date, time } = await req.json();
    
    if (!title || !description || !location || !date || !time) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    const newEvent = new Event({ title, description, location, date, time });
    await newEvent.save();

    return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
