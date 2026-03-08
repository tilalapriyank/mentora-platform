import { geminiModel } from "../../config/gemini.ts";

const PROMPT = `Summarize the following text in 3-6 bullet points. Keep the total length under 120 words. Be concise.`;

export async function summarize(text: string): Promise<string> {
  const result = await geminiModel.generateContent(`${PROMPT}\n\nText:\n${text}`);
  const response = result.response;
  const summary = response.text();
  if (!summary?.trim()) {
    throw new Error("No summary in response");
  }
  return summary;
}