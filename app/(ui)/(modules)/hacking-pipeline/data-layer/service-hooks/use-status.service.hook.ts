import { useQuery } from "@tanstack/react-query";
import HackingPipelineRepository from "../repository/hacking-pipeline.repository";
import {
  StatusRequest,
  StatusResponse,
} from "@/app/api/hacking-pipeline/domain/dtos";
import { HackingPipelineStatus } from "@/app/api/hacking-pipeline/domain/entities/hacking-pipeline-instance";

interface UseStatusServiceProps {
  pipelineId?: string;
}

export const useStatusService = ({
  pipelineId,
}: UseStatusServiceProps = {}) => {
  const repository = new HackingPipelineRepository();

  const query = useQuery<StatusResponse, Error>({
    queryKey: ["pipelineStatus", pipelineId],
    queryFn: async () => {
      if (!pipelineId) throw new Error("Pipeline ID is required");
      return await repository.getHackingPipelineStatus(
        new StatusRequest(pipelineId)
      );
    },
    enabled: !!pipelineId,

    refetchInterval: (query) => {
      const { data, error } = query.state;

      if (error) return false;

      if (!data) return 3000;

      const status = data.pipelineInstanceInfo.status;

      if (
        status === HackingPipelineStatus.COMPLETED ||
        status === HackingPipelineStatus.FAILED
      ) {
        return false;
      }

      return 3000;
    },

    retry: false,

    refetchOnWindowFocus: false,
  });

  return {
    data: query.data,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    isSuccess: query.isSuccess,
    status: query.status,
  };
};
