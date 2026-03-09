import { Router } from "express";
import { createSession, joinSession } from "./session.controller.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";
import { requireRole } from "../../middleware/role.middleware.ts";

const router = Router();

router.post("/", authMiddleware, requireRole("MENTOR"), createSession);
router.post("/:id/join", authMiddleware, requireRole("PARENT"), joinSession);

export default router;