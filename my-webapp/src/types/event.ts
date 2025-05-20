/**
 * 일정 이벤트 관련 타입 정의
 */

/**
 * 백엔드로부터 받은 일정 이벤트 데이터 인터페이스
 */
export interface Event {
  id: string;
  title: string;
  startDateTime: string;
  endDateTime?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 새 일정 생성 시 사용하는 인터페이스
 */
export interface CreateEventDto {
  title: string;
  startDateTime: string;
  endDateTime?: string;
  description?: string;
}

/**
 * 기존 일정 수정 시 사용하는 인터페이스
 */
export interface UpdateEventDto {
  title?: string;
  startDateTime?: string;
  endDateTime?: string | null;
  description?: string | null;
}

/**
 * 월 조회 시 사용하는 인터페이스
 */
export interface MonthlyQuery {
  month: number;
  year: number;
}
