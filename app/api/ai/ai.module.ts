import { AIModuleInterface } from "./ai.module.i";
import { AIServiceInterface } from "./services/ai.service.i";
import { AIService } from "./services/ai.service";
import { AtlasCloudAdapter } from "./infra/adapters/atlascloud/atlascloud.adapter";

export class AIModule implements AIModuleInterface {
  constructor(private readonly aiService: AIServiceInterface) {}

  async textToText(prompt: string): Promise<string> {
    return this.aiService.textToText(prompt);
  }
}

const atlasCloudAdapter = new AtlasCloudAdapter();
const aiService = new AIService(atlasCloudAdapter);

export const aiModule = new AIModule(aiService);
