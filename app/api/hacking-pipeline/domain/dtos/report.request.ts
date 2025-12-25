export interface ReportRequestDTO {
  pipelineId: string;
}

export class ReportRequest implements ReportRequestDTO {
  constructor(public readonly pipelineId: string) {}
}
