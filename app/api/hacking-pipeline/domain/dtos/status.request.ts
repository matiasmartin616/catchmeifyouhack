export interface StatusRequestDTO {
  pipelineId: string;
}

export class StatusRequest implements StatusRequestDTO {
  constructor(public readonly pipelineId: string) {}
}
