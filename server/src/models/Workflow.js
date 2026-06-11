import mongoose from "mongoose";

const workflowSchema = new mongoose.Schema(
  {
    candidate_id: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    workflow_spec_id: { type: String, default: "default-hiring-workflow" },
    current_state: { type: String, default: "queued" },
    status: { type: String, default: "queued" },
    retries: { type: Map, of: Number, default: {} },
    graph: [
      {
        name: String,
        status: String,
        attempts: Number,
        output: mongoose.Schema.Types.Mixed,
        error: String
      }
    ]
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Workflow", workflowSchema);
