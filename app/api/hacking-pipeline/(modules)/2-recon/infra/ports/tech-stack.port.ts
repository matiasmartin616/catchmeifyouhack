import { TechStackEntity } from "../../domain/entities";

export interface TechStackPort {
  analyze(target: string): Promise<TechStackEntity>;
}
