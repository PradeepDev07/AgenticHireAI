import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { loginSchema, signupSchema } from "../validators/authValidators.js";
import * as authController from "../controllers/authController.js";

const router = Router();

router.post("/signup", validate(signupSchema), asyncHandler(authController.signup));
router.post("/login", validate(loginSchema), asyncHandler(authController.login));
router.get("/me", requireAuth, asyncHandler(authController.me));

export default router;
