export class CrawledRouteEntity {
  constructor(
    public url: string,
    public statusCode: number,
    public title: string,
    public depth: number
  ) {}
}

export class ScanResultEntity {
  constructor(
    public target: string,
    public scanDate: Date,
    public routes: CrawledRouteEntity[]
  ) {}
}
