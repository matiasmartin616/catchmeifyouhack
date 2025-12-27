// Simplified Types based on NVD API 2.0 structure
// https://nvd.nist.gov/developers/vulnerabilities

export interface NvdCvssMetricV31 {
  cvssData: {
    baseScore: number;
    baseSeverity: string;
    version: string;
    vectorString: string;
  };
  exploitabilityScore?: number;
  impactScore?: number;
}

export interface NvdCveItem {
  id: string;
  descriptions: Array<{
    lang: string;
    value: string;
  }>;
  metrics?: {
    cvssMetricV31?: NvdCvssMetricV31[];
  };
  references?: Array<{
    url: string;
    source?: string;
  }>;
  published: string;
  lastModified: string;
  vulnStatus?: string;
}

export interface NvdVulnerabilityItem {
  cve: NvdCveItem;
}

export interface NvdApiResponseDTO {
  resultsPerPage: number;
  startIndex: number;
  totalResults: number;
  format: string;
  version: string;
  timestamp: string;
  vulnerabilities: NvdVulnerabilityItem[];
}
