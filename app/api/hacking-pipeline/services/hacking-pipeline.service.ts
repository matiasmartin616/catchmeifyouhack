import {
  LaunchRequest,
  LaunchResponse,
  StatusRequest,
  StatusResponse,
} from "../domain/dtos/index";

import HackingPipelineInstance, {
  HackingPipelineStatus,
} from "../domain/entities/hacking-pipeline-instance";
import { hackingPipelineInstanceStore } from "../infra/store/hacking-pipeline-instance.store";

export interface HackingPipelineServiceInterface {
  launch(request: LaunchRequest): Promise<LaunchResponse>;
  nextStatus(pipelineId: string): Promise<HackingPipelineInstance>;
  getPipelineInstanceById(id: string): HackingPipelineInstance | undefined;
  getInstanceById(id: string): HackingPipelineInstance | undefined;
}

export class HackingPipelineService implements HackingPipelineServiceInterface {
  async launch(request: LaunchRequest): Promise<LaunchResponse> {
    const hackingPipelineInstance = new HackingPipelineInstance(
      crypto.randomUUID(),
      HackingPipelineStatus.PENDING,
      request.url,
      new Map(),
      new Date(),
      new Date()
    );

    const pipelineId = hackingPipelineInstanceStore.create(
      hackingPipelineInstance
    );

    return new LaunchResponse(pipelineId.toString());
  }

  async nextStatus(pipelineId: string): Promise<HackingPipelineInstance> {
    const hackingPipelineInstance =
      hackingPipelineInstanceStore.getById(pipelineId);

    if (!hackingPipelineInstance) {
      throw new Error("Hacking pipeline instance not found");
    }

    const nextStatus = hackingPipelineInstance.nextStatus(
      hackingPipelineInstance.status
    );

    hackingPipelineInstanceStore.update(hackingPipelineInstance);

    return hackingPipelineInstance;
  }

  getPipelineInstanceById(id: string): HackingPipelineInstance | undefined {
    return hackingPipelineInstanceStore.getById(id);
  }

  getInstanceById(id: string): HackingPipelineInstance | undefined {
    return hackingPipelineInstanceStore.getById(id);
  }
}

export const hackingPipelineService = new HackingPipelineService();
