export interface AIPort {
  textToText(prompt: string): Promise<string>;
}
