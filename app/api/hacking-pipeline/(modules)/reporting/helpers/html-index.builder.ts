export class HtmlIndexBuilder {
  static build(): string {
    return `
      <div class="section">
        <h1>Index</h1>
        <div class="card">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 15px;">
              <div style="display: flex; align-items: baseline;">
                <span style="font-family: 'JetBrains Mono', monospace; color: var(--primary); font-weight: bold; margin-right: 10px;">01</span>
                <span style="font-size: 16px; font-weight: 500;">Reconnaissance & OSINT</span>
                <div style="flex-grow: 1; border-bottom: 1px dotted var(--text-dim); margin: 0 10px;"></div>
              </div>
            </li>
            <li style="margin-bottom: 15px;">
              <div style="display: flex; align-items: baseline;">
                <span style="font-family: 'JetBrains Mono', monospace; color: var(--primary); font-weight: bold; margin-right: 10px;">02</span>
                <span style="font-size: 16px; font-weight: 500;">Surface Scanning</span>
                <div style="flex-grow: 1; border-bottom: 1px dotted var(--text-dim); margin: 0 10px;"></div>
              </div>
            </li>
            <li style="margin-bottom: 15px;">
              <div style="display: flex; align-items: baseline;">
                <span style="font-family: 'JetBrains Mono', monospace; color: var(--primary); font-weight: bold; margin-right: 10px;">03</span>
                <span style="font-size: 16px; font-weight: 500;">Possible Vulnerabilities</span>
                <div style="flex-grow: 1; border-bottom: 1px dotted var(--text-dim); margin: 0 10px;"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="page-break"></div>
    `;
  }
}

