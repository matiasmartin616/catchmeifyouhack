import { CrawlerPort } from "../../ports/crawler.port";
import {
  ScanResultEntity,
  CrawledRouteEntity,
} from "../../../domain/entities/scan-result.entity";
import type {
  CheerioCrawler as CheerioCrawlerType,
  CheerioCrawlingContext,
  LogLevel as LogLevelType,
} from "crawlee";

let CheerioCrawler: typeof CheerioCrawlerType;
let log: { setLevel: (level: number) => void };
let LogLevel: typeof LogLevelType;

export class CrawleeAdapter implements CrawlerPort {
  async crawl(
    target: string,
    maxDepth: number = 2,
    maxPages: number = 50
  ): Promise<ScanResultEntity> {
    if (!CheerioCrawler) {
      const crawlee = await import("crawlee");
      CheerioCrawler = crawlee.CheerioCrawler;
      log = crawlee.log;
      LogLevel = crawlee.LogLevel;
    }

    const routes: CrawledRouteEntity[] = [];

    log.setLevel(LogLevel.OFF);

    const crawler = new CheerioCrawler({
      maxRequestsPerCrawl: maxPages,
      maxConcurrency: 2,
      maxRequestRetries: 1,
      async requestHandler({
        request,
        $,
        enqueueLinks,
      }: CheerioCrawlingContext) {
        const title = $("title").text();
        const statusCode = 200;

        const currentDepth = (request.userData.depth as number) || 0;

        routes.push(
          new CrawledRouteEntity(
            request.url,
            statusCode,
            title.trim() || "No Title",
            currentDepth
          )
        );

        if (currentDepth < maxDepth) {
          await enqueueLinks({
            strategy: "same-domain",
            userData: { depth: currentDepth + 1 },
          });
        }
      },

      failedRequestHandler({ request }: CheerioCrawlingContext) {
        console.error(`Request ${request.url} failed.`);
      },
    });

    try {
      await crawler.run([target]);
    } catch (error) {
      console.error("Crawlee execution failed:", error);
    }

    return new ScanResultEntity(target, new Date(), routes);
  }
}
