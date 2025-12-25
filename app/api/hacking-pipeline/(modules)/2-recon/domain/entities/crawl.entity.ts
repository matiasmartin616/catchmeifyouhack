export class CrawlEntity {
  constructor(
    public urls: string[],
    public robotsTxt: string | null,
    public sitemap: string[]
  ) {}
}
