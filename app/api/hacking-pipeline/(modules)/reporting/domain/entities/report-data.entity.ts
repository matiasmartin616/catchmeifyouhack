import { ReconResultEntity } from "../../../2-recon/domain/entities";

export class ReportDataEntity {
  constructor(
    public readonly targetUrl: string,
    public readonly scanDate: Date,
    public readonly status: string,
    public readonly reconResults?: ReconResultEntity
  ) {}
}
