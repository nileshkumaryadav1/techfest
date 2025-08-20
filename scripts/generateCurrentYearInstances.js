require('dotenv').config();
const connectDB = require("../utils/db");
const EventTemplateModule = require("../models/EventTemplate");
const EventInstanceModule = require("../models/EventInstance");

const EventTemplate = EventTemplateModule.default || EventTemplateModule;
const EventInstance = EventInstanceModule.default || EventInstanceModule;

async function generateCurrentYearInstances() {
  try {
    await connectDB();

    const templates = await EventTemplate.find(); // ✅ now should work
    const currentYear = new Date().getFullYear();

    for (const template of templates) {
      const exists = await EventInstance.findOne({
        templateId: template._id,
        festYear: currentYear,
      });

      if (exists) {
        console.log(`Skipping existing instance for template: ${template.name}`);
        continue;
      }

      await EventInstance.create({
        templateId: template._id,
        festYear: currentYear,
        date: null,
        status: "upcoming",
        participants: [],
        winners: [],
      });

      console.log(`✅ Instance created for template: ${template.name}`);
    }

    console.log("🎉 All current year instances generated!");
    process.exit(0);
  } catch (error) {
    console.error("Error generating instances:", error);
    process.exit(1);
  }
}

generateCurrentYearInstances();
