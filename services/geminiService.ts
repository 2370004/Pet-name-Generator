
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL } from "../constants";

interface PetNameResponse {
  names: string[];
}

export const generatePetNames = async (animalType: string): Promise<string[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined. Please ensure it's set in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `あなたはペットの名前を提案する専門家です。指定された動物の種類に合う、かわいくて日本語で発音しやすいカタカナの名前を5つ生成してください。応答はJSON形式で、\`names\`というキーに名前の配列を含めてください。動物の種類: ${animalType}`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            names: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: 'Generated pet names in Katakana.',
            },
          },
          required: ['names'],
        },
        systemInstruction: "あなたはペットの名前を提案する専門家です。かわいくて日本語で発音しやすいカタカナの名前を生成し、JSON形式で返します。",
        temperature: 1,
        topP: 0.95,
        topK: 64,
      },
    });

    const jsonStr = response.text.trim();
    const data: PetNameResponse = JSON.parse(jsonStr);

    if (!data || !Array.isArray(data.names)) {
      console.error("Invalid response format from Gemini API:", data);
      throw new Error("Failed to parse pet names from API response.");
    }
    return data.names;
  } catch (error) {
    console.error("Error generating pet names with Gemini API:", error);
    throw new Error(`ペットの名前を生成できませんでした: ${error instanceof Error ? error.message : String(error)}`);
  }
};
