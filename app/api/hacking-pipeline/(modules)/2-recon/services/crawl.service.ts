import { CrawlEntity } from "../domain/entities";
import { CrawlServiceInterface } from "./crawl.service.i";

export class CrawlService implements CrawlServiceInterface {
  async crawl(target: string): Promise<CrawlEntity> {
    // TODO: Integrate respectful crawler
    return new CrawlEntity(
      [`https://${target}/login`, `https://${target}/about`],
      "User-agent: * Disallow: /admin",
      [`https://${target}/sitemap.xml`]
    );
  }
}

export const crawlService = new CrawlService();
