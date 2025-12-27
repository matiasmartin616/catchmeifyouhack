import { ReconResultEntity } from "../../2-recon/domain/entities";

export class HtmlReconBuilder {
  static build(recon?: ReconResultEntity): string {
    if (!recon) return "";

    const techStack = recon.techStack?.technologies || [];
    const headers = recon.techStack?.headers || {};
    const subdomains = recon.osint?.subdomains || [];
    const geo = recon.osint?.geoIp;

    return `
      <div class="section">
        <h1>Reconnaissance & OSINT</h1>
        
        <div class="grid">
          <div class="card">
            <h2>Technology Stack</h2>
            <ul style="list-style: none; padding: 0;">
              ${techStack
                .map(
                  (t) =>
                    `<li style="padding: 5px 0; border-bottom: 1px dashed var(--border);">${
                      typeof t === "string" ? t : JSON.stringify(t)
                    }</li>`
                )
                .join("")}
            </ul>
          </div>

          <div class="card">
            <h2>Infrastructure</h2>
            <p><strong>IP:</strong> ${geo?.ip || "Unknown"}</p>
            <p><strong>Location:</strong> ${geo?.city || "-"}, ${
      geo?.country || "-"
    }</p>
            <p><strong>ISP:</strong> ${geo?.isp || "-"}</p>
            <p><strong>ASN:</strong> ${geo?.asn || "-"}</p>
          </div>
        </div>

        <div class="card" style="margin-top: 15px;">
          <h2>Security Headers</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            ${Object.entries(headers)
              .map(
                ([k, v]) => `
              <div style="font-size: 10px;">
                <span style="color: var(--primary)">${k}:</span> 
                <span style="color: var(--text-dim)">${String(v).substring(
                  0,
                  50
                )}${String(v).length > 50 ? "..." : ""}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        ${
          subdomains.length > 0
            ? `
          <div class="card" style="margin-top: 15px;">
            <h2>Discovered Subdomains (${subdomains.length})</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${subdomains
                .slice(0, 20)
                .map(
                  (d) =>
                    `<span style="background: var(--border); padding: 4px 8px; border-radius: 4px; font-size: 11px;">${d}</span>`
                )
                .join("")}
              ${
                subdomains.length > 20
                  ? `<span style="padding: 4px;">...and ${
                      subdomains.length - 20
                    } more</span>`
                  : ""
              }
            </div>
          </div>
        `
            : ""
        }
      </div>
      <div class="page-break"></div>
    `;
  }
}
