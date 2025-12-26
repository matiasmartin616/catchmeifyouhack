import { ScanResultEntity } from "../../domain/entities/scan-result.entity";

export interface CrawlerPort {
  crawl(
    target: string,
    maxDepth?: number,
    maxPages?: number
  ): Promise<ScanResultEntity>;
}
