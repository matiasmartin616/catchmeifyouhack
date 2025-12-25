import { useQuery } from "@tanstack/react-query";
import { hackingPipelineRepository } from "../repository/hacking-pipeline.repository";
import { ReportRequest } from "@/app/api/hacking-pipeline/domain/dtos";

export const useDownloadReportByPipelineId = (pipelineId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["report", pipelineId],
    queryFn: () =>
      hackingPipelineRepository.getHackingPipelineReport(
        new ReportRequest(pipelineId)
      ),
    enabled: false,
  });

  return { data, isLoading, error, refetch };
};
