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

  nextStatus(currentStatus: HackingPipelineStatus): HackingPipelineStatus {
    switch (currentStatus) {
      case HackingPipelineStatus.PENDING:
        return HackingPipelineStatus.LAUNCHED;

      case HackingPipelineStatus.LAUNCHED:
        return HackingPipelineStatus.SCOPING;

      case HackingPipelineStatus.SCOPING:
        return HackingPipelineStatus.SCANNING;

      case HackingPipelineStatus.SCANNING:
        return HackingPipelineStatus.EXPLOITING;

      case HackingPipelineStatus.EXPLOITING:
        return HackingPipelineStatus.POST_EXPLOITING;

      case HackingPipelineStatus.POST_EXPLOITING:
        return HackingPipelineStatus.COMPLETED;
    }

    throw new Error("Invalid status");
  }
}
