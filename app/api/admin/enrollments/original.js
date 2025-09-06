// /api/admin/enrollments/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Enrollment from "@/models/Enrollment";

export async function GET() {
  await connectDB();

  try {
    const enrollments = await Enrollment.find()
      .populate("participants", "name email")
      .populate("registeredBy", "name email");

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}
