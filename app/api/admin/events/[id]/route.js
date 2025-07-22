import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/utils/db';
import Event from '@/models/Event';
import Enrollment from '@/models/Enrollment';
import Student from '@/models/Student';

export async function GET(req, { params }) {
  const eventId = params.id;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
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

    const registeredUsers = enrollments
      .map((e) => e.student)
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      event,
      registeredUsers,
      count: registeredUsers.length,
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const eventId = params.id;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return NextResponse.json(
      { success: false, message: 'Invalid event ID' },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const updateData = await req.json();

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const eventId = params.id;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
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
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    // Optional cleanup: delete enrollments for this event
    await Enrollment.deleteMany({ event: eventId });

    return NextResponse.json({
      success: true,
      message: 'Event and related enrollments deleted successfully',
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
