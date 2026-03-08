import { Router } from "express";
import rateLimit from "express-rate-limit";
import { summarizeText } from "./llm.controller.ts";

const router = Router();

const summarizeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many requests, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/summarize", summarizeLimiter, summarizeText);

export default router;