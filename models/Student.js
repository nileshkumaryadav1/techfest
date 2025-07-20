// models/Student.js
const mongoose = require("mongoose");
// const { unique } = require("next/dist/build/utils");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  phone: {
  type: String,
  required: true,
  unique: true,
  },
  festId: {
  type: String,
  required: true,
  unique: true,
  },
  role: String,
  college: String,
  year: String,
  branch: String,
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
});

module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);
