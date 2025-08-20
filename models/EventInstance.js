// models/EventInstance.js
import mongoose from "mongoose";

const EventInstanceSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "EventTemplate" },
  festYear: { type: Number, required: true },
  date: { type: String },
  status: { 
    type: String, 
    enum: ["upcoming", "ongoing", "completed"], 
    default: "upcoming" 
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  winners: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      name: String,
      email: String,
    },
  ],
});

const EventInstance =
  mongoose.models.EventInstance ||
  mongoose.model("EventInstance", EventInstanceSchema);

export default EventInstance;
