import * as candidateService from "../services/candidateService.js";
import { uploadCandidateSchema } from "../validators/candidateValidators.js";
import { sendSuccess } from "../utils/apiResponse.js";

export async function uploadCandidate(req, res) {
  const parsed = uploadCandidateSchema.safeParse(req.body);
  if (!parsed.success) {
    const error = new Error("Invalid request schema");
    error.status = 400;
    error.details = parsed.error.flatten();
    throw error;
  }

  const result = await candidateService.createCandidateApplication(parsed.data, req.file);
  sendSuccess(res, result, 201);
}

export async function listCandidates(req, res) {
  const candidates = await candidateService.listCandidates();
  sendSuccess(res, candidates);
}

export async function getCandidate(req, res) {
  const candidate = await candidateService.getCandidate(req.validated.params.id);
  sendSuccess(res, candidate);
}
