// app/api/init-superadmin/route.js
import { NextResponse } from "next/server";
import Admin from "@/models/Admin";
import connectDB from "@/utils/db";
import bcrypt from "bcryptjs";

export async function GET() {
  await connectDB();

  const existing = await Admin.findOne({ role: "superadmin" });
  if (existing) {
    return NextResponse.json({ message: "Superadmin already exists." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash("admin123", 10); // You can change this password later

  const newAdmin = new Admin({
    name: "Super Admin",
    email: "superadmin@fest.com",
    password: hashedPassword,
    role: "superadmin",
  });

  await newAdmin.save();

  return NextResponse.json({ message: "Superadmin created successfully!" });
}
