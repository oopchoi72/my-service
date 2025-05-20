/**
 * API 에러 처리 유틸리티
 */

import { AxiosError } from "axios";

/**
 * API 오류 타입 정의
 */
export enum ErrorType {
  NETWORK_ERROR = "NETWORK_ERROR", // 네트워크 연결 문제
  SERVER_ERROR = "SERVER_ERROR", // 서버 오류 (500대)
  UNAUTHORIZED = "UNAUTHORIZED", // 인증 오류 (401)
  FORBIDDEN = "FORBIDDEN", // 권한 오류 (403)
  NOT_FOUND = "NOT_FOUND", // 리소스 없음 (404)
  VALIDATION_ERROR = "VALIDATION_ERROR", // 유효성 검사 오류 (400)
  TIMEOUT_ERROR = "TIMEOUT_ERROR", // 요청 타임아웃
  UNKNOWN_ERROR = "UNKNOWN_ERROR", // 기타 알 수 없는 오류
}

/**
 * 오류 타입별 사용자 친화적 메시지
 */
export const errorMessages: Record<ErrorType, string> = {
  [ErrorType.NETWORK_ERROR]:
    "네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해 주세요.",
  [ErrorType.SERVER_ERROR]:
    "서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  [ErrorType.UNAUTHORIZED]: "인증이 필요한 서비스입니다. 다시 로그인해 주세요.",
  [ErrorType.FORBIDDEN]: "해당 리소스에 접근할 권한이 없습니다.",
  [ErrorType.NOT_FOUND]: "요청하신 내용을 찾을 수 없습니다.",
  [ErrorType.VALIDATION_ERROR]: "입력하신 정보가 유효하지 않습니다.",
  [ErrorType.TIMEOUT_ERROR]:
    "요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.",
  [ErrorType.UNKNOWN_ERROR]:
    "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
};

/**
 * 오류 객체에서 에러 타입을 판별
 * @param error 발생한 에러 객체
 * @returns 판별된 에러 타입
 */
export const getErrorType = (error: any): ErrorType => {
  // 네트워크 에러 확인
  if (
    !navigator.onLine ||
    (error instanceof Error && error.message === "Network Error")
  ) {
    return ErrorType.NETWORK_ERROR;
  }

  // Axios 에러인 경우 HTTP 상태 코드 확인
  if (error instanceof AxiosError && error.response) {
    const status = error.response.status;

    if (status === 401) return ErrorType.UNAUTHORIZED;
    if (status === 403) return ErrorType.FORBIDDEN;
    if (status === 404) return ErrorType.NOT_FOUND;
    if (status === 400) return ErrorType.VALIDATION_ERROR;
    if (status >= 500) return ErrorType.SERVER_ERROR;
  }

  // 타임아웃 에러 확인
  if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
    return ErrorType.TIMEOUT_ERROR;
  }

  // 기타 에러
  return ErrorType.UNKNOWN_ERROR;
};

/**
 * 오류 객체에서 사용자에게 표시할 메시지 생성
 * @param error 발생한 에러 객체
 * @returns 사용자에게 표시할 오류 메시지
 */
export const getUserFriendlyErrorMessage = (error: any): string => {
  const errorType = getErrorType(error);

  // API 응답에 에러 메시지가 있는 경우 (우선) 사용
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  // 에러 타입별 정의된 메시지 반환
  return errorMessages[errorType];
};

/**
 * 오류 로깅 함수
 * @param error 발생한 에러 객체
 * @param context 추가 컨텍스트 정보
 */
export const logError = (error: any, context?: string): void => {
  const errorType = getErrorType(error);
  console.error(`[${errorType}]${context ? ` ${context}: ` : " "}`, error);

  // 여기에 서버로 에러 전송 로직 추가 가능 (향후 모니터링 시스템 연동)
};

/**
 * API 에러 처리를 위한 사용자 정의 에러 클래스
 */
export class ApiError extends Error {
  type: ErrorType;
  status?: number;
  data?: any;

  constructor(message: string, type: ErrorType, status?: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.type = type;
    this.status = status;
    this.data = data;
  }
}

/**
 * Axios 에러를 ApiError로 변환
 * @param error Axios 에러 객체
 * @returns 변환된 API 에러 객체
 */
export const convertToApiError = (error: any): ApiError => {
  const errorType = getErrorType(error);
  const errorMessage = getUserFriendlyErrorMessage(error);
  const status = error?.response?.status;
  const data = error?.response?.data;

  return new ApiError(errorMessage, errorType, status, data);
};
