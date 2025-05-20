import { useQuery } from "@tanstack/react-query";
import { Event, UseEventReturn } from "../types";
import eventService from "../services/eventService";
import { eventKeys } from "./useEvents";

/**
 * 특정 이벤트 상세 정보를 가져오는 커스텀 훅
 * @param id 이벤트 ID (없으면 최초 로딩 안함)
 * @returns UseEventReturn 이벤트 정보와 관련 상태 및 함수
 */
export const useEvent = (id?: string): UseEventReturn => {
  const {
    data: event,
    isLoading,
    error,
    refetch,
  } = useQuery<Event | null, Error>({
    queryKey: id ? eventKeys.detail(id) : eventKeys.details(),
    queryFn: async () => {
      if (!id) {
        return null;
      }

      const response = await eventService.getEventById(id);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(
        response.error?.toString() || "이벤트를 불러오는데 실패했습니다"
      );
    },
    enabled: !!id, // ID가 있을 때만 쿼리 활성화
  });

  return {
    event: event || null,
    loading: isLoading,
    error: error as Error | null,
    refetch: async () => {
      await refetch();
    },
  };
};

export default useEvent;
