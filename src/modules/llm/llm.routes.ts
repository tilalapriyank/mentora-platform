import { Router } from "express";
import { summarizeLimiter } from "../../config/rateLimit.ts";
import { summarizeText } from "./llm.controller.ts";

const router = Router();

router.post("/summarize", summarizeLimiter, summarizeText);

export default router;