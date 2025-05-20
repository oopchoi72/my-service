/**
 * 커스텀 훅 관련 타입 정의
 */

import { ApiResponse, Event, MonthlyQuery } from ".";

// 상태 가능한 값
export type Status = "idle" | "loading" | "success" | "error";

// 비동기 상태 인터페이스
export interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  status: Status;
}

// 이벤트 훅 반환 타입
export interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  fetchMonthEvents: (query: MonthlyQuery) => Promise<Event[]>;
}

// 이벤트 상세 훅 반환 타입
export interface UseEventReturn {
  event: Event | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// 이벤트 수정 훅 반환 타입
export interface UseEventMutationReturn {
  loading: boolean;
  error: Error | null;
  success: boolean;
  createEvent: (eventData: any) => Promise<ApiResponse<Event>>;
  updateEvent: (id: string, eventData: any) => Promise<ApiResponse<Event>>;
  deleteEvent: (id: string) => Promise<ApiResponse<any>>;
  reset: () => void;
}
