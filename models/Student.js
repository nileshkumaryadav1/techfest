// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true, trim: true },

    // Fest Details
    festId: { type: String, required: true, unique: true, uppercase: true, trim: true },

    // Academic Info
    college: { type: String, trim: true },
    year: { type: String, trim: true },
    branch: { type: String, trim: true },

    // Team Relation (1 team per student)
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null },

    // Events Registered
    registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],

    // Payment Info (One-Time Registration Fee)
    hasPaid: { type: Boolean, default: false },
    paymentId: { type: String, default: null, trim: true },
    amountPaid: { type: Number, default: 0 },
    paymentDate: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Student || mongoose.model("Student", studentSchema);
