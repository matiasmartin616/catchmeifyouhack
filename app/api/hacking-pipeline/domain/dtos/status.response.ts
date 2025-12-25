import HackingPipelineInstance from "../entities/hacking-pipeline-instance";

// DTO for the wire (JSON)
export interface StatusResponseDTO {
  pipelineInstanceInfo: HackingPipelineInstance;
}

export class StatusResponse implements StatusResponseDTO {
  constructor(public readonly pipelineInstanceInfo: HackingPipelineInstance) {}
}
