import HackingPipelineInstance from "../../domain/entities/hacking-pipeline-instance";
import { PuppeteerReportAdapter } from "./infra/adapters/puppeteer-report.adapter";
import { ReportingModuleInterface } from "./reporting.module.i";
import { ReportingService } from "./services";

export class ReportingModule implements ReportingModuleInterface {
  constructor(private readonly reportingService: ReportingService) {}

  async generateReport(instance: HackingPipelineInstance): Promise<Buffer> {
    return this.reportingService.generateReport(instance);
  }
}

// Composition Root for this module
const reportAdapter = new PuppeteerReportAdapter();
const reportingService = new ReportingService(reportAdapter);

export const reportingModule = new ReportingModule(reportingService);
