import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  console.warn('NEXT_PUBLIC_GEMINI_API_KEY is missing');
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export async function getDeepConnectionPrompts(interests: string[]): Promise<string | null> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Based on these interests: ${interests.join(", ")}, generate 5 deep, thought-provoking conversation starters or small group activity ideas that help strangers connect on a human level.`,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
    }
  });
  return response.text ?? null;
}
