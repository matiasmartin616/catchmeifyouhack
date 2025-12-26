import { ScanResultEntity } from "./domain/entities/scan-result.entity";

export interface ScanModuleInterface {
  runScan(target: string): Promise<ScanResultEntity>;
}
