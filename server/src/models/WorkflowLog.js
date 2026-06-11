import mongoose from "mongoose";

const workflowLogSchema = new mongoose.Schema(
  {
    workflow_id: { type: mongoose.Schema.Types.ObjectId, ref: "Workflow", required: true },
    agent_name: { type: String, required: true },
    input: { type: mongoose.Schema.Types.Mixed },
    output: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, required: true },
    error: { type: String }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("WorkflowLog", workflowLogSchema);
