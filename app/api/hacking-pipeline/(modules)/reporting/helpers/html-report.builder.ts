import { ReportDataEntity } from "../domain/entities";

export class HtmlReportBuilder {
  static build(data: ReportDataEntity): string {
    const formatDate = (date: Date) => {
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };

    const osint = data.reconResults?.osint;
    const techStack = data.reconResults?.techStack;
    const whois = osint?.whois;
    const geoIp = osint?.geoIp;
    const dns = osint?.dns;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap');
            
            :root {
                --bg-color: #ffffff;
                --text-main: #0f172a;    /* Slate 900 */
                --text-muted: #64748b;   /* Slate 500 */
                --accent-primary: #16a34a; /* Green 600 - Un poco más oscuro para que se lea bien sobre blanco */
                --accent-light: #dcfce7;   /* Green 100 - Para fondos suaves */
                --border-color: #e2e8f0;   /* Slate 200 */
                --card-bg: #f8fafc;        /* Slate 50 */
                --danger: #ef4444;
            }

            body {
                background-color: var(--bg-color);
                color: var(--text-main);
                font-family: 'Roboto Mono', monospace;
                margin: 0;
                padding: 40px;
                font-size: 11px;
                line-height: 1.5;
                -webkit-print-color-adjust: exact;
            }

            /* Layout Elements */
            .page-container {
                border: 1px solid var(--border-color);
                padding: 40px;
                min-height: 900px;
                position: relative;
                /* Sutil grid de fondo tecnológico */
                background-image: 
                    linear-gradient(rgba(22, 163, 74, 0.03) 1px, transparent 1%),
                    linear-gradient(90deg, rgba(22, 163, 74, 0.03) 1px, transparent 1%);
                background-size: 20px 20px;
            }

            /* Decorative Corners */
            .corner {
                position: absolute;
                width: 15px;
                height: 15px;
                border: 2px solid var(--accent-primary);
                z-index: 10;
            }
            .tl { top: -1px; left: -1px; border-bottom: none; border-right: none; }
            .tr { top: -1px; right: -1px; border-bottom: none; border-left: none; }
            .bl { bottom: -1px; left: -1px; border-top: none; border-right: none; }
            .br { bottom: -1px; right: -1px; border-top: none; border-left: none; }

            /* Header */
            .header-strip {
                border-bottom: 2px solid var(--text-main);
                padding-bottom: 20px;
                margin-bottom: 40px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
            }

            .logo-text {
                font-size: 24px;
                font-weight: 700;
                color: var(--text-main);
                text-transform: uppercase;
                letter-spacing: -1px;
                border-left: 6px solid var(--accent-primary);
                padding-left: 15px;
            }

            .classification-badge {
                background: var(--text-main);
                color: white;
                padding: 4px 10px;
                font-size: 10px;
                font-weight: bold;
                letter-spacing: 1px;
                text-transform: uppercase;
            }

            /* Titles */
            h1 {
                font-size: 32px;
                font-weight: 700;
                margin: 0 0 10px 0;
                text-transform: uppercase;
                letter-spacing: -1px;
            }

            h2 {
                color: var(--text-main);
                font-size: 14px;
                font-weight: 700;
                text-transform: uppercase;
                border-bottom: 2px solid var(--border-color);
                padding-bottom: 8px;
                margin-top: 40px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                background: linear-gradient(90deg, var(--card-bg), transparent);
                padding: 8px;
            }

            h2::before {
                content: '//';
                color: var(--accent-primary);
                margin-right: 10px;
                font-weight: bold;
            }

            h3 {
                font-size: 12px;
                color: var(--text-muted);
                text-transform: uppercase;
                margin-top: 25px;
                margin-bottom: 10px;
                font-weight: 500;
                letter-spacing: 0.5px;
            }

            /* Meta Data Grid */
            .meta-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin-bottom: 40px;
                background: var(--card-bg);
                padding: 20px;
                border: 1px solid var(--border-color);
            }

            .meta-item label {
                display: block;
                color: var(--text-muted);
                font-size: 9px;
                text-transform: uppercase;
                margin-bottom: 4px;
                font-weight: 500;
            }

            .meta-item span {
                font-size: 12px;
                color: var(--text-main);
                font-weight: bold;
            }

