import { ScanResultEntity } from "../domain/entities/scan-result.entity";

export interface ScanServiceInterface {
  scan(target: string): Promise<ScanResultEntity>;
}
