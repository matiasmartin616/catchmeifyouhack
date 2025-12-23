import { HackingPipelineInterface } from "./hacking-pipeline.module.i";
import {
  hackingPipelineService,
  HackingPipelineServiceInterface,
} from "./services/hacking-pipeline.service";
import {
  LaunchRequest,
  LaunchResponse,
  StatusRequest,
  StatusResponse,
} from "./domain/dtos";

class HackingPipelineModule implements HackingPipelineInterface {
  constructor(
    private readonly hackingPipelineService: HackingPipelineServiceInterface
  ) {}

  async launch(request: LaunchRequest): Promise<LaunchResponse> {
    return await this.hackingPipelineService.launch(request);
  }

  async status(statusRequest: StatusRequest): Promise<StatusResponse> {
    return await this.hackingPipelineService.status(statusRequest);
  }
}

export const hackingPipelineModule = new HackingPipelineModule(
  hackingPipelineService
);
