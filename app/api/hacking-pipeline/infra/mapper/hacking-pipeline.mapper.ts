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
import { ScanResultEntity } from "../../(modules)/3-scan/domain/entities/scan-result.entity";

export class HackingPipelineMapper {
  static toDomain(
    hackingPipelineInstance: HackingPipelineInstanceDB
  ): HackingPipelineInstance {
    const domainResults: Partial<
      Record<
        HackingPipelineResultKey,
        string | ReconResultEntity | ScanResultEntity
      >
    > = {};

    Object.entries(hackingPipelineInstance.results).forEach(([key, value]) => {
      if (key === HackingPipelineResultKeyDB.RECON) {
        domainResults[HackingPipelineResultKey.RECON] = value as
          | string
          | ReconResultEntity;
      } else if (key === HackingPipelineResultKeyDB.SCANNING) {
        domainResults[HackingPipelineResultKey.SCANNING] = value as
          | string
          | ScanResultEntity;
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
