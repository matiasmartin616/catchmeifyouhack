import { VulnerabilityFinding } from "../../domain/entities/vuln-analysis-result.entity";
import { VulnDatabaseQuery } from "../ports/vuln-database.port";
import { NvdApiResponseDTO, NvdVulnerabilityItem } from "../dtos/nvd-api.dto";

export class NvdMapper {
  static toDomain(
    data: NvdApiResponseDTO,
    query: VulnDatabaseQuery
  ): VulnerabilityFinding[] {
    if (!data.vulnerabilities || !Array.isArray(data.vulnerabilities)) {
      return [];
    }

    return data.vulnerabilities.map((item) =>
      this.mapItemToFinding(item, query)
    );
  }

  private static mapItemToFinding(
    item: NvdVulnerabilityItem,
    query: VulnDatabaseQuery
  ): VulnerabilityFinding {
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
      query as Record<string, unknown>
    );
  }
}
