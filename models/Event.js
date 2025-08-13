import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  // At the time of event registration
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },

  eventId: { type: String, required: true },
  category: String,

  date: String,
  time: String,
  venue: String,

  description: String,
  ruleBookPdfUrl: String,

  imageUrl: String,
  prizes: String,

  // After the event is registered
  coordinators: [
    {
      name: { type: String, required: true },
      contact: String,
      role: String,
    },
  ],

  speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Speaker" }],
  workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workshop" }],

  registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],

  winners: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      name: String,
      email: String,
    },
  ],

  // ✅ New field for Team Events (does not affect old registrations)
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

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
