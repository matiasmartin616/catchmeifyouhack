import {
  VulnDatabasePort,
  VulnDatabaseQuery,
} from "../ports/vuln-database.port";
import { VulnerabilityFinding } from "../../domain/entities/vuln-analysis-result.entity";
import { NvdApiResponseDTO } from "../dtos/nvd-api.dto";
import { NvdMapper } from "../mappers/nvd.mapper";

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

      const data: NvdApiResponseDTO = await response.json();
      return NvdMapper.toDomain(data, query);
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
        set("pubStartDate", q.pubStartDate);
        set("pubEndDate", clampedEnd.toISOString());
      } else {
        set("pubStartDate", q.pubStartDate);
        set("pubEndDate", q.pubEndDate);
      }
    }

    url.searchParams.set("resultsPerPage", "50");
    url.searchParams.set("startIndex", "0");

    return url.toString();
  }
}
