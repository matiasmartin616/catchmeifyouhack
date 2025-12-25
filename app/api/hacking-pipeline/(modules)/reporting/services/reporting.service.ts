import HackingPipelineInstance, {
  HackingPipelineResultKey,
} from "../../../domain/entities/hacking-pipeline-instance";
import { ReconResultEntity } from "../../2-recon/domain/entities";
import { ReportDataEntity } from "../domain/entities";
import { PdfGeneratorPort } from "../infra/ports/pdf-generator.port";
import { HtmlReportBuilder } from "../helpers/html-report.builder";
import { ReportingServiceInterface } from "./reporting.service.i";

export class ReportingService implements ReportingServiceInterface {
  constructor(private readonly pdfGenerator: PdfGeneratorPort) {}

  async generateReport(instance: HackingPipelineInstance): Promise<Buffer> {
    const reconResult = instance.results[HackingPipelineResultKey.RECON] as
      | ReconResultEntity
      | undefined;

    const reportData = new ReportDataEntity(
      instance.targetUrl,
      instance.createdAt,
      instance.status,
      reconResult
    );

    // 1. Build HTML (Presentation Logic)
    const htmlContent = HtmlReportBuilder.build(reportData);

    // 2. Generate PDF (Infrastructure/Adapter Logic)
    return this.pdfGenerator.generateFromHtml(htmlContent);
  }
}
