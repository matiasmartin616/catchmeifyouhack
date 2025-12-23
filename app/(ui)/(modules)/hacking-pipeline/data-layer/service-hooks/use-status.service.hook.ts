import { useMutation } from "@tanstack/react-query";
import HackingPipelineRepository from "../repository/hacking-pipeline.repository";
import {
  StatusRequest,
  StatusResponse,
} from "@/app/api/hacking-pipeline/domain/dtos";

interface UseLaunchServiceProps {
  successCallback?: (data: StatusResponse) => void;
  errorCallback?: (error: Error) => void;
}

export const useStatusService = ({
  successCallback,
  errorCallback,
}: UseLaunchServiceProps = {}) => {
  const repository = new HackingPipelineRepository();

  const getStatusMutation = useMutation<StatusResponse, Error, StatusRequest>({
    mutationFn: (request: StatusRequest) =>
      repository.getHackingPipelineStatus(request),
    onSuccess: (data) => {
      successCallback?.(data);
    },
    onError: (error) => {
      errorCallback?.(error);
    },
  });

  return {
    getStatus: getStatusMutation.mutate,
    isPending: getStatusMutation.isPending,
    isSuccess: getStatusMutation.isSuccess,
    isError: getStatusMutation.isError,
    error: getStatusMutation.error,
    data: getStatusMutation.data,
  };
};
