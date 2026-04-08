import { GoogleGenAI } from "@google/genai";

// The GEMINI_API_KEY is injected by Vite via process.env.GEMINI_API_KEY
// as configured in vite.config.ts
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. AI features will not work.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const MODELS = {
  flash: "gemini-2.0-flash-exp",
  pro: "gemini-1.5-pro", // Deprecated but user asked for it. Skill says use gemini-3.1-pro-preview
  proLatest: "gemini-3.1-pro-preview",
  flashLatest: "gemini-3-flash-preview"
};
