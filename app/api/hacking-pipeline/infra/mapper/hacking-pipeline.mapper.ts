import HackingPipelineInstance, {
  HackingPipelineStatus,
} from "../../domain/entities/hacking-pipeline-instance";
import {
  HackingPipelineInstanceDB,
  HackingPipelineStatusDB,
} from "../../../lib/temp-db/entitys";

export class HackingPipelineMapper {
  static toDomain(
    hackingPipelineInstance: HackingPipelineInstanceDB
  ): HackingPipelineInstance {
    return new HackingPipelineInstance(
      hackingPipelineInstance.pipelineId,
      this.toDomainStatus(hackingPipelineInstance.status),
      hackingPipelineInstance.targetUrl,
      hackingPipelineInstance.results,
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
