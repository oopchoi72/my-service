import { CreateEventDto, Event, MonthlyQuery, UpdateEventDto } from "../types";
import api, { apiCall } from "./api";

/**
 * 이벤트 관련 API 서비스
 */
const eventService = {
  /**
   * 모든 이벤트 조회
   * @returns 이벤트 목록
   */
  async getAllEvents() {
    return apiCall<Event[]>({
      method: "GET",
      url: "/events",
    });
  },

  /**
   * 월별 이벤트 조회
   * @param query 조회할 월과 연도
   * @returns 해당 월의 이벤트 목록
   */
  async getMonthEvents(query: MonthlyQuery) {
    return apiCall<Event[]>({
      method: "GET",
      url: "/events",
      params: query,
    });
  },

  /**
   * 특정 이벤트 조회
   * @param id 이벤트 ID
   * @returns 이벤트 상세 정보
   */
  async getEventById(id: string) {
    return apiCall<Event>({
      method: "GET",
      url: `/events/${id}`,
    });
  },

  /**
   * 새 이벤트 생성
   * @param eventData 생성할 이벤트 데이터
   * @returns 생성된 이벤트 정보
   */
  async createEvent(eventData: CreateEventDto) {
    return apiCall<Event>({
      method: "POST",
      url: "/events",
      data: eventData,
    });
  },

  /**
   * 이벤트 수정
   * @param id 수정할 이벤트 ID
   * @param eventData 수정할 데이터
   * @returns 수정된 이벤트 정보
   */
  async updateEvent(id: string, eventData: UpdateEventDto) {
    return apiCall<Event>({
      method: "PUT",
      url: `/events/${id}`,
      data: eventData,
    });
  },

  /**
   * 이벤트 삭제
   * @param id 삭제할 이벤트 ID
   * @returns 삭제 결과
   */
  async deleteEvent(id: string) {
    return apiCall<{ message: string; id: string }>({
      method: "DELETE",
      url: `/events/${id}`,
    });
  },
};

export default eventService;
