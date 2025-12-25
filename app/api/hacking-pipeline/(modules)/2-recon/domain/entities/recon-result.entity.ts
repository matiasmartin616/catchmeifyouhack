import { OsintEntity } from "./osint.entity";
import { TechStackEntity } from "./tech-stack.entity";

export class ReconResultEntity {
  constructor(
    public target: string,
    public timestamp: Date,
    public osint: OsintEntity,
    public techStack: TechStackEntity
  ) {}
}
