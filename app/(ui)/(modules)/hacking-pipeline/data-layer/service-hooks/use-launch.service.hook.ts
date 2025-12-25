import { useMutation } from "@tanstack/react-query";
import { hackingPipelineRepository } from "../repository/hacking-pipeline.repository";
import {
  LaunchRequest,
  LaunchResponseDTO,
} from "@/app/api/hacking-pipeline/domain/dtos";

interface UseLaunchServiceProps {
  successCallback?: (data: LaunchResponseDTO) => void;
  errorCallback?: (error: Error) => void;
}

export const useLaunchService = ({
  successCallback,
  errorCallback,
}: UseLaunchServiceProps = {}) => {
  const launchMutation = useMutation<LaunchResponseDTO, Error, LaunchRequest>({
    mutationFn: (request: LaunchRequest) =>
      hackingPipelineRepository.launchHackingPipeline(request),
    onSuccess: (data) => {
      successCallback?.(data);
    },
    onError: (error) => {
      errorCallback?.(error);
    },
  });

  return {
    launch: launchMutation.mutate,
    isPending: launchMutation.isPending,
    isSuccess: launchMutation.isSuccess,
    isError: launchMutation.isError,
    error: launchMutation.error,
    data: launchMutation.data,
  };
};
