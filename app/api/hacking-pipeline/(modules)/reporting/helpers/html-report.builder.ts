import HackingPipelineInstance from "../../../domain/entities/hacking-pipeline-instance";
import { HtmlReportOrchestrator } from "./html-report.orchestrator";

export class HtmlReportBuilder {
  static build(instance: HackingPipelineInstance): string {
    return HtmlReportOrchestrator.build(instance);
  }
}
