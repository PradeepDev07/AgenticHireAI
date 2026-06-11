import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    resume_url: { type: String, required: true },
    parsed_resume_json: { type: mongoose.Schema.Types.Mixed },
    match_score: { type: Number, default: 0 },
    status: { type: String, default: "submitted" }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Candidate", candidateSchema);
