import { Router } from "express";
import { signup, login, me } from "./auth.controller.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, me);

export default router;