import * as authService from "../services/authService.js";
import { sendSuccess } from "../utils/apiResponse.js";

export async function signup(req, res) {
  const result = await authService.signup(req.validated.body);
  sendSuccess(res, result, 201);
}

export async function login(req, res) {
  const result = await authService.login(req.validated.body);
  sendSuccess(res, result);
}

export async function me(req, res) {
  sendSuccess(res, { user: req.user });
}
