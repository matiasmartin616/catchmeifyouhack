import { OsintEntity } from "../domain/entities";

export interface OsintServiceInterface {
  gatherOsint(target: string): Promise<OsintEntity>;
}
