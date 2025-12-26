import { ReconModuleInterface } from "./2-recon.module.i";
import {
  OsintServiceInterface,
  TechStackServiceInterface,
  osintService,
  techStackService,
} from "./services";

import {
  ReconResultEntity,
  OsintEntity,
  TechStackEntity,
} from "./domain/entities";

export class ReconModule implements ReconModuleInterface {
  constructor(
    private readonly osintService: OsintServiceInterface,
    private readonly techStackService: TechStackServiceInterface
  ) {}

  async runRecon(target: string): Promise<ReconResultEntity> {
    const [osint, techStack] = await Promise.all([
      this.gatherOsint(target),
      this.fingerprintTechnologies(target),
    ]);

    return new ReconResultEntity(target, new Date(), osint, techStack);
  }

  async gatherOsint(target: string): Promise<OsintEntity> {
    return this.osintService.gatherOsint(target);
  }

  async fingerprintTechnologies(target: string): Promise<TechStackEntity> {
    return this.techStackService.fingerprint(target);
  }
}

export const reconModule = new ReconModule(osintService, techStackService);
