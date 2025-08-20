require("dotenv/config");
const connectDB = require("../utils/db");
const Event = require("../models/Event");
const EventTemplate = require("../models/EventTemplate");
const EventInstance = require("../models/EventInstance");

async function migrateOldEvents() {
  try {
    await connectDB();

    const oldEvents = await Event.find();
    console.log(`Found ${oldEvents.length} old events.`);

    const currentYear = new Date().getFullYear();

    for (const ev of oldEvents) {
      // 1️⃣ Create template
      const template = await EventTemplate.create({
        name: ev.title,
        description: ev.description,
        category: ev.category,
        coordinators: ev.coordinators,
        defaultDuration: ev.time || "2 hours",
        rules: ev.rules || "",
        prize: ev.prizes || "",
        slug: ev.slug,
      });

      // 2️⃣ Create current year instance
      await EventInstance.create({
        templateId: template._id,
        festYear: currentYear,
        date: ev.date,
        status: "upcoming",
        participants: [],
        winners: [],
      });

      console.log(`Migrated event: ${ev.title}`);
    }

    console.log("🎉 All current year instances generated!");
    process.exit(0);
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
}

migrateOldEvents();
