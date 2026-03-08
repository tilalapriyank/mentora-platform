import { Router } from "express";
import { createSession } from "./session.controller.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";
import { requireRole } from "../../middleware/role.middleware.ts";

const router = Router();

router.post("/", authMiddleware, requireRole("MENTOR"), createSession);

export default router;