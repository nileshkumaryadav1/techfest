import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: String,
  slug: String,
  date: String,
  time: String,
  description: String,
  venue: String,
  imageUrl: String,
  speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Speaker" }],
  workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workshop" }],
  registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
