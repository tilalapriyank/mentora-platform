import { Router } from "express";
import { createStudent, getStudents } from "./student.controller.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";
import { requireRole } from "../../middleware/role.middleware.ts";

const router = Router();

router.post("/", authMiddleware, requireRole("PARENT"), createStudent);
router.get("/", authMiddleware, requireRole("PARENT"), getStudents);

export default router;