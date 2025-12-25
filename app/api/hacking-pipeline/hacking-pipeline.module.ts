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
    if (!statusRequest.pipelineId) {
      throw new Error("Pipeline ID is required");
    }

    const hackingPipelineInstance =
      this.hackingPipelineService.getPipelineInstanceById(
        statusRequest.pipelineId
      );

    if (!hackingPipelineInstance) {
      throw new Error("Hacking pipeline instance not found");
    }

    return new StatusResponse(hackingPipelineInstance);
  }

  async generateReport(instanceId: string): Promise<Buffer> {
    return await this.hackingPipelineService.generateReportByInstanceId(
      instanceId
    );
  }
}

export const hackingPipelineModule = new HackingPipelineModule(
  hackingPipelineService
);
