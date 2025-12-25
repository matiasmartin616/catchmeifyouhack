import { CrawlEntity } from "../domain/entities";

export interface CrawlServiceInterface {
  crawl(target: string): Promise<CrawlEntity>;
}
