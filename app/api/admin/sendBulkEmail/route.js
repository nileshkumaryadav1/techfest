// app/api/sendBulkEmail/route.js
import connectDB from "@/utils/db";
import Student from "@/models/Student";
import { sendEmail } from "@/utils/sendEmail";

export async function POST(req) {
  try {
    await connectDB();

    const { subject, messages } = await req.json(); // messages is now an array

    // Fetch all student emails
    const students = await Student.find({}, { email: 1, _id: 0 });
    const emails = students.map(s => s.email);
    // const emails = ["nileshkumarextra@gmail.com", "kumarnileshayan@gmail.com"];

    // Styled HTML template
    const emailHTML = (subject, sections) => `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; background: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <div style="background: #4f46e5; color: #fff; padding: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px;">${subject}</h1>
          </div>

          <div style="padding: 20px;">
            ${sections
              .map(
                (section) => `
                  <p style="
                    margin-bottom: 16px; 
                    padding: 12px; 
                    background: #f3f3f3; 
                    border-left: 4px solid #4f46e5; 
                    border-radius: 5px;
                  ">
                    ${section}
                  </p>
                `
              )
              .join("")}

            <p style="margin-top: 20px; text-align: center; font-weight: bold; color: #4f46e5;">
              Stay tuned for more updates about the next fest!
            </p>
          </div>

          <div style="background: #f3f3f3; padding: 10px; text-align: center; font-size: 12px; color: #555;">
            &copy; ${new Date().getFullYear()} Centre Fest. All rights reserved.
          </div>

        </div>
      </div>
    `;

    // Send emails one by one
    for (let email of emails) {
      await sendEmail({
        to: email,
        subject,
        text: messages.join("\n"), // plain text fallback
        html: emailHTML(subject, messages),
      });
    }

    return new Response(
      JSON.stringify({ success: true, sent: emails.length }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
