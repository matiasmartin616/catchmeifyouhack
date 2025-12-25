import axios from "axios";
import {
  LaunchRequest,
  LaunchResponseDTO,
  StatusRequest,
  StatusResponseDTO,
  ReportRequest,
} from "@/app/api/hacking-pipeline/domain/dtos";

interface HackingPipelineRepositoryInterface {
  launchHackingPipeline(request: LaunchRequest): Promise<LaunchResponseDTO>;
  getHackingPipelineStatus(request: StatusRequest): Promise<StatusResponseDTO>;
  getHackingPipelineReport(request: ReportRequest): Promise<Blob>;
}

export class HackingPipelineRepository
  implements HackingPipelineRepositoryInterface
{
  async launchHackingPipeline(
    request: LaunchRequest
  ): Promise<LaunchResponseDTO> {
    const response = await axios.post<LaunchResponseDTO>(
      "/api/hacking-pipeline/launch",
      request
    );
    return response.data;
  }

  async getHackingPipelineStatus(
    request: StatusRequest
  ): Promise<StatusResponseDTO> {
    const response = await axios.get<StatusResponseDTO>(
      `/api/hacking-pipeline/status/${request.pipelineId}`
    );
    return response.data;
  }

  async getHackingPipelineReport(request: ReportRequest): Promise<Blob> {
    const response = await axios.get(
      `/api/hacking-pipeline/report/${request.pipelineId}`,
      { responseType: "blob" }
    );
    return response.data;
  }
}

export const hackingPipelineRepository = new HackingPipelineRepository();
