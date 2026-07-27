export interface LanguageModel {
  generateResponse(prompt: string): Promise<string>;
}
