import {
  VulnerabilityAnalysisResult,
  VulnerabilityFinding,
} from "../../4-vuln-analysis/domain/entities/vuln-analysis-result.entity";

export class HtmlVulnBuilder {
  static build(vuln?: VulnerabilityAnalysisResult): string {
    if (!vuln || !vuln.vulnerabilities || vuln.vulnerabilities.length === 0) {
      return `
        <div class="section">
           <h1>Vulnerability Analysis</h1>
           <div class="card">
             <p style="color: var(--primary); text-align: center;">No significant vulnerabilities found (or module pending).</p>
           </div>
        </div>
      `;
    }

    // Sort by severity (Critical > High > Medium > Low)
    const severityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    const sortedVulns = [...vuln.vulnerabilities].sort((a, b) => {
      return (
        (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0)
      );
    });

    return `
      <div class="section">
        <h1>Possible Vulnerabilities</h1>
        
        ${sortedVulns
          .map((v) => this.buildVulnCard(v))
          .join("<div style='height: 20px;'></div>")}
      </div>
    `;
  }

  private static buildVulnCard(v: VulnerabilityFinding): string {
    const badgeClass = `badge-${v.severity.toLowerCase()}`;

    // Check if searchContext exists to avoid errors
    const searchCtx = v.searchContext || {};
    const searchDetails = Object.entries(searchCtx)
      .filter(
        ([k]) =>
          k !== "keywordSearch" && k !== "virtualMatchString" && k !== "cpeName"
      ) // hide obvious ones used in title if redundant
      .map(([k, val]) => `${k}: ${val}`)
      .join(", ");

    return `
      <div class="card" style="border-top: 4px solid var(--${v.severity.toLowerCase()});">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h2 style="margin: 0; font-size: 16px; border: none;">${
            v.cveName
          }</h2>
          <span class="badge ${badgeClass}">${v.severity}</span>
        </div>
        
        <div style="margin-bottom: 10px; font-size: 12px; color: var(--text-dim);">
          <strong>Affected Technology:</strong> <span style="color: var(--text-light)">${
            v.affectedTechnology || "Unknown"
          }</span>
        </div>

        <p style="font-size: 13px; margin-bottom: 15px;">${v.description}</p>

        <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 4px;">
           <strong style="font-size: 11px; text-transform: uppercase; color: var(--text-dim);">Recommendations & References</strong>
           <ul style="margin: 5px 0 0 0; padding-left: 20px; font-size: 12px;">
             ${v.recommendations
               .map(
                 (rec) => `
               <li><a href="${rec}" target="_blank">${rec}</a></li>
             `
               )
               .join("")}
           </ul>
        </div>
        
        ${
          searchDetails
            ? `
        <div style="margin-top: 5px; font-size: 10px; color: var(--text-dim); text-align: right;">
           Search Context: ${searchDetails}
        </div>`
            : ""
        }
      </div>
    `;
  }
}
