// /api/auth/register
import Student from "@/models/Student";
import connectDB from "@/utils/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const { name, email, password, college, year, branch } = await req.json();

  const existing = await Student.findOne({ email });
  if (existing) return Response.json({ error: "Email already in use" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const student = await Student.create({
    name,
    email,
    password: hashedPassword,
    college,
    year,
    branch,
  });

  return Response.json({ message: "Registered successfully", student });
}

