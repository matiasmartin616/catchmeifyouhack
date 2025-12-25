export interface ReportResponseDTO {
  // The report endpoint returns a Blob/Buffer, so the DTO might just be empty or describe metadata if needed.
  // In this case, we use this class mainly for internal typing before the response is sent.
  report: Buffer;
}

export class ReportResponse implements ReportResponseDTO {
  constructor(public readonly report: Buffer) {}
}
