import { ReconResultEntity } from "../../(modules)/2-recon/domain/entities";
import { ScanResultEntity } from "../../(modules)/3-scan/domain/entities/scan-result.entity";
export enum HackingPipelineStatus {
  PENDING = "PENDING",
  LAUNCHED = "LAUNCHED",
  SCOPING = "SCOPING",
  RECON = "RECON",
  SCANNING = "SCANNING",
  EXPLOITING = "EXPLOITING",
  POST_EXPLOITING = "POST_EXPLOITING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum HackingPipelineResultKey {
  RECON = "recon",
  SCANNING = "scanning",
}

export default class HackingPipelineInstance {
  constructor(
    public readonly pipelineId: string,
    public status: HackingPipelineStatus,
    public readonly targetUrl: string,
    public results: Partial<
      Record<
        HackingPipelineResultKey,
        string | ReconResultEntity | ScanResultEntity
      >
    >,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  updateStatus(status: HackingPipelineStatus) {
    this.status = status;
    this.updatedAt = new Date();
  }

  addResult(
    key: HackingPipelineResultKey,
    data: string | ReconResultEntity | ScanResultEntity
  ) {
    this.results[key] = data;
    this.updatedAt = new Date();
  }
}
