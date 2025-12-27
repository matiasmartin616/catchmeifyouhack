import {
  VulnerabilityAnalysisResult,
  VulnerabilityFinding,
} from "../domain/entities/vuln-analysis-result.entity";
import {
  VulnDatabasePort,
  VulnDatabaseQuery,
  VulnDatabaseQuerySchema,
} from "../infra/ports/vuln-database.port";
import { VulnAnalysisServiceInterface } from "./vuln-analysis.service.i";
import { AIModuleInterface } from "../../../../ai/ai.module.i";
import HackingPipelineInstance, {
  HackingPipelineResultKey,
} from "../../../domain/entities/hacking-pipeline-instance";
import { ReconResultEntity } from "../../2-recon/domain/entities";

export class VulnAnalysisService implements VulnAnalysisServiceInterface {
  constructor(
    private readonly vulnDb: VulnDatabasePort,
    private readonly aiModule: AIModuleInterface
  ) {}

  async analyze(
    instance: HackingPipelineInstance
  ): Promise<VulnerabilityAnalysisResult> {
    const target = instance.targetUrl;
    const reconData = instance.results[HackingPipelineResultKey.RECON] as
      | ReconResultEntity
      | undefined;

    const technologies = reconData?.techStack?.technologies || [];

    // Pass the relevant instance data to AI for query generation
    const queries = await this.generateQueriesWithAI(instance);

    const allFindings: VulnerabilityFinding[] = [];
    const promises = queries.map((query) =>
      this.vulnDb.findVulnerabilities(query)
    );
    const results = await Promise.all(promises);

    results.forEach((findings) => allFindings.push(...findings));

    let summary = "Automated analysis completed.";
    if (allFindings.length > 0) {
      try {
        summary = await this.aiModule.textToText(`
            Summarize these vulnerability findings for ${target}.
            Context: The target is running ${JSON.stringify(technologies)}.
            Findings: ${JSON.stringify(allFindings.slice(0, 15))}
        `);
      } catch (err) {
        console.error("Summary generation failed", err);
      }
    }

    const techNames = technologies.map((t) =>
      typeof t === "string" ? t : JSON.stringify(t)
    );

    return new VulnerabilityAnalysisResult(
      target,
      new Date(),
      techNames,
      allFindings,
      summary
    );
  }

  private async generateQueriesWithAI(
    instance: HackingPipelineInstance
  ): Promise<VulnDatabaseQuery[]> {
    const prompt = `
      I am analyzing a target for security vulnerabilities.
      
      Pipeline Data:
      ${JSON.stringify(instance.results)}

      Based on this FULL context (technologies, headers, osint, crawl data), generate precise NVD (National Vulnerability Database) search queries.
      
      CRITICAL INSTRUCTIONS FOR NVD API 2.0:
      1. cpeName: Use only if you have a precise CPE 2.3 string.
      2. virtualMatchString: Use this for broad matching (e.g. "cpe:2.3:a:vendor:product"). If you use this, you MUST NOT set cpeName.
      3. versionStart / versionEnd: Use these ONLY with virtualMatchString.
      4. keywordSearch: Use as a fallback for general text search.
      5. pubStartDate / pubEndDate: ALWAYS provide BOTH if using dates. Max range is 120 days. If version is unknown, use the last 90 days range (e.g. from 90 days ago to today).
      
      IMPORTANT CONSTRAINTS:
      - DO NOT use future dates (no dates beyond today)
      - DO NOT combine multiple unrelated technologies in keywordSearch
      - DO NOT use generic searches like "vulnerability" or "security advisory" alone
      - Prefer CPE-based searches over keyword searches when possible
      - If version is unknown, omit version parameters and use broader date ranges
      - Maximum date range: 120 days

      Output MUST be a valid JSON array of objects matching this TypeScript interface:
      
      interface VulnQuery {
        keywordSearch?: string;
        cpeName?: string;
        virtualMatchString?: string;
        versionStart?: string;
        versionEnd?: string;
        versionStartType?: "including" | "excluding";
        versionEndType?: "including" | "excluding";
        pubStartDate?: string; // ISO String
        pubEndDate?: string;   // ISO String
      }
      
      Return ONLY the JSON array.
    `;

    try {
      const response = await this.aiModule.textToText(prompt);
      const cleanJson = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const queries = JSON.parse(cleanJson);

      if (!Array.isArray(queries)) {
        throw new Error("AI output is not an array");
      }

      // Validate and map to typed objects
      return queries
        .map((q: unknown) => {
          const item = q as Record<string, unknown>;
          // Normalize and validate
          const raw = {
            keywordSearch: item.keywordSearch || item.keyword, // Fallback for old AI output
            cpeName: item.cpeName,
            virtualMatchString: item.virtualMatchString,
            versionStart: item.versionStart,
            versionEnd: item.versionEnd,
            versionStartType: item.versionStartType,
            versionEndType: item.versionEndType,
            pubStartDate: item.pubStartDate,
            pubEndDate: item.pubEndDate,
          };

          // Safe parse to ignore invalid objects
          return VulnDatabaseQuerySchema.safeParse(raw);
        })
        .filter((result) => result.success)
        .map((result) => result.data!);
    } catch (error) {
      console.error("AI Query Generation failed:", error);

      // Fallback: Extract tech names manually if AI fails
      const recon = instance.results[HackingPipelineResultKey.RECON] as
        | ReconResultEntity
        | undefined;
      const techs = recon?.techStack?.technologies || [];

      return techs.map((tech) => ({
        keywordSearch: typeof tech === "string" ? tech : JSON.stringify(tech),
      }));
    }
  }
}
