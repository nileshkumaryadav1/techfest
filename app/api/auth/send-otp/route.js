import nodemailer from "nodemailer";
import { otpStore } from "@/utils/otpStore";
import { saveOtp } from "@/utils/otpStore";

export async function POST(req) {
  try {
    const { email, phone } = await req.json();
    if (!email && !phone) {
      return new Response(
        JSON.stringify({ message: "Email or phone is required" }),
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    saveOtp(email || phone, otp, 5 * 60 * 1000);

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
        subject: "Your OTP Code",
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