            /* Tables & Data */
            .data-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 10px;
                border: 1px solid var(--border-color);
            }

            .data-table th {
                text-align: left;
                padding: 10px;
                background: var(--card-bg);
                color: var(--text-muted);
                border-bottom: 1px solid var(--border-color);
                text-transform: uppercase;
                font-weight: 600;
            }

            .data-table td {
                padding: 10px;
                border-bottom: 1px solid var(--border-color);
                color: var(--text-main);
            }
            
            .data-table tr:last-child td {
                border-bottom: none;
            }

            .terminal-window {
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-left: 3px solid var(--accent-primary);
                padding: 15px;
                color: var(--text-main);
                font-family: 'Roboto Mono', monospace;
                font-size: 10px;
                white-space: pre-wrap;
                position: relative;
            }

            /* Tech Tags */
            .tech-tag {
                display: inline-block;
                background: var(--accent-light);
                border: 1px solid var(--accent-primary);
                color: var(--accent-primary); /* Green text */
                color: #15803d; /* Darker green for contrast on light bg */
                padding: 4px 8px;
                font-size: 10px;
                font-weight: 500;
                margin-right: 6px;
                margin-bottom: 6px;
            }

            .footer {
                margin-top: 60px;
                border-top: 1px solid var(--border-color);
                padding-top: 20px;
                display: flex;
                justify-content: space-between;
                font-size: 8px;
                color: var(--text-muted);
                text-transform: uppercase;
            }
        </style>
    </head>
    <body>
        <div class="page-container">
            <!-- Decorative Corners -->
            <div class="corner tl"></div>
            <div class="corner tr"></div>
            <div class="corner bl"></div>
            <div class="corner br"></div>

            <!-- Header -->
            <div class="header-strip">
                <div>
                    <div class="logo-text">CATCH_ME_IF_YOU_HACK</div>
                    <div style="font-size: 10px; color: var(--text-muted); padding-left: 15px; margin-top: 5px;">AUTOMATED SECURITY PIPELINE</div>
                </div>
                <div class="classification-badge">
                    CONFIDENTIAL // DO NOT DISTRIBUTE
                </div>
            </div>

            <!-- Title & Meta -->
            <h1>Security Analysis Report</h1>
            <div class="meta-grid">
                <div class="meta-item">
                    <label>Target_Asset</label>
                    <span>${data.targetUrl}</span>
                </div>
                <div class="meta-item">
                    <label>Scan_Timestamp</label>
                    <span>${formatDate(data.scanDate)}</span>
                </div>
                <div class="meta-item">
                    <label>Operation_Status</label>
                    <span style="color: ${
                      data.status === "COMPLETED"
                        ? "var(--accent-primary)"
                        : "var(--text-main)"
                    }">[ ${data.status} ]</span>
                </div>
                <div class="meta-item">
                    <label>Session_ID</label>
                    <span>${data.targetUrl
                      .replace(/[^a-zA-Z0-9]/g, "")
                      .substring(0, 8)
                      .toUpperCase()}_${data.scanDate.getFullYear()}</span>
                </div>
            </div>

            <!-- Findings -->
            <h2>01_EXECUTIVE_SUMMARY</h2>
            <p>
                The automated pipeline has completed a non-destructive analysis of the target infrastructure.
                The scope included passive reconnaissance (OSINT) and technology stack fingerprinting.
                No active exploitation payloads were deployed during this phase.
            </p>

            ${
              data.reconResults
                ? `
            <h2>02_RECONNAISSANCE_INTEL</h2>
            
            ${
              geoIp
                ? `
            <h3>GEOLOCATION_DATA</h3>
            <table class="data-table">
                <tr>
                    <th width="30%">PARAMETER</th>
                    <th>DETECTED_VALUE</th>
                </tr>
                <tr>
                    <td>IP_ADDRESS</td>
                    <td style="font-weight: bold;">${geoIp.ip || "N/A"}</td>
                </tr>
                <tr>
                    <td>JURISDICTION</td>
                    <td>${geoIp.country || "Unknown"}</td>
                </tr>
                <tr>
                    <td>ISP_ORG</td>
                    <td>${geoIp.isp || "N/A"}</td>
                </tr>
                <tr>
                    <td>ASN</td>
                    <td>${geoIp.asn || "N/A"}</td>
                </tr>
            </table>
            `
                : ""
            }

            ${
              whois
                ? `
            <h3>REGISTRAR_INFO</h3>
            <div class="terminal-window">
Registrar:    ${
                    whois.registrarData?.["Registrar"] ||
                    whois.registryData?.["Registrar"] ||
                    "N/A"
                  }
Created:      ${whois.registrarData?.["Creation Date"] || "N/A"}
Expires:      ${whois.registrarData?.["Registry Expiry Date"] || "N/A"}
Name Servers: ${
                    (whois.registrarData?.["Name Server"] as string[])?.join(
                      ", "
                    ) || "N/A"
                  }
            </div>
            `
                : ""
            }

            ${
              dns
                ? `
            <h3>DNS_ZONE_DATA</h3>
            <table class="data-table">
                <tr>
                    <th width="20%">TYPE</th>
                    <th>RECORDS</th>
                </tr>
                ${Object.entries(dns)
                  .slice(0, 8)
                  .map(
                    ([type, records]) => `
                <tr>
                    <td style="color: var(--accent-primary); font-weight: bold;">${type}</td>
                    <td>
                        ${(records as string[])
                          .slice(0, 3)
                          .map((r) => `<div>${r}</div>`)
                          .join("")}
                        ${
                          (records as string[]).length > 3
                            ? `<div style="color: var(--text-muted); margin-top: 4px;">... +${
                                (records as string[]).length - 3
                              } entries</div>`
                            : ""
                        }
                    </td>
                </tr>
                `
                  )
                  .join("")}
            </table>
            `
                : ""
            }

            <h2>03_TECHNOLOGY_STACK</h2>
            
            ${
              techStack
                ? `
            <div style="margin-bottom: 20px; background: var(--card-bg); padding: 15px; border-left: 3px solid var(--text-muted);">
                <div style="font-size: 9px; color: var(--text-muted); margin-bottom: 5px; text-transform: uppercase;">Server_Signature</div>
                <div style="font-weight: bold;">
                    ${techStack.server || "NO_SERVER_HEADER_LEAKED"}
                </div>
            </div>

            <h3>DETECTED_FRAMEWORKS</h3>
            <div>
                ${
                  techStack.technologies && techStack.technologies.length > 0
                    ? techStack.technologies
                        .map((tech) => `<span class="tech-tag">${tech}</span>`)
                        .join("")
                    : '<div style="color: var(--text-muted);">NO_FINGERPRINTS_FOUND</div>'
                }
            </div>
            `
                : "NO_DATA_AVAILABLE"
            }
            `
                : `<div style="border: 1px solid var(--danger); color: var(--danger); padding: 10px; margin-top: 20px;">
                [!] CRITICAL: NO RECONNAISSANCE DATA RETRIEVED
            </div>`
            }

            <div class="footer">
                <div>GENERATED BY CATCH_ME_IF_YOU_HACK // SYSTEM V1.0</div>
                <div>${data.targetUrl} // ${formatDate(data.scanDate)}</div>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}
