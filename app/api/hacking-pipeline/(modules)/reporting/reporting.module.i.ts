import HackingPipelineInstance from "../../domain/entities/hacking-pipeline-instance";

export interface ReportingModuleInterface {
  generateReport(instance: HackingPipelineInstance): Promise<Buffer>;
}
