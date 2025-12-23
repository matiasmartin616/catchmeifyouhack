export enum HackingPipelineStatus {
  PENDING = "PENDING",
  LAUNCHED = "LAUNCHED",
  SCOPING = "SCOPING",
  SCANNING = "SCANNING",
  EXPLOITING = "EXPLOITING",
  POST_EXPLOITING = "POST_EXPLOITING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export default class HackingPipelineInstance {
  constructor(
    public readonly pipelineId: string,
    public readonly status: HackingPipelineStatus,
    public readonly targetUrl: string,
    public readonly results: Map<string, string>,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
