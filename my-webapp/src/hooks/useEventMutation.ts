import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UseEventMutationReturn,
  CreateEventDto,
  UpdateEventDto,
  ApiResponse,
  Event,
} from "../types";
import eventService from "../services/eventService";
import { eventKeys } from "./useEvents";

/**
 * 이벤트 변경(생성/수정/삭제)을 위한 커스텀 훅
 * @returns UseEventMutationReturn 이벤트 변경 관련 함수 및 상태
 */
export const useEventMutation = (): UseEventMutationReturn => {
  const queryClient = useQueryClient();

  // 이벤트 생성 뮤테이션
  const createMutation = useMutation<ApiResponse<Event>, Error, CreateEventDto>(
    {
      mutationFn: async (eventData: CreateEventDto) => {
        const response = await eventService.createEvent(eventData);

        if (!response.success) {
          throw new Error(
            response.error?.toString() || "이벤트 생성에 실패했습니다"
          );
        }

        return response;
      },
      onSuccess: () => {
        // 이벤트 목록 캐시 갱신
        queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      },
    }
  );

  // 이벤트 수정 뮤테이션
  const updateMutation = useMutation<
    ApiResponse<Event>,
    Error,
    { id: string; eventData: UpdateEventDto }
  >({
    mutationFn: async ({ id, eventData }) => {
      const response = await eventService.updateEvent(id, eventData);

      if (!response.success) {
        throw new Error(
          response.error?.toString() || "이벤트 수정에 실패했습니다"
        );
      }

      return response;
    },
    onSuccess: (data, variables) => {
      // 특정 이벤트 캐시 갱신
      queryClient.invalidateQueries({
        queryKey: eventKeys.detail(variables.id),
      });
      // 이벤트 목록 캐시 갱신
      queryClient.invalidateQueries({
        queryKey: eventKeys.lists(),
      });
    },
  });

  // 이벤트 삭제 뮤테이션
  const deleteMutation = useMutation<ApiResponse<any>, Error, string>({
    mutationFn: async (id: string) => {
      const response = await eventService.deleteEvent(id);

      if (!response.success) {
        throw new Error(
          response.error?.toString() || "이벤트 삭제에 실패했습니다"
        );
      }

      return response;
    },
    onSuccess: (_, id) => {
      // 특정 이벤트 캐시 제거
      queryClient.removeQueries({
        queryKey: eventKeys.detail(id),
      });
      // 이벤트 목록 캐시 갱신
      queryClient.invalidateQueries({
        queryKey: eventKeys.lists(),
      });
    },
  });

  // 상태 초기화
  const reset = () => {
    createMutation.reset();
    updateMutation.reset();
    deleteMutation.reset();
  };

  const createEvent = async (eventData: CreateEventDto) => {
    return await createMutation.mutateAsync(eventData);
  };

  const updateEvent = async (id: string, eventData: UpdateEventDto) => {
    return await updateMutation.mutateAsync({ id, eventData });
  };

  const deleteEvent = async (id: string) => {
    return await deleteMutation.mutateAsync(id);
  };

  // 로딩, 에러, 성공 상태는 현재 활성화된 뮤테이션에서 가져옴
  const loading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const error =
    createMutation.error ||
    updateMutation.error ||
    deleteMutation.error ||
    null;

  const success =
    createMutation.isSuccess ||
    updateMutation.isSuccess ||
    deleteMutation.isSuccess;

  return {
    loading,
    error,
    success,
    createEvent,
    updateEvent,
    deleteEvent,
    reset,
  };
};

export default useEventMutation;
