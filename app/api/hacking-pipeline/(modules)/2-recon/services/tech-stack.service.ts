import { TechStackEntity } from "../domain/entities";
import { TechStackPort } from "../infra/ports/tech-stack.port";
import { TechStackServiceInterface } from "./tech-stack.service.i";
import { SimpleWappalyzerAdapter } from "../infra/adapters/tech-stack/simple-wappalyzer.adapter";

export class TechStackService implements TechStackServiceInterface {
  constructor(private readonly techStackAdapter: TechStackPort) {}

  async fingerprint(target: string): Promise<TechStackEntity> {
    const result = await this.techStackAdapter.analyze(target);
    console.log(result);
    return result;
  }
}

export const techStackService = new TechStackService(
  new SimpleWappalyzerAdapter()
);
