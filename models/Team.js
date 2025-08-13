// models/Team.js
import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true, trim: true },
    leaderId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }], // includes leader
    maxMembers: { type: Number, default: 4 }, // adjust per your rule
  },
  { timestamps: true }
);

export default mongoose.models.Team || mongoose.model("Team", teamSchema);
