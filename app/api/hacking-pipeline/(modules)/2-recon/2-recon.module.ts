import { ReconModuleInterface } from "./2-recon.module.i";
import {
  OsintServiceInterface,
  TechStackServiceInterface,
  CrawlServiceInterface,
  ExposureServiceInterface,
  osintService,
  techStackService,
  crawlService,
  exposureService,
} from "./services";

import {
  ReconResultEntity,
  OsintEntity,
  TechStackEntity,
  CrawlEntity,
  ExposureEntity,
} from "./domain/entities";

export class ReconModule implements ReconModuleInterface {
  constructor(
    private readonly osintService: OsintServiceInterface,
    private readonly techStackService: TechStackServiceInterface,
    private readonly crawlService: CrawlServiceInterface,
    private readonly exposureService: ExposureServiceInterface
  ) {}

  async runRecon(target: string): Promise<ReconResultEntity> {
    // parallel execution of sub-tasks
    const [osint, techStack, crawling, exposure] = await Promise.all([
      this.gatherOsint(target),
      this.fingerprintTechnologies(target),
      this.enumerateEndpoints(target),
      this.checkPublicExposure(target),
    ]);

    return new ReconResultEntity(
      target,
      new Date(),
      osint,
      techStack,
      crawling,
      exposure
    );
  }

  async gatherOsint(target: string): Promise<OsintEntity> {
    return this.osintService.gatherOsint(target);
  }

  async fingerprintTechnologies(target: string): Promise<TechStackEntity> {
    return this.techStackService.fingerprint(target);
  }

  async enumerateEndpoints(target: string): Promise<CrawlEntity> {
    return this.crawlService.crawl(target);
  }

  async checkPublicExposure(target: string): Promise<ExposureEntity> {
    return this.exposureService.checkExposure(target);
  }
}

// Export a singleton instance with injected services
export const reconModule = new ReconModule(
  osintService,
  techStackService,
  crawlService,
  exposureService
);
