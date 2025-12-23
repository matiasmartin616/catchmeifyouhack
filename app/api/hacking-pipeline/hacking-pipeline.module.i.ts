import { LaunchResponse, StatusResponse } from "./domain";
import { LaunchRequest } from "./domain/dtos/launch.request";
import { StatusRequest } from "./domain/dtos/status.request";

export interface HackingPipelineInterface {
  launch(request: LaunchRequest): Promise<LaunchResponse>;
  status(statusRequest: StatusRequest): Promise<StatusResponse>;
}
