import { sendError } from "../utils/apiResponse.js";

export function notFoundHandler(req, res) {
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

export function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  sendError(res, error.message || "Internal server error", status, error.details || null);
}
