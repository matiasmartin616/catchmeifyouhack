import { ScanResultEntity } from "../../3-scan/domain/entities/scan-result.entity";

export class HtmlScanBuilder {
  static build(scan?: ScanResultEntity): string {
    if (!scan) return "";

    return `
      <div class="section">
        <h1>Surface Scanning</h1>
        <p>Publicly accessible routes and endpoints discovered during the crawl.</p>
        
        <div class="card">
          <table>
            <thead>
              <tr>
                <th width="10%">Status</th>
                <th width="50%">URL</th>
                <th width="40%">Title</th>
              </tr>
            </thead>
            <tbody>
              ${scan.routes
                .slice(0, 50)
                .map(
                  (r) => `
                <tr>
                  <td><span class="badge" style="background: ${
                    r.statusCode === 200 ? "#14532d" : "#7f1d1d"
                  }; color: white;">${r.statusCode}</span></td>
                  <td style="word-break: break-all;">${r.url}</td>
                  <td>${r.title || "-"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          ${
            scan.routes.length > 50
              ? `<p style="text-align: center; color: var(--text-dim); margin-top: 10px;">Showing first 50 of ${scan.routes.length} routes</p>`
              : ""
          }
        </div>
      </div>
    `;
  }
}
