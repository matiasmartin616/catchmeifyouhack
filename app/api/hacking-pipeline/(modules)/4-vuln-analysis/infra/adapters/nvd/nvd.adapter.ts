import {
  VulnDatabasePort,
  VulnDatabaseQuery,
} from "../../ports/vuln-database.port";
import { VulnerabilityFinding } from "../../../domain/entities/vuln-analysis-result.entity";

//simplified, nvd api response is more complex
interface NvdApiResponse {
  vulnerabilities: Array<{
    cve: {
      id: string;
      descriptions: Array<{ lang: string; value: string }>;
      metrics?: {
        cvssMetricV31?: Array<{
          cvssData: { baseScore: number; baseSeverity: string };
        }>;
      };
      references?: Array<{ url: string }>;
    };
  }>;
}

export class NvdAdapter implements VulnDatabasePort {
  private readonly baseUrl = "https://services.nvd.nist.gov/rest/json/cves/2.0";
  private readonly apiKey?: string;

  constructor() {
    this.apiKey = process.env.NVD_API_KEY;
  }

  async findVulnerabilities(
    query: VulnDatabaseQuery
  ): Promise<VulnerabilityFinding[]> {
    const url = this.buildNvdUrl(query);

    try {
      const headers: Record<string, string> = {};
      if (this.apiKey) {
        headers["apiKey"] = this.apiKey;
      }

      console.log(`[NVD] Fetching: ${url}`);
      const response = await fetch(url, { headers });

      if (!response.ok) {
        console.error(
          `NVD API Error: ${response.status} ${
            response.statusText
          } for query ${JSON.stringify(query)}`
        );
        // If 404, it might just mean no results found for this specific query criteria
        if (response.status === 404) return [];
        return [];
      }

      const data: NvdApiResponse = await response.json();
      return this.mapToFindings(data, query);
    } catch (error) {
      console.error(`Failed to fetch NVD data:`, error);
      return [];
    }
  }

  private buildNvdUrl(q: VulnDatabaseQuery): string {
    const url = new URL(this.baseUrl);

    const set = (k: string, v?: string) => {
      if (v) url.searchParams.set(k, v);
    };

    set("keywordSearch", q.keywordSearch);
    set("cpeName", q.cpeName);
    set("virtualMatchString", q.virtualMatchString);

    // Only set version params if virtualMatchString or cpeName is present (usually required context)
    if (q.virtualMatchString || q.cpeName) {
      set("versionStart", q.versionStart);
      set("versionEnd", q.versionEnd);
      set("versionStartType", q.versionStartType);
      set("versionEndType", q.versionEndType);
    }

    // Date Logic: NVD requires BOTH start and end if one is present. Max range 120 days.
    // If only one date provided, we ignore it to avoid API error.
    // If range > 120 days, we clamp it to 120 days from start.
    if (q.pubStartDate && q.pubEndDate) {
      const start = new Date(q.pubStartDate);
      const end = new Date(q.pubEndDate);
      const diffDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);

      if (diffDays > 120) {
        console.warn("[NVD] Date range > 120 days, clamping to 120 days.");
        const clampedEnd = new Date(start);
        clampedEnd.setDate(clampedEnd.getDate() + 120);
        set("pubStartDate", q.pubStartDate); // Already ISO string hopefully or we format
        set("pubEndDate", clampedEnd.toISOString());
      } else {
        set("pubStartDate", q.pubStartDate);
        set("pubEndDate", q.pubEndDate);
      }
    }

    url.searchParams.set("resultsPerPage", "50");
    url.searchParams.set("startIndex", "0");
    // url.searchParams.append("noRejected", ""); // API might complain if empty value param structure varies

    return url.toString();
  }

  private mapToFindings(
    data: NvdApiResponse,
    query: VulnDatabaseQuery
  ): VulnerabilityFinding[] {
    if (!data.vulnerabilities) return [];

    return data.vulnerabilities.map((item) => {
      const cve = item.cve;
      const description =
        cve.descriptions.find((d) => d.lang === "en")?.value ||
        "No description available";

      const metrics = cve.metrics?.cvssMetricV31?.[0]?.cvssData;
      let severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";

      if (metrics) {
        if (metrics.baseScore >= 9.0) severity = "CRITICAL";
        else if (metrics.baseScore >= 7.0) severity = "HIGH";
        else if (metrics.baseScore >= 4.0) severity = "MEDIUM";
        else severity = "LOW";
      }

      const references = cve.references?.map((r) => r.url).slice(0, 3) || [];
      const link = `https://nvd.nist.gov/vuln/detail/${cve.id}`;

      // Identify technology from query
      let affectedTechnology = "Unknown";
      if (query.cpeName) affectedTechnology = query.cpeName;
      else if (query.virtualMatchString)
        affectedTechnology = query.virtualMatchString;
      else if (query.keywordSearch) affectedTechnology = query.keywordSearch;

      return new VulnerabilityFinding(
        cve.id,
        severity,
        description,
        [link, ...references],
        affectedTechnology,
        query
      );
    });
  }
}
