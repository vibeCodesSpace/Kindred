import { GoogleGenAI } from "@google/genai";

export async function researchAppIdeas() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('NEXT_PUBLIC_GEMINI_API_KEY is missing');
  }
  const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Research current trends on Product Hunt, Reddit, and social media for apps that help bring people together in real life or foster deep human connection to combat digital isolation. Suggest a specific app concept that I can build using Next.js and Firebase.",
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return response.text;
}
