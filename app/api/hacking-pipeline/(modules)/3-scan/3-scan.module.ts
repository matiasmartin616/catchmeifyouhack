import { ScanModuleInterface } from "./3-scan.module.i";
import { ScanServiceInterface } from "./services/scan.service.i";
import { ScanService } from "./services/scan.service";
import { CrawleeAdapter } from "./infra/adapters/crawler/crawlee.adapter";
import { ScanResultEntity } from "./domain/entities/scan-result.entity";

export class ScanModule implements ScanModuleInterface {
  constructor(private readonly scanService: ScanServiceInterface) {}

  async runScan(target: string): Promise<ScanResultEntity> {
    return this.scanService.scan(target);
  }
}

const crawlerAdapter = new CrawleeAdapter();
const scanService = new ScanService(crawlerAdapter);

export const scanModule = new ScanModule(scanService);
