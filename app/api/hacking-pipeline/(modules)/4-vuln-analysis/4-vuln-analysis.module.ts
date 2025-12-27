import { VulnAnalysisServiceInterface } from "./services/vuln-analysis.service.i";
import { VulnAnalysisService } from "./services/vuln-analysis.service";
import { NvdAdapter } from "./infra/adapters/nvd.adapter";
import { aiModule } from "../../../ai/ai.module";
import { VulnerabilityAnalysisResult } from "./domain/entities/vuln-analysis-result.entity";
import HackingPipelineInstance from "../../domain/entities/hacking-pipeline-instance";

export interface VulnAnalysisModuleInterface {
  runAnalysis(
    instance: HackingPipelineInstance
  ): Promise<VulnerabilityAnalysisResult>;
}

export class VulnAnalysisModule implements VulnAnalysisModuleInterface {
  constructor(private readonly service: VulnAnalysisServiceInterface) {}

  async runAnalysis(
    instance: HackingPipelineInstance
  ): Promise<VulnerabilityAnalysisResult> {
    return this.service.analyze(instance);
  }
}

const nvdAdapter = new NvdAdapter();
const vulnAnalysisService = new VulnAnalysisService(nvdAdapter, aiModule);

export const vulnAnalysisModule = new VulnAnalysisModule(vulnAnalysisService);
