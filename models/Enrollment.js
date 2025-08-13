import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    // Always store the main student who initiated this enrollment
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // Event being enrolled in
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    // Enrollment type: single participant or team
    type: {
      type: String,
      enum: ["single", "team"],
      default: "single",
    },

    // Link to team if this is a team event
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    // For team events: list of all participant IDs
    // For single events: will just have the one studentId
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    // The student who actually submitted the registration
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

    // Optional: store teamName directly for quick lookups (avoids join if needed)
    teamName: {
      type: String,
      default: null,
    },

    // Optional: flag to quickly identify captain/leader in a team event
    isLeader: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Enrollment ||
  mongoose.model("Enrollment", enrollmentSchema);
