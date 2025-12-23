import {
  LaunchRequest,
  LaunchResponse,
  StatusRequest,
  StatusResponse,
} from "../domain/dtos/index";

import HackingPipelineInstance, {
  HackingPipelineStatus,
} from "../domain/entities/hacking-pipeline-instance";

export interface HackingPipelineServiceInterface {
  launch(request: LaunchRequest): Promise<LaunchResponse>;
  status(statusRequest: StatusRequest): Promise<StatusResponse>;
}

export class HackingPipelineService implements HackingPipelineServiceInterface {
  async launch(request: LaunchRequest): Promise<LaunchResponse> {
    // Logic for launching the pipeline with the URL: request.url
    // Avoid unused var error
    const _ = request;
    // For now, return a mock ID
    const pipelineId = crypto.randomUUID();
    return new LaunchResponse(pipelineId.toString());
  }

  async status(statusRequest: StatusRequest): Promise<StatusResponse> {
    // Logic for checking pipeline status
    // For now, return mock data
    return new StatusResponse(
      new HackingPipelineInstance(
        statusRequest.pipelineId,
        HackingPipelineStatus.POST_EXPLOITING,
        "",
        new Map(),
        new Date(),
        new Date()
      )
    );
  }
}

export const hackingPipelineService = new HackingPipelineService();
