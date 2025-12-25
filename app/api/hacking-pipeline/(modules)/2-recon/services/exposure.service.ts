import { ExposureEntity } from "../domain/entities";
import { ExposureServiceInterface } from "./exposure.service.i";

export class ExposureService implements ExposureServiceInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async checkExposure(target: string): Promise<ExposureEntity> {
    // TODO: Integrate Shodan/IPInfo query
    return new ExposureEntity([80, 443], ["http", "https"], ["PassiveDB"]);
  }
}

export const exposureService = new ExposureService();
