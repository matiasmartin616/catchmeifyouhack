import { TechStackEntity } from "../domain/entities";
import { TechStackServiceInterface } from "./tech-stack.service.i";

export class TechStackService implements TechStackServiceInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async fingerprint(target: string): Promise<TechStackEntity> {
    // TODO: Integrate Wappalyzer/Header analysis
    return new TechStackEntity("nginx", ["React", "Node.js"], {
      "x-powered-by": "Express",
    });
  }
}

export const techStackService = new TechStackService();
