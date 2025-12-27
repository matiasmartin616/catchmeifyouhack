export class VulnerabilityAnalysisResult {
  constructor(
    public target: string,
    public analysisDate: Date,
    public technologies: string[],
    public vulnerabilities: VulnerabilityFinding[],
    public aiSummary: string
  ) {}
}

export class VulnerabilityFinding {
  constructor(
    public cveName: string,
    public severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    public description: string,
    public recommendations: string[],
    public affectedTechnology: string,
    public searchContext: Record<string, unknown>
  ) {}
}
