export interface AIServiceInterface {
  textToText(prompt: string): Promise<string>;
}
