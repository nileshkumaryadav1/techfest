// models/Event.js
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  eventId: { type: String, required: true },
  category: String,
  type: {
    type: String,
    enum: ["single", "team"],
    default: "single",
  },
  date: String,
  time: String,
  venue: String,
  description: String,
  ruleBookPdfUrl: String,
  imageUrl: String,
  prizes: String,
  coordinators: [
    {
      name: { type: String, required: true },
      contact: String,
      role: String,
    },
  ],
  speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Speaker" }],
  workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workshop" }],
  registeredStudents: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  ],
  winners: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      name: String,
      email: String,
    },
  ],
  isTeamEvent: { type: Boolean, default: false },
  teamSize: {
    min: { type: Number, default: 1 },
    max: { type: Number, default: 1 },
  },
  registeredTeams: [
    {
      teamName: { type: String, required: true },
      members: [
        {
          student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
          name: String,
          email: String,
        },
      ],
      leader: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "cancelled", "completed"],
    default: "upcoming",
  },
});

module.exports = mongoose.models.Event || mongoose.model("Event", EventSchema);
