import * as jobService from "../services/jobService.js";
import { sendSuccess } from "../utils/apiResponse.js";

export async function createJob(req, res) {
  const job = await jobService.createJob(req.validated.body, req.user._id);
  sendSuccess(res, job, 201);
}

export async function listJobs(req, res) {
  const jobs = await jobService.listJobs();
  sendSuccess(res, jobs);
}

export async function getJob(req, res) {
  const job = await jobService.getJob(req.validated.params.id);
  sendSuccess(res, job);
}

export async function updateJob(req, res) {
  const job = await jobService.updateJob(req.validated.params.id, req.validated.body);
  sendSuccess(res, job);
}
