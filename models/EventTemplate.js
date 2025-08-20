// models/EventTemplate.js
import mongoose from "mongoose";

// Define the schema for event templates
const EventTemplateSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Event name is required"], 
    trim: true 
  },
  description: { 
    type: String, 
    trim: true 
  },
  category: { 
    type: String, 
    enum: ["Technical", "Cultural", "Other"], // optional: enforce valid categories
    default: "Other" 
  },
  coordinators: [
    {
      name: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
  ],
  defaultDuration: { 
    type: String, 
    default: "1 hour" 
  },
  rules: { type: String, trim: true },
  prize: { type: String, trim: true },
  slug: { 
    type: String, 
    unique: true, 
    required: [true, "Slug is required"], 
    lowercase: true, 
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Use existing model if compiled already (important in Next.js hot reload)
const EventTemplate =
  mongoose.models.EventTemplate ||
  mongoose.model("EventTemplate", EventTemplateSchema);

export default EventTemplate;
