export enum HackingPipelineStatusDB {
  PENDING = "PENDING",
  LAUNCHED = "LAUNCHED",
  SCOPING = "SCOPING",
  SCANNING = "SCANNING",
  EXPLOITING = "EXPLOITING",
  POST_EXPLOITING = "POST_EXPLOITING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface HackingPipelineInstanceDB {
  pipelineId: string;
  status: HackingPipelineStatusDB;
  targetUrl: string;
  results: Map<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export const hackingPipelineInstances = new Map<
  string,
  HackingPipelineInstanceDB
>();
