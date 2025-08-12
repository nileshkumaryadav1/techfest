// /api/auth/verify-otp
import { otpStore } from "@/utils/otpStore";
import Student from "@/models/Student";
import connectDB from "@/utils/db";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, phone, college, year, branch, password, otp } = await req.json();

    // Basic validations
    if (!email && !phone) {
      return new Response(JSON.stringify({ message: "Email or phone is required" }), { status: 400 });
    }
    if (!otp) {
      return new Response(JSON.stringify({ message: "OTP is required" }), { status: 400 });
    }

    // Check OTP
    const stored = otpStore[email || phone];
    if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
      return new Response(JSON.stringify({ message: "Invalid or expired OTP" }), { status: 400 });
    }

    // Check if email already registered
    const existing = await Student.findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ message: "Email already in use" }), { status: 400 });
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

    // Save student to DB
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

    // Clear OTP from memory
    delete otpStore[email || phone];

    // Send Welcome Email
    if (email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"Fest Team" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: "🎉 Welcome to the Fest!",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; background: #f9f9f9; border-radius: 8px;">
            <h2 style="color: #4CAF50;">Welcome, ${name}!</h2>
            <p>We’re excited to have you join <b>Fest ${new Date().getFullYear()}</b>! Here are your details:</p>
            <ul>
              <li><b>Fest ID:</b> ${festId}</li>
              <li><b>College:</b> ${college}</li>
              <li><b>Branch:</b> ${branch}</li>
              <li><b>Year:</b> ${year}</li>
            </ul>
            <p>Get ready for exciting events and experiences!</p>
            <p style="margin-top: 20px;">Cheers,</p>
            <p><b>The Fest Team</b></p>
          </div>
        `,
      });
    }

    return new Response(
      JSON.stringify({ message: "Registration successful", student }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
