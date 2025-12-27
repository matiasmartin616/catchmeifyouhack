import { VulnerabilityAnalysisResult } from "../domain/entities/vuln-analysis-result.entity";
import HackingPipelineInstance from "../../../domain/entities/hacking-pipeline-instance";

export interface VulnAnalysisServiceInterface {
  analyze(
    instance: HackingPipelineInstance
  ): Promise<VulnerabilityAnalysisResult>;
}
