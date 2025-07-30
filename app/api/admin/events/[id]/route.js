import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/utils/db';
import Event from '@/models/Event';
import Enrollment from '@/models/Enrollment';
import Student from '@/models/Student';

// Validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET: Get event details with registered students
export async function GET(req, { params }) {
  const eventId = params.id;

  if (!isValidId(eventId)) {
    return NextResponse.json(
      { success: false, message: 'Invalid event ID' },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const event = await Event.findById(eventId).lean();
    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    const enrollments = await Enrollment.find({ event: eventId })
      .populate({
        path: 'student',
        model: Student,
        select: '-password -__v',
      })
      .lean();

    const registeredUsers = enrollments.map(e => e.student).filter(Boolean);

    return NextResponse.json({
      success: true,
      message: 'Event fetched successfully',
      event,
      registeredUsers,
      count: registeredUsers.length,
    });
  } catch (error) {
    console.error('GET /admin/events/:id error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while fetching event' },
      { status: 500 }
    );
  }
}

// PUT: Update event data
export async function PUT(req, { params }) {
  const eventId = params.id;

  if (!isValidId(eventId)) {
    return NextResponse.json(
      { success: false, message: 'Invalid event ID' },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const updateData = await req.json();

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, message: 'Event not found for update' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    console.error('PUT /admin/events/:id error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while updating event' },
      { status: 500 }
    );
  }
}

// DELETE: Remove event and related enrollments
export async function DELETE(req, { params }) {
  const eventId = params.id;

  if (!isValidId(eventId)) {
    return NextResponse.json(
      { success: false, message: 'Invalid event ID' },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const deletedEvent = await Event.findByIdAndDelete(eventId).lean();
    if (!deletedEvent) {
      return NextResponse.json(
        { success: false, message: 'Event not found for deletion' },
        { status: 404 }
      );
    }

    // Optional: Clean up enrollments
    await Enrollment.deleteMany({ event: eventId });

    return NextResponse.json({
      success: true,
      message: 'Event and all enrollments deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /admin/events/:id error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while deleting event' },
      { status: 500 }
    );
  }
}
