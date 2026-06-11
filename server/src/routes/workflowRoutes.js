import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { startWorkflowSchema, workflowActionSchema, workflowIdSchema } from "../validators/workflowValidators.js";
import * as workflowController from "../controllers/workflowController.js";

const router = Router();

router.get("/", requireAuth, asyncHandler(workflowController.listWorkflows));
router.post("/start", requireAuth, validate(startWorkflowSchema), asyncHandler(workflowController.startWorkflow));
router.post("/retry", requireAuth, validate(workflowActionSchema), asyncHandler(workflowController.retryWorkflow));
router.post("/approve", requireAuth, validate(workflowActionSchema), asyncHandler(workflowController.approve));
router.get("/:id", requireAuth, validate(workflowIdSchema), asyncHandler(workflowController.getWorkflow));

export default router;
