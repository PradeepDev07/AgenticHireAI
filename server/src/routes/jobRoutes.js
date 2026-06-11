import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { createJobSchema, jobIdSchema, updateJobSchema } from "../validators/jobValidators.js";
import * as jobController from "../controllers/jobController.js";

const router = Router();

router.get("/", asyncHandler(jobController.listJobs));
router.get("/:id", validate(jobIdSchema), asyncHandler(jobController.getJob));
router.post("/", requireAuth, requireRole("recruiter"), validate(createJobSchema), asyncHandler(jobController.createJob));
router.put("/:id", requireAuth, requireRole("recruiter"), validate(updateJobSchema), asyncHandler(jobController.updateJob));

export default router;
