export enum HackingPipelineStatusDB {
  PENDING = "PENDING",
  LAUNCHED = "LAUNCHED",
  SCOPING = "SCOPING",
  RECON = "RECON",
  SCANNING = "SCANNING",
  EXPLOITING = "EXPLOITING",
  POST_EXPLOITING = "POST_EXPLOITING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum HackingPipelineResultKeyDB {
  RECON = "recon",
  SCANNING = "scanning",
}

export interface HackingPipelineInstanceDB {
  pipelineId: string;
  status: HackingPipelineStatusDB;
  targetUrl: string;
  results: Partial<Record<HackingPipelineResultKeyDB, unknown>>;
  createdAt: Date;
  updatedAt: Date;
}

export const hackingPipelineInstances =
  (
    globalThis as unknown as {
      hackingPipelineInstances: Map<string, HackingPipelineInstanceDB>;
    }
  ).hackingPipelineInstances || new Map<string, HackingPipelineInstanceDB>();

(
  globalThis as unknown as {
    hackingPipelineInstances: Map<string, HackingPipelineInstanceDB>;
  }
).hackingPipelineInstances = hackingPipelineInstances;
