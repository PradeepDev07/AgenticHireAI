import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { resumeUpload } from "../middleware/uploadMiddleware.js";
import { candidateIdSchema } from "../validators/candidateValidators.js";
import * as candidateController from "../controllers/candidateController.js";

const router = Router();

router.post("/upload", resumeUpload.single("resume"), asyncHandler(candidateController.uploadCandidate));
router.get("/", requireAuth, asyncHandler(candidateController.listCandidates));
router.get("/:id", requireAuth, validate(candidateIdSchema), asyncHandler(candidateController.getCandidate));

export default router;
