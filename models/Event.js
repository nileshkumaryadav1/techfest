import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: String,
  date: String,
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
