import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

// Only use models that work with current API (v1beta). gemini-1.5-flash often 404s.
const DEFAULT_MODEL = "gemini-2.0-flash";
const envModel = (process.env.GEMINI_MODEL || DEFAULT_MODEL).trim().toLowerCase();
const supportedModels = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-flash-latest",
];
export const geminiModelName = supportedModels.includes(envModel) ? envModel : DEFAULT_MODEL;

const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({
  model: geminiModelName,
});