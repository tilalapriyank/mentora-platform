import rateLimit from "express-rate-limit";

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000;
const maxSummarize = Number(process.env.RATE_LIMIT_SUMMARIZE_MAX) || 10;

export const summarizeLimiter = rateLimit({
  windowMs,
  max: maxSummarize,
  message: { error: "Too many requests, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});
