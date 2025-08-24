// app/api/admin/(archive)/fest-archive/route.js
// import Archive from "@/models/Archive";
// import connectDB from "@/utils/db";
// import { NextResponse } from "next/server";
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Archive from "@/models/Archive";
import Event from "@/models/Event";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";

export async function POST(req) {
  try {
    await connectDB();

    // 1. Get fest metadata from request
    const body = await req.json();

    // 2. Fetch snapshots of current data
    const events = await Event.find().lean();
    const registeredStudents = await Student.find().lean();
    const enrolledStudents = await Enrollment.find().lean();

    // 3. Merge metadata + snapshots
    const archiveData = {
      ...body, // fest metadata (name, year, about, etc.)
      events,
      registeredStudents,
      enrolledStudents,
    };

    // 4. Save to Archive collection
    const archive = await Archive.create(archiveData);

    return NextResponse.json(archive, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const archives = await Archive.find();
    return NextResponse.json(archives, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// export async function POST(req) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const archive = await Archive.create(body);
//     return NextResponse.json(archive, { status: 201 });
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

export async function DELETE(req) {
  try {
    await connectDB();
    const { _id } = await req.json(); // use _id to match frontend
    if (!_id)
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    const archive = await Archive.findByIdAndDelete(_id);
    if (!archive)
      return NextResponse.json({ error: "Archive not found" }, { status: 404 });
    return NextResponse.json(
      { message: "Archive deleted", archive },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { _id } = body; // use _id to match frontend
    if (!_id)
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    const archive = await Archive.findByIdAndUpdate(_id, body, { new: true });
    if (!archive)
      return NextResponse.json({ error: "Archive not found" }, { status: 404 });
    return NextResponse.json(
      { message: "Archive updated", archive },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
