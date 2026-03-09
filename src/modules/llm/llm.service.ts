import { geminiModel } from "../../config/gemini.ts";

const SUMMARIZE_SYSTEM = `You are a concise summarizer. Your task is to summarize the given text clearly and accurately.

Rules:
- Output exactly 3–6 bullet points.
- Each bullet must be one clear, complete idea (no sub-bullets).
- Total length must be under 120 words.
- Use neutral, factual language. Do not add introductions, conclusions, or phrases like "Key points:" or "In summary:".
- Preserve the most important facts, decisions, or outcomes from the original text.
- Start each bullet with "• " (bullet character).`;

const USER_PREFIX = "Summarize the following text according to the rules above.\n\nText:\n";

export async function summarize(text: string): Promise<string> {
  const result = await geminiModel.generateContent(
    `${SUMMARIZE_SYSTEM}\n\n${USER_PREFIX}${text}`
  );
  const response = result.response;
  const summary = response.text();
  if (!summary?.trim()) {
    throw new Error("No summary in response");
  }
  return summary;
}