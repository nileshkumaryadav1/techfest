// app/api/certificate/winner/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Archive from "@/models/Archive";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    let email = searchParams.get("email");

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Missing email. Please provide a valid email." },
        { status: 400 }
      );
    }

    email = email.trim().toLowerCase();
    await connectDB();

    // 1️⃣ Find Archive where this email exists in any event winners
    const archive = await Archive.findOne({
      "events.winners.email": new RegExp(`^${email}$`, "i"),
    });

    if (!archive) {
      return NextResponse.json(
        { error: "No archive found for this winner." },
        { status: 404 }
      );
    }

    // 2️⃣ Find winner details + winning events
    let winner = null;
    const winningEvents = [];

    archive.events.forEach((event) => {
      event.winners.forEach((w) => {
        if (w.email.toLowerCase() === email) {
          winner = w;
          winningEvents.push(event.title);
        }
      });
    });

    if (!winner) {
      return NextResponse.json(
        { error: "Winner not found in archive." },
        { status: 404 }
      );
    }

    if (!winningEvents.length) {
      return NextResponse.json(
        { error: "No winning events found for this student." },
        { status: 404 }
      );
    }

    // 3️⃣ Format fest name + date range
    const festName = archive.name || "TechFest";
    const validDates = archive.events
      .map((e) => new Date(e.date))
      .filter((d) => !isNaN(d));

    let dateRange = "Date not available";
    if (validDates.length > 0) {
      const minDate = new Date(Math.min(...validDates));
      const maxDate = new Date(Math.max(...validDates));
      dateRange =
        minDate.toDateString() === maxDate.toDateString()
          ? minDate.toDateString()
          : `${minDate.toDateString()} - ${maxDate.toDateString()}`;
    }

    // 4️⃣ Generate cert ID
    const certId = `WIN-${archive._id.toString().slice(-5)}-${winner._id
      .toString()
      .slice(-5)}`;

    // 5️⃣ Return success
    return NextResponse.json({
      name: winner.name,
      email: winner.email,
      festName,
      dateRange,
      events: winningEvents,
      certId,
      issuedOn: new Date().toDateString(),
      type: "winner",
    });
  } catch (error) {
    console.error("❌ Winner Certificate API Error:", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
