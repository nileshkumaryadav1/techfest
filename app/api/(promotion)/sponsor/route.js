// import { NextResponse } from "next/server";
// import connectDB from "@/utils/db";
// import Sponsor from "@/models/Sponsor"; // We'll define this model next

// export async function POST(req) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     const newSponsor = new Sponsor(body);
//     await newSponsor.save();

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Sponsor API error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, phone, company, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // NodeMailer transporter (reuse your existing config)
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your provider
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD, // App password if Gmail
      },
    });

    // Email template
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: process.env.SMTP_EMAIL,
      subject: `New Sponsor Contact: ${name}`,
      html: `
        <h2>New Sponsor Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Company:</strong> ${company || "N/A"}</p>
        <p><strong>Message:</strong><br/>${message}</p>
        <p>Sent from your website form.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent" });
  } catch (error) {
    console.error("Sponsor API error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
