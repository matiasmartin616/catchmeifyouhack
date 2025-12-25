import { OsintEntity } from "./osint.entity";
import { TechStackEntity } from "./tech-stack.entity";
import { CrawlEntity } from "./crawl.entity";
import { ExposureEntity } from "./exposure.entity";

export class ReconResultEntity {
  constructor(
    public target: string,
    public timestamp: Date,
    public osint: OsintEntity,
    public techStack: TechStackEntity,
    public crawling: CrawlEntity,
    public exposure: ExposureEntity
  ) {}
}
