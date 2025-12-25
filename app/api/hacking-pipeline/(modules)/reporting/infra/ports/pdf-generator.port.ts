export interface PdfGeneratorPort {
  generateFromHtml(htmlContent: string): Promise<Buffer>;
}
