import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Event from "@/models/Event";

// Update event
export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const updatedData = await req.json();

  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedEvent) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, event: updatedEvent }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Delete event
export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Event deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
