import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: String,
  slug: String,

  eventId: String,
  category: String,

  date: String,
  time: String,
  venue: String,

  description: String,
  ruleBookPdfUrl: String,

  imageUrl: String,

  coordinators: [
    {
      name: { type: String, required: true },
      contact: { type: String },
      role: { type: String },
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
  
  prizes: String,
  
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
