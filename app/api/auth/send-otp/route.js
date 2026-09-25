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
        from: `"CentreFest" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject:
          type === "reset"
            ? "CentreFest | Password Reset OTP"
            : "CentreFest | Registration OTP",
        html: `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px 15px;">
          <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.08); overflow:hidden;">

            <!-- Logo -->
            <tr>
              <td align="center" style="padding:25px; background:#f59e0b;">
                <img
                  src="https://centrefest.vercel.app/logo.png"
                  alt="Centre Fest Logo"
                  style="height:60px; margin-bottom:10px; border-radius:8px;"
                />
                <h2 style="margin:0; color:#ffffff;">CentreFest</h2>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:30px; color:#1f2937;">
                <h3>OTP Verification</h3>

                <p>
                  Thank you for connecting with <strong>CentreFest</strong>.
                  Please use the OTP below to continue.
                </p>

                <div style="text-align:center; margin:30px 0;">
                  <span style="
                    display:inline-block;
                    padding:15px 30px;
                    font-size:28px;
                    letter-spacing:6px;
                    font-weight:bold;
                    background:#f1f5f9;
                    border-radius:8px;
                  ">
                    ${otp}
                  </span>
                </div>

                <p style="font-size:14px;">
                  This OTP is valid for 5 minutes. Do not share it with anyone.
                </p>

                <p style="margin-top:30px;">
                  Regards,<br />
                  <strong>CentreFest Team</strong><br />
                  Centre Organization
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding:15px; background:#f8fafc; font-size:12px; color:#6b7280;">
                © 2026 CentreFest. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
      });
    }

    // console.log(`✅ OTP for ${email || phone}: ${otp}`);

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
