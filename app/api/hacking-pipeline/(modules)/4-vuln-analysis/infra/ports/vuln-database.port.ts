import { z } from "zod";
import { VulnerabilityFinding } from "../../domain/entities/vuln-analysis-result.entity";

export const VulnDatabaseQuerySchema = z.object({
  keywordSearch: z.string().optional(),
  cpeName: z.string().optional(),
  virtualMatchString: z.string().optional(),
  versionStart: z.string().optional(),
  versionEnd: z.string().optional(),
  versionStartType: z.enum(["including", "excluding"]).optional(),
  versionEndType: z.enum(["including", "excluding"]).optional(),
  pubStartDate: z.string().optional(),
  pubEndDate: z.string().optional(),
});

export type VulnDatabaseQuery = z.infer<typeof VulnDatabaseQuerySchema>;

export interface VulnDatabasePort {
  findVulnerabilities(
    query: VulnDatabaseQuery
  ): Promise<VulnerabilityFinding[]>;
}
