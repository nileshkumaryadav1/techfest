import bcrypt from "bcrypt";
import { otpStore } from "@/utils/otpStore";
import Student from "@/models/Student";

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return new Response(
        JSON.stringify({
          message: "Email, OTP, and new password are required",
        }),
        { status: 400 }
      );
    }

    // Check OTP
    const storedOtp = otpStore[email];
    if (!storedOtp) {
      return new Response(
        JSON.stringify({ message: "OTP not found or expired" }),
        { status: 400 }
      );
    }

    // Validate OTP value
    if (storedOtp.otp !== otp) {
      return new Response(JSON.stringify({ message: "Invalid OTP" }), {
        status: 400,
      });
    }

    // Check OTP expiry
    if (storedOtp.expires < Date.now()) {
      delete otpStore[email]; // clean up expired OTP
      return new Response(JSON.stringify({ message: "OTP expired" }), {
        status: 400,
      });
    }

    // OTP valid → update password
    const student = await Student.findOne({ email });
    if (!student) {
      return new Response(JSON.stringify({ message: "Student not found" }), {
        status: 404,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    await student.save();

    // Delete OTP after successful use
    delete otpStore[email];

    return new Response(
      JSON.stringify({ message: "Password reset successful" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset Password Error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to reset password" }),
      { status: 500 }
    );
  }
}
