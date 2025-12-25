import puppeteer from "puppeteer";
import { PdfGeneratorPort } from "../ports/pdf-generator.port";

export class PuppeteerReportAdapter implements PdfGeneratorPort {
  async generateFromHtml(htmlContent: string): Promise<Buffer> {
    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for some environments
    });

    try {
      const page = await browser.newPage();

      // Set content
      await page.setContent(htmlContent, {
        waitUntil: "networkidle0",
      });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px",
        },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}
