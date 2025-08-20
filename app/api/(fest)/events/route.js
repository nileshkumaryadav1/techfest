// app/api/(fest)/events/route.js
import EventInstance from "@/models/EventInstance";
import connectDB from "@/utils/db";

export async function GET(req) {
  try {
    await connectDB();

    const instances = await EventInstance.find()
      .populate("templateId")
      .sort({ festYear: -1, date: 1 }) // latest year first, then by date
      .lean(); // convert to plain JS objects for safety

    return new Response(JSON.stringify(instances), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch events" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
