export class ExposureEntity {
  constructor(
    public openPorts: number[],
    public services: string[],
    public sources: string[] // e.g., ["Shodan"]
  ) {}
}
