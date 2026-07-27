import { GoogleGenAI } from "@google/genai";
import type { LanguageModel } from "./LanguageModel";

export class Gemini implements LanguageModel {
  private client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });
  }

  async generateResponse(prompt: string): Promise<string> {
    const response = await this.client.models.generateContent({
      model: process.env.GEMINI_MODEL!,
      contents: prompt,
    });
    return response.text ?? "";
  }
}
