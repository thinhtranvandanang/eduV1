import { useState, useCallback } from 'react';
import { ai, geminiFlash } from '../lib/gemini';
import { GenerateContentResponse } from "@google/genai";

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ask = useCallback(async (prompt: string, systemInstruction?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ai.models.generateContent({
        model: geminiFlash,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are a helpful AI Mentor for programming students.",
        }
      });
      
      const text = result.text;
      setResponse(text || null);
      return text;
    } catch (err: any) {
      const errMsg = err.message || "An error occurred while calling Gemini API";
      setError(errMsg);
      console.error("Gemini API Error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const stream = useCallback(async (prompt: string, systemInstruction: string, onChunk: (chunk: string) => void) => {
    setLoading(true);
    setError(null);
    setResponse("");
    try {
      const result = await ai.models.generateContentStream({
        model: geminiFlash,
        contents: prompt,
        config: {
          systemInstruction,
        }
      });

      let fullText = "";
      for await (const chunk of result) {
        const chunkText = chunk.text || "";
        fullText += chunkText;
        setResponse(fullText);
        onChunk(chunkText);
      }
      return fullText;
    } catch (err: any) {
      const errMsg = err.message || "An error occurred while streaming Gemini API";
      setError(errMsg);
      console.error("Gemini Stream Error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResponse(null);
    setError(null);
    setLoading(false);
  }, []);

  return { ask, stream, loading, response, error, reset };
}
