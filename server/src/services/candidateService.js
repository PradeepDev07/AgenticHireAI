import Candidate from "../models/Candidate.js";
import Job from "../models/Job.js";
import { createWorkflow } from "../workflows/hiringWorkflow.js";

export async function createCandidateApplication(payload, file) {
  const job = await Job.findById(payload.job_id);
  if (!job) {
    const error = new Error("Job not found");
    error.status = 404;
    throw error;
  }

  if (!file) {
    const error = new Error("Resume file is required");
    error.status = 400;
    throw error;
  }

  const candidate = await Candidate.create({
    ...payload,
    resume_url: file.path
  });
  const workflow = await createWorkflow(candidate._id, job._id);
  return { candidate, workflow };
}

export async function listCandidates() {
  return Candidate.find().populate("job_id").sort({ created_at: -1 });
}

export async function getCandidate(id) {
  const candidate = await Candidate.findById(id).populate("job_id");
  if (!candidate) {
    const error = new Error("Candidate not found");
    error.status = 404;
    throw error;
  }
  return candidate;
}
