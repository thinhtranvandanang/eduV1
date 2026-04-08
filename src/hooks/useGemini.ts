import { useState, useCallback } from 'react';
import { ai, MODELS } from '../lib/gemini';
import { GenerateContentResponse } from '@google/genai';

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState<string | null>(null);

  const ask = useCallback(async (prompt: string, systemInstruction?: string) => {
    setLoading(true);
    setError(null);
    setResponse("");
    try {
      const result = await ai.models.generateContent({
        model: MODELS.flashLatest,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction
        }
      });
      const text = result.text;
      setResponse(text || "");
      return text;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const stream = useCallback(async (prompt: string, systemInstruction?: string, history: any[] = []) => {
    setLoading(true);
    setError(null);
    setResponse("");
    try {
      const chat = ai.chats.create({
        model: MODELS.flashLatest,
        config: {
          systemInstruction: systemInstruction
        },
        history: history
      });

      const result = await chat.sendMessageStream({ message: prompt });
      
      let fullText = "";
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
          fullText += text;
          setResponse(fullText);
        }
      }
      return fullText;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResponse("");
    setError(null);
    setLoading(false);
  }, []);

  return { ask, stream, loading, response, error, reset };
}
