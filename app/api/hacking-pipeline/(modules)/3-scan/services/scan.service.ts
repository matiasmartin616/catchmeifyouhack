import { ScanResultEntity } from "../domain/entities/scan-result.entity";
import { CrawlerPort } from "../infra/ports/crawler.port";
import { ScanServiceInterface } from "./scan.service.i";

export class ScanService implements ScanServiceInterface {
  constructor(private readonly crawler: CrawlerPort) {}

  async scan(target: string): Promise<ScanResultEntity> {
    return this.crawler.crawl(target, 2, 20);
  }
}
