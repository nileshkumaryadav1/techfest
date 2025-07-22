// app/api/admin/(events)/enrolled/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Enrollment from "@/models/Enrollment";

export async function GET() {
    await connectDB();
    const enrolled = await Enrollment.find().populate("eventId studentId").lean();
    return NextResponse.json(enrolled);
}
