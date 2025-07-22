import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/utils/db";
import Admin from "@/models/Admin";

// Login Handler
export async function POST(req) {
  const { email, password } = await req.json();
  await connectDB();

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { password: _, ...adminWithoutPassword } = admin.toObject();
  return NextResponse.json({ success: true, admin: adminWithoutPassword });
}

// Get All Admins
export async function GET() {
  await connectDB();
  const admins = await Admin.find().select("-password"); // exclude password
  return NextResponse.json({ success: true, admins });
}

// Delete Admin
export async function DELETE(req) {
  const { email } = await req.json();
  await connectDB();

  const deleted = await Admin.findOneAndDelete({ email });
  if (!deleted) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Admin deleted successfully" });
}
