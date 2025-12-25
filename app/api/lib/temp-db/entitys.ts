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
}

export interface HackingPipelineInstanceDB {
  pipelineId: string;
  status: HackingPipelineStatusDB;
  targetUrl: string;
  results: Partial<Record<HackingPipelineResultKeyDB, unknown>>;
  createdAt: Date;
  updatedAt: Date;
}

export const hackingPipelineInstances = new Map<
  string,
  HackingPipelineInstanceDB
>();
