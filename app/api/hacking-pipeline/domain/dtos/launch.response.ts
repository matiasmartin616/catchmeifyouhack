export interface LaunchResponseDTO {
  pipelineId?: string;
  error?: string;
}

export class LaunchResponse implements LaunchResponseDTO {
  constructor(
    public readonly pipelineId?: string,
    public readonly error?: string
  ) {}
}
