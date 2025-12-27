import { AIPort } from "../infra/ports/ai.port";
import { AIServiceInterface } from "./ai.service.i";

export class AIService implements AIServiceInterface {
  constructor(private readonly aiAdapter: AIPort) {}

  async textToText(prompt: string): Promise<string> {
    return this.aiAdapter.textToText(prompt);
  }
}
