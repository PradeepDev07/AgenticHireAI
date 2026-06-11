import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    required_skills: [{ type: String }],
    preferred_skills: [{ type: String }],
    min_experience: { type: Number, default: 0 },
    workflow_spec_id: { type: String, default: "default-hiring-workflow" },
    hiring_spec_id: { type: String, default: "frontend-developer" },
    recruiter_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Job", jobSchema);
