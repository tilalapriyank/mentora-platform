import { Router } from "express";
import { createBooking } from "./booking.controller.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";
import { requireRole } from "../../middleware/role.middleware.ts";

const router = Router();

router.post("/", authMiddleware, requireRole("PARENT"), createBooking);

export default router;