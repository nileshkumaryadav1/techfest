import mongoose from "mongoose";

const SponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  phone: { type: String },
  message: { type: String },
  image: { type: String },
}, { timestamps: true });

export default mongoose.models.Sponsor || mongoose.model("Sponsor", SponsorSchema);
