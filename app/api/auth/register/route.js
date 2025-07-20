// /api/auth/register
import Student from "@/models/Student";
import connectDB from "@/utils/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const { name, email, password, college, year, branch, phone } = await req.json();

  // Check if email already registered
  const existing = await Student.findOne({ email });
  if (existing) {
    return Response.json({ error: "Email already in use" }, { status: 400 });
  }

  // Generate festId
  const generateFestId = (name, phone) => {
    const firstName = name.trim().split(" ")[0].toLowerCase();
    const last4 = phone.slice(-4);
    const festYear = new Date().getFullYear();
    return `${firstName}${festYear}${last4}`;
  };

  const festId = generateFestId(name, phone);

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create student
  const student = await Student.create({
    name,
    email,
    password: hashedPassword,
    college,
    year,
    branch,
    phone,
    festId,
  });

  return Response.json({ message: "Registered successfully", student });
}
