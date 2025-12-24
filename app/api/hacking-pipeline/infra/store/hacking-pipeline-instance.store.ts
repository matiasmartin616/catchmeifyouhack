import HackingPipelineInstance from "../../domain/entities/hacking-pipeline-instance";
import { hackingPipelineInstances } from "../../../lib/temp-db/entitys";
import { HackingPipelineMapper } from "../mapper/hacking-pipeline.mapper";

export interface HackingPipelineInstanceStoreInterface {
  create(hackingPipelineInstance: HackingPipelineInstance): string;
  getById(id: string): HackingPipelineInstance | undefined;
  update(hackingPipelineInstance: HackingPipelineInstance): void;
}

class HackingPipelineInstanceStore {
  create(hackingPipelineInstance: HackingPipelineInstance): string {
    hackingPipelineInstances.set(
      hackingPipelineInstance.pipelineId,
      HackingPipelineMapper.toDB(hackingPipelineInstance)
    );

    return hackingPipelineInstance.pipelineId;
  }

  getById(id: string): HackingPipelineInstance | undefined {
    const hackingPipelineInstanceDB = hackingPipelineInstances.get(id);
    if (!hackingPipelineInstanceDB) {
      return undefined;
    }
    return HackingPipelineMapper.toDomain(hackingPipelineInstanceDB);
  }

  update(hackingPipelineInstance: HackingPipelineInstance): void {
    hackingPipelineInstances.set(
      hackingPipelineInstance.pipelineId,
      HackingPipelineMapper.toDB(hackingPipelineInstance)
    );
  }
}

export const hackingPipelineInstanceStore = new HackingPipelineInstanceStore();
