import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function callGemini(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response;
}
