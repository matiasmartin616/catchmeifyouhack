import { useMutation } from "@tanstack/react-query";
import HackingPipelineRepository from "../repository/hacking-pipeline.repository";
import {
  LaunchRequest,
  LaunchResponse,
} from "@/app/api/hacking-pipeline/domain/dtos";

interface UseLaunchServiceProps {
  successCallback?: (data: LaunchResponse) => void;
  errorCallback?: (error: Error) => void;
}

export const useLaunchService = ({
  successCallback,
  errorCallback,
}: UseLaunchServiceProps = {}) => {
  const repository = new HackingPipelineRepository();

  const launchMutation = useMutation<LaunchResponse, Error, LaunchRequest>({
    mutationFn: (request: LaunchRequest) =>
      repository.launchHackingPipeline(request),
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
