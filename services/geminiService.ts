
import { GoogleGenAI, Type } from "@google/genai";
import { Category } from "../types";
import { ALL_CATEGORIES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const categorizeIssue = async (description: string): Promise<Category> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following user report, what is the best category? Description: "${description}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: `The most relevant category for the issue. Must be one of: ${ALL_CATEGORIES.join(', ')}`,
              enum: ALL_CATEGORIES
            }
          },
          required: ["category"]
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    const category = result.category;

    if (Object.values(Category).includes(category)) {
      return category as Category;
    }

    console.warn(`Gemini returned an unknown category: ${category}. Defaulting to 'Other'.`);
    return Category.Other;
  } catch (error) {
    console.error("Error categorizing issue with Gemini:", error);
    // Fallback to 'Other' if the API call fails or parsing is unsuccessful
    return Category.Other;
  }
};
