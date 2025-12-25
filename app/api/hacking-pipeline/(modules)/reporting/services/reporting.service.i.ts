import HackingPipelineInstance from "../../../domain/entities/hacking-pipeline-instance";

export interface ReportingServiceInterface {
  generateReport(instance: HackingPipelineInstance): Promise<Buffer>;
}
