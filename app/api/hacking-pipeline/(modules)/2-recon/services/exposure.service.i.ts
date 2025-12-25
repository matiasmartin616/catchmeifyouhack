import { ExposureEntity } from "../domain/entities";

export interface ExposureServiceInterface {
  checkExposure(target: string): Promise<ExposureEntity>;
}
