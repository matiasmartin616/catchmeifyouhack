import { TechStackEntity } from "../domain/entities";

export interface TechStackServiceInterface {
  fingerprint(target: string): Promise<TechStackEntity>;
}
