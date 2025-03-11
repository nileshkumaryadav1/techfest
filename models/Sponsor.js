import mongoose from "mongoose";

const SponsorSchema = new mongoose.Schema({
  name: String,
  image: String,
});

export default mongoose.models.Sponsor || mongoose.model("Sponsor", SponsorSchema);
