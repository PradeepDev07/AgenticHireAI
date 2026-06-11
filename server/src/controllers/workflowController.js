import Workflow from "../models/Workflow.js";
import { createWorkflow, runWorkflow, approveWorkflow } from "../workflows/hiringWorkflow.js";
import { sendSuccess } from "../utils/apiResponse.js";

export async function listWorkflows(req, res) {
  const workflows = await Workflow.find().populate("candidate_id job_id").sort({ created_at: -1 });
  sendSuccess(res, workflows);
}

export async function startWorkflow(req, res) {
  const workflow = await createWorkflow(req.validated.body.candidate_id, req.validated.body.job_id);
  sendSuccess(res, workflow, 201);
}

export async function retryWorkflow(req, res) {
  const workflow = await runWorkflow(req.validated.body.workflow_id);
  sendSuccess(res, workflow);
}

export async function approve(req, res) {
  const workflow = await approveWorkflow(req.validated.body.workflow_id, req.validated.body.approved ?? true);
  sendSuccess(res, workflow);
}

export async function getWorkflow(req, res) {
  const workflow = await Workflow.findById(req.validated.params.id).populate("candidate_id job_id");
  if (!workflow) {
    const error = new Error("Workflow not found");
    error.status = 404;
    throw error;
  }
  sendSuccess(res, workflow);
}
