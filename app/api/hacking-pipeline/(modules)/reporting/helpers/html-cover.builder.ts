import HackingPipelineInstance from "../../../domain/entities/hacking-pipeline-instance";

export class HtmlCoverBuilder {
  static build(instance: HackingPipelineInstance): string {
    const date = new Date().toLocaleDateString();
    return `
      <div class="cover-page" style="height: 90vh; display: flex; flex-direction: column; justify-content: center; text-align: center; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); margin: -40px; padding: 40px; margin-bottom: 40px;">
        <div style="font-size: 56px; font-weight: 800; color: var(--primary); margin-bottom: 10px; letter-spacing: -0.05em; font-family: 'JetBrains Mono', monospace; text-transform: uppercase;">
          CatchMeIfYouHack
        </div>
        <div style="font-size: 24px; color: var(--secondary); margin-bottom: 80px; font-weight: 300; font-family: 'JetBrains Mono', monospace;">
          Automated Security Assessment Report
        </div>
        
        <div style="text-align: left; margin: 0 auto; width: 70%; background: white; padding: 40px; border-radius: 4px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-top: 6px solid var(--primary);">
          <div style="border-bottom: 1px dashed var(--border); padding-bottom: 20px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0; color: var(--text-dim); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; font-family: 'JetBrains Mono', monospace;">Target System</p>
            <p style="margin: 0; font-size: 24px; font-weight: 700; color: var(--text-dark); word-break: break-all; font-family: 'JetBrains Mono', monospace;">${
              instance.targetUrl || "Unknown Target"
            }</p>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <p style="margin: 0 0 5px 0; color: var(--text-dim); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; font-family: 'JetBrains Mono', monospace;">Pipeline ID</p>
              <p style="margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--text-dark);">${
                instance.pipelineId || "N/A"
              }</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: var(--text-dim); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; font-family: 'JetBrains Mono', monospace;">Date Generated</p>
              <p style="margin: 0; font-size: 14px; color: var(--text-dark); font-family: 'JetBrains Mono', monospace;">${date}</p>
            </div>
          </div>

          <div style="margin-top: 30px;">
             <span class="badge" style="background: ${
               instance.status === "COMPLETED" ? "#dcfce7" : "#f1f5f9"
             }; color: ${
      instance.status === "COMPLETED" ? "#166534" : "#475569"
    }; font-size: 12px; padding: 6px 12px; border: 1px solid ${
      instance.status === "COMPLETED" ? "#bbf7d0" : "#e2e8f0"
    }; font-family: 'JetBrains Mono', monospace;">
               STATUS: ${instance.status}
             </span>
          </div>
        </div>

        <div style="margin-top: auto; font-size: 12px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace;">
          <p style="margin-bottom: 5px; font-weight: 600;">CONFIDENTIAL DOCUMENT</p>
          <p>Generated automatically. Use responsibly.</p>
        </div>
      </div>
      <div class="page-break"></div>
    `;
  }
}
