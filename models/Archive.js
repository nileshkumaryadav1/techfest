// models/Archive.js
import mongoose from "mongoose";

const ArchiveSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    theme: { type: String },
    tagline: { type: String },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    brochureUrl: { type: String },
    venue: { type: String, required: true },
    organizers: { type: String },
    supporters: { type: String },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    registeredStudents: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    ],
    enrolledStudents: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    ],
    enrolledTeams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
    workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workshop" }],
    speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Speaker" }],
    sponsors: {type: String},
  },
  { timestamps: true }
);

export default mongoose.models.Archive ||
  mongoose.model("Archive", ArchiveSchema);
