import mongoose from "mongoose";

const HighlightSchema = new mongoose.Schema({
  image: String,
});

export default mongoose.models.Highlight || mongoose.model("Highlight", HighlightSchema);
