import { VulnerabilityAnalysisResult } from "../../(modules)/4-vuln-analysis/domain/entities/vuln-analysis-result.entity";
import { ReconResultEntity } from "../../(modules)/2-recon/domain/entities";
import { ScanResultEntity } from "../../(modules)/3-scan/domain/entities/scan-result.entity";

export enum HackingPipelineStatus {
  PENDING = "PENDING",
  LAUNCHED = "LAUNCHED",
  SCOPING = "SCOPING",
  RECON = "RECON",
  SCANNING = "SCANNING",
  VULN_ANALYSIS = "VULN_ANALYSIS",
  EXPLOITING = "EXPLOITING",
  POST_EXPLOITING = "POST_EXPLOITING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum HackingPipelineResultKey {
  RECON = "recon",
  SCANNING = "scanning",
  VULN_ANALYSIS = "vuln_analysis",
}

export default class HackingPipelineInstance {
  constructor(
    public readonly pipelineId: string,
    public status: HackingPipelineStatus,
    public readonly targetUrl: string,
    public results: Partial<
      Record<
        HackingPipelineResultKey,
        | string
        | ReconResultEntity
        | ScanResultEntity
        | VulnerabilityAnalysisResult
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
    data:
      | string
      | ReconResultEntity
      | ScanResultEntity
      | VulnerabilityAnalysisResult
  ) {
    this.results[key] = data;
    this.updatedAt = new Date();
  }
}
