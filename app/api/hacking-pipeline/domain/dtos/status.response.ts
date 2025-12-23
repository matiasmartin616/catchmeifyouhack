import HackingPipelineInstance from "../entities/hacking-pipeline-instance";

export class StatusResponse {
  constructor(public readonly pipelineInstanceInfo: HackingPipelineInstance) {}
}
