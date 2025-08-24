// app/api/(fest)/fest-archive/public/route.js
import Archive from "@/models/Archive";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const archives = await Archive.find();
    return NextResponse.json(archives, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
