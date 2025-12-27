import HackingPipelineInstance from "../../../domain/entities/hacking-pipeline-instance";
import { VulnerabilityAnalysisResult } from "../../4-vuln-analysis/domain/entities/vuln-analysis-result.entity";
import { marked } from "marked";

export class HtmlSummaryBuilder {
  static build(
    instance: HackingPipelineInstance,
    vulnResult?: VulnerabilityAnalysisResult
  ): string {
    // If we have an AI summary from the vuln analysis, use it.
    // Otherwise fallback to a generic message.
    let content = "";

    if (vulnResult && vulnResult.aiSummary) {
      // Convert markdown to HTML
      content = marked.parse(vulnResult.aiSummary) as string;
    } else {
      content = `
        <p>No vulnerability analysis summary available.</p>
        <p>Pipeline Status: <strong>${instance.status}</strong></p>
      `;
    }

    return `
      <div class="section">
        <h1>Executive Summary</h1>
        <div class="card markdown-content">
          ${content}
        </div>
      </div>
    `;
  }
}
