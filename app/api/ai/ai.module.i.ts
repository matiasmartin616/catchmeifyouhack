export interface AIModuleInterface {
  textToText(prompt: string): Promise<string>;
}
