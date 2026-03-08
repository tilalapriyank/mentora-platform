import { Router } from "express";
import { createLesson } from "./lesson.controller.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";
import { requireRole } from "../../middleware/role.middleware.ts";

const router = Router();

router.post("/", authMiddleware, requireRole("MENTOR"), createLesson);

export default router;