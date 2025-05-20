import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Event, MonthlyQuery, UseEventsReturn } from "../types";
import eventService from "../services/eventService";
import { isRetryableError } from "../utils";

// 쿼리 키
export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (filters: MonthlyQuery) => [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
};

/**
 * 이벤트 데이터를 가져오는 커스텀 훅
 * @returns UseEventsReturn 이벤트 목록과 관련 상태 및 함수
 */
export const useEvents = (): UseEventsReturn => {
  const queryClient = useQueryClient();

  // 모든 이벤트 조회 쿼리
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: eventKeys.lists(),
    queryFn: async () => {
      const response = await eventService.getAllEvents();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(
        response.error?.toString() || "이벤트를 불러오는데 실패했습니다"
      );
    },
    // 커스텀 재시도 설정 (전역 설정 대신 이 쿼리에만 적용)
    retry: (failureCount, error) => {
      // 최대 3번까지만 재시도
      if (failureCount >= 3) return false;

      // 재시도 가능한 에러인지 확인
      return isRetryableError(error);
    },
  });

  /**
   * 월별 이벤트 가져오기
   * @param query 조회할 월과 연도
   */
  const fetchMonthEvents = async (query: MonthlyQuery): Promise<Event[]> => {
    const queryKey = eventKeys.list(query);

    try {
      // 캐시된 데이터 확인
      const cachedData = queryClient.getQueryData<Event[]>(queryKey);
      if (cachedData) {
        return cachedData;
      }

      // 캐시된 데이터가 없으면 새로 조회
      return await queryClient.fetchQuery({
        queryKey,
        queryFn: async () => {
          const response = await eventService.getMonthEvents(query);

          if (response.success && response.data) {
            return response.data;
          }

          throw new Error(
            response.error?.toString() || "이벤트를 불러오는데 실패했습니다"
          );
        },
        // 커스텀 재시도 설정
        retry: (failureCount, error) => {
          // 최대 3번까지만 재시도
          if (failureCount >= 3) return false;

          // 재시도 가능한 에러인지 확인
          return isRetryableError(error);
        },
      });
    } catch (error) {
      console.error("월별 이벤트 조회 실패:", error);
      return [];
    }
  };

  return {
    events: data,
    loading: isLoading,
    error: error as Error | null,
    refetch: async () => {
      await refetch();
    },
    fetchMonthEvents,
  };
};

export default useEvents;
