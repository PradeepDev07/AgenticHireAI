import Job from "../models/Job.js";
import { getHiringSpec } from "../utils/specLoader.js";

export async function createJob(payload, recruiterId) {
  const hiringSpec = getHiringSpec(payload.hiring_spec_id);
  const job = await Job.create({
    ...payload,
    required_skills: payload.required_skills.length ? payload.required_skills : hiringSpec.required_skills,
    preferred_skills: payload.preferred_skills.length ? payload.preferred_skills : hiringSpec.preferred_skills,
    recruiter_id: recruiterId
  });
  return job;
}

export async function listJobs() {
  return Job.find().sort({ created_at: -1 });
}

export async function getJob(id) {
  const job = await Job.findById(id);
  if (!job) {
    const error = new Error("Job not found");
    error.status = 404;
    throw error;
  }
  return job;
}

export async function updateJob(id, payload) {
  const job = await Job.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!job) {
    const error = new Error("Job not found");
    error.status = 404;
    throw error;
  }
  return job;
}
