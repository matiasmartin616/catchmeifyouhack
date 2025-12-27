import HackingPipelineInstance from "../../../domain/entities/hacking-pipeline-instance";
import { PdfGeneratorPort } from "../infra/ports/pdf-generator.port";
import { HtmlReportBuilder } from "../helpers/html-report.builder";
import { ReportingServiceInterface } from "./reporting.service.i";

export class ReportingService implements ReportingServiceInterface {
  constructor(private readonly pdfGenerator: PdfGeneratorPort) {}

  async generateReport(instance: HackingPipelineInstance): Promise<Buffer> {
    // 1. Build HTML (Presentation Logic)
    // Pass the full instance directly to the builder/orchestrator
    // The builder will extract what it needs from instance.results
    const htmlContent = HtmlReportBuilder.build(instance);

    // 2. Generate PDF (Infrastructure/Adapter Logic)
    return this.pdfGenerator.generateFromHtml(htmlContent);
  }
}
