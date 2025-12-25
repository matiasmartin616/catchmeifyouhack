import HackingPipelineInstance, {
  HackingPipelineResultKey,
  HackingPipelineStatus,
} from "../../domain/entities/hacking-pipeline-instance";
import {
  HackingPipelineInstanceDB,
  HackingPipelineResultKeyDB,
  HackingPipelineStatusDB,
} from "../../../lib/temp-db/entitys";
import { ReconResultEntity } from "../../(modules)/2-recon/domain/entities";

export class HackingPipelineMapper {
  static toDomain(
    hackingPipelineInstance: HackingPipelineInstanceDB
  ): HackingPipelineInstance {
    const domainResults: Partial<
      Record<HackingPipelineResultKey, string | ReconResultEntity>
    > = {};

    Object.entries(hackingPipelineInstance.results).forEach(([key, value]) => {
      if (key === HackingPipelineResultKeyDB.RECON) {
        domainResults[HackingPipelineResultKey.RECON] = value as
          | string
          | ReconResultEntity;
      }
    });

    return new HackingPipelineInstance(
      hackingPipelineInstance.pipelineId,
      this.toDomainStatus(hackingPipelineInstance.status),
      hackingPipelineInstance.targetUrl,
      domainResults,
      hackingPipelineInstance.createdAt,
      hackingPipelineInstance.updatedAt
    );
  }

  static toDB(
    hackingPipelineInstance: HackingPipelineInstance
  ): HackingPipelineInstanceDB {
    return {
      pipelineId: hackingPipelineInstance.pipelineId,
      status: this.toDBStatus(hackingPipelineInstance.status),
      targetUrl: hackingPipelineInstance.targetUrl,
      results: hackingPipelineInstance.results,
      createdAt: hackingPipelineInstance.createdAt,
      updatedAt: hackingPipelineInstance.updatedAt,
    };
  }

  static toDBStatus(status: HackingPipelineStatus): HackingPipelineStatusDB {
    return HackingPipelineStatusDB[
      status as keyof typeof HackingPipelineStatusDB
    ];
  }

  static toDomainStatus(
    status: HackingPipelineStatusDB
  ): HackingPipelineStatus {
    return HackingPipelineStatus[status as keyof typeof HackingPipelineStatus];
  }
}
