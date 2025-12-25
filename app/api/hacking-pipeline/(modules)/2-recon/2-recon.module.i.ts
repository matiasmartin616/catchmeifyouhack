import {
  ReconResultEntity,
  OsintEntity,
  TechStackEntity,
} from "./domain/entities";

export interface ReconModuleInterface {
  /**
   * Orchestrates the full reconnaissance process
   */
  runRecon(target: string, scopeId: string): Promise<ReconResultEntity>;

  /**
   * Sub-task: Gather OSINT (Whois, DNS, Geo)
   */
  gatherOsint(target: string): Promise<OsintEntity>;

  /**
   * Sub-task: Identify Technologies
   */
  fingerprintTechnologies(target: string): Promise<TechStackEntity>;
}
