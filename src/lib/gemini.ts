import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured in environment variables.");
}

export const ai = new GoogleGenAI({ apiKey });

// Models
export const geminiFlash = "gemini-2.0-flash-exp";
export const geminiPro = "gemini-1.5-pro";
