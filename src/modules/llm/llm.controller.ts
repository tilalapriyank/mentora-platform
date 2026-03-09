import type { Request, Response } from "express";
import { geminiModelName } from "../../config/gemini.ts";
import { summarize } from "./llm.service.ts";

const MIN_LENGTH = 50;
const MAX_LENGTH = 10_000;

export async function summarizeText(req: Request, res: Response) {
  const text = req.body?.text;

  if (text === undefined || text === null) {
    return res.status(400).json({ error: "Text is required" });
  }
  if (typeof text !== "string") {
    return res.status(400).json({ error: "Text must be a string" });
  }
  if (!text.trim()) {
    return res.status(400).json({ error: "Text cannot be empty" });
  }

  if (text.length < MIN_LENGTH) {
    return res.status(400).json({ error: "Text too short (minimum 50 characters)" });
  }
  if (text.length > MAX_LENGTH) {
    return res.status(413).json({ error: "Text too long (maximum 10000 characters)" });
  }

  try {
    const summary = await summarize(text.trim());
    return res.json({ summary, model: geminiModelName });
  } catch {
    return res.status(502).json({ error: "Summarization failed. Please try again." });
  }
}