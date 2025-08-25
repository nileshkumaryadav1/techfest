import nodemailer from "nodemailer";
import { otpStore } from "@/utils/otpStore";
import { saveOtp } from "@/utils/otpStore";
import Student from "@/models/Student";

export async function POST(req) {
  try {
    const { email, phone, type } = await req.json();
    if (!email && !phone) {
      return new Response(
        JSON.stringify({ message: "Email or phone is required" }),
        { status: 400 }
      );
    }

    // If it's password reset, ensure student exists
    if (type === "reset" && email) {
      const student = await Student.findOne({ email });
      if (!student) {
        return new Response(
          JSON.stringify({ message: "Student with this email does not exist" }),
          { status: 404 }
        );
      }
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    saveOtp(email || phone, otp, 5 * 60 * 1000); // 5 min expiry

    if (email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject:
          type === "reset"
            ? "Your Password Reset OTP"
            : "Your Registration OTP",
        text: `Your OTP code is ${otp}`,
      });
    }

    console.log(`✅ OTP for ${email || phone}: ${otp}`);

    return new Response(JSON.stringify({ message: "OTP sent successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return new Response(JSON.stringify({ message: "Failed to send OTP" }), {
      status: 500,
    });
  }
}
