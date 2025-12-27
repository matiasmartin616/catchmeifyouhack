import puppeteer from "puppeteer";
import { PdfGeneratorPort } from "../ports/pdf-generator.port";

export class PuppeteerReportAdapter implements PdfGeneratorPort {
  async generateFromHtml(htmlContent: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for some environments
    });

    try {
      const page = await browser.newPage();

      // Log console messages from the page to debug
      page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

      if (!htmlContent || htmlContent.trim().length === 0) {
        throw new Error("HTML content for PDF generation is empty");
      }

      await page.setContent(htmlContent, {
        waitUntil: "networkidle0",
        timeout: 30000, // 30s timeout
      });

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

      if (!pdfBuffer || pdfBuffer.length === 0) {
        throw new Error("Generated PDF buffer is empty");
      }

      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error("Puppeteer PDF generation failed:", error);
      throw error;
    } finally {
      await browser.close();
    }
  }
}
