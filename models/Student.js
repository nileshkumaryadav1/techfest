// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  college: String,
  year: String,
  branch: String,
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
});

module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);
