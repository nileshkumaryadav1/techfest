import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    // Event being enrolled in
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    eventDetails:
      {
        type: Object,
      } || null,

    // All students enrolled (solo → 1, team → many)
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
    ],

    // The student who initiated the enrollment (auto = leader in quick flow)
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // Optional: if enrollment came from a pre-created Team
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    // Optional: snapshot of team name (helps if team is deleted later)
    teamName: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Enrollment ||
  mongoose.model("Enrollment", enrollmentSchema);
