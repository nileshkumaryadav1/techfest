import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Sponsor from "@/models/Sponsor"; // We'll define this model next

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const newSponsor = new Sponsor(body);
    await newSponsor.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sponsor API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
