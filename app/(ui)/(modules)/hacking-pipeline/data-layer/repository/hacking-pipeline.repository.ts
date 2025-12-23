import axios from "axios";
import {
  LaunchRequest,
  LaunchResponse,
  StatusRequest,
  StatusResponse,
} from "@/app/api/hacking-pipeline/domain/dtos";

interface HackingPipelineRepositoryInterface {
  launchHackingPipeline(request: LaunchRequest): Promise<LaunchResponse>;
}

export default class HackingPipelineRepository
  implements HackingPipelineRepositoryInterface
{
  async launchHackingPipeline(request: LaunchRequest): Promise<LaunchResponse> {
    const response = await axios.post<LaunchResponse>(
      "/api/hacking-pipeline/launch",
      request
    );
    return response.data;
  }

  async getHackingPipelineStatus(
    request: StatusRequest
  ): Promise<StatusResponse> {
    const response = await axios.get<StatusResponse>(
      `/api/hacking-pipeline/status/${request.pipelineId}`
    );
    return response.data;
  }
}
