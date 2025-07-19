import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/utils/db";
import Student from "@/models/Student";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const student = await Student.findOne({ email });
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: student._id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({student}, { message: "Login success" }, { status: 200 });
    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Login error" }, { status: 500 });
  }
}
