import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiResponse } from "../types";
import {
  logError,
  ApiError,
  ErrorType,
  getUserFriendlyErrorMessage,
  withCustomRetry,
  isRetryableError,
  RetryOptions,
} from "../utils";

/**
 * API 기본 URL 설정
 */
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5001/api";

/**
 * Axios 인스턴스 생성
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10초
});

/**
 * 요청 인터셉터
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // JWT 토큰이 있다면 헤더에 추가 (향후 인증 구현 시 사용)
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logError(error, "Request Interceptor");
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 성공 응답 처리
    return response;
  },
  (error: AxiosError) => {
    // 오류 타입에 따른 처리
    let errorType = ErrorType.UNKNOWN_ERROR;
    let errorMessage = "알 수 없는 오류가 발생했습니다";

    if (error.response) {
      // 서버가 응답을 반환한 경우 (4xx, 5xx 응답)
      const status = error.response.status;

      if (status === 401) {
        errorType = ErrorType.UNAUTHORIZED;
        // 로그인 페이지로 리디렉션 등의 처리
        // 이벤트를 발생시켜 앱 전체에 알림도 가능
        const authErrorEvent = new CustomEvent("auth:error", {
          detail: {
            status,
            message: "인증이 필요합니다. 다시 로그인해 주세요.",
          },
        });
        window.dispatchEvent(authErrorEvent);
      } else if (status === 403) {
        errorType = ErrorType.FORBIDDEN;
      } else if (status === 404) {
        errorType = ErrorType.NOT_FOUND;
      } else if (status === 400) {
        errorType = ErrorType.VALIDATION_ERROR;
      } else if (status >= 500) {
        errorType = ErrorType.SERVER_ERROR;
      }

      // 서버에서 오는 에러 메시지가 있으면 사용
      const serverErrorMessage =
        (error.response?.data as any)?.error ||
        (error.response?.data as any)?.message;
      if (serverErrorMessage) {
        errorMessage = serverErrorMessage;
      } else {
        errorMessage = getUserFriendlyErrorMessage(error);
      }
    } else if (error.request) {
      // 요청이 전송되었으나 응답이 없는 경우 (네트워크 오류)
      errorType = ErrorType.NETWORK_ERROR;
      errorMessage = "서버와 통신할 수 없습니다. 인터넷 연결을 확인해 주세요.";
    } else if (error.message?.includes("timeout")) {
      // 요청 타임아웃
      errorType = ErrorType.TIMEOUT_ERROR;
      errorMessage = "요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.";
    }

    // 오류 로깅
    logError(error, `API Error (${errorType}): ${errorMessage}`);

    // 커스텀 에러 객체 생성
    const apiError = new ApiError(
      errorMessage,
      errorType,
      error.response?.status,
      error.response?.data
    );

    return Promise.reject(apiError);
  }
);

// 전역 재시도 기본 설정
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  jitter: true,
  retryCondition: isRetryableError,
};

/**
 * API 호출 헬퍼 함수 (재시도 로직 통합)
 * @param config API 요청 구성
 * @param retryOptions 재시도 옵션 (기본값 적용)
 * @returns API 응답
 */
export const apiCall = async <T>(
  config: any,
  retryOptions: RetryOptions = {}
): Promise<ApiResponse<T>> => {
  // 기본 옵션과 사용자 지정 옵션 병합
  const options = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };

  // 재시도 콜백 설정 (재시도 이벤트 발생)
  const onRetry = (error: any, attempt: number, delay: number) => {
    // 로그 기록
    logError(
      error,
      `API 재시도 ${attempt}/${options.maxAttempts} (${Math.round(delay)}ms 후)`
    );

    // 전역 이벤트 발생 (UI 피드백용)
    const retryEvent = new CustomEvent("api:retry", {
      detail: {
        error,
        attempt,
        maxAttempts: options.maxAttempts,
        delay,
        endpoint: config.url,
      },
    });
    window.dispatchEvent(retryEvent);
  };

  // 재시도 옵션 업데이트
  options.onRetry = options.onRetry || onRetry;

  // 재시도 로직으로 API 호출 래핑
  try {
    const response = await withCustomRetry(async () => {
      const response = await api(config);
      return response.data as ApiResponse<T>;
    }, options);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      // 이미 인터셉터에서 처리된 API 에러
      return {
        success: false,
        error: error.message,
        data: error.data,
      };
    }

    const axiosError = error as AxiosError;
    const errorResponse = (axiosError.response?.data as ApiResponse<T>) || {
      success: false,
      error: axiosError.message || "알 수 없는 오류가 발생했습니다",
    };
    return errorResponse;
  }
};

export const eventApi = {
  getEvents: async (month: number, year: number) => {
    const response = await api.get("/events", {
      params: { month, year },
    });
    return response.data;
  },

  getEventById: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData: any) => {
    const response = await api.post("/events", eventData);
    return response.data;
  },

  updateEvent: async (id: string, eventData: any) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id: string) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

/**
 * API 호출 및 에러 핸들링을 래핑한 함수
 * @param fn API 호출 함수
 * @param errorHandler 에러 핸들러 함수
 * @returns API 호출 결과
 */
export const withErrorHandling = async <T>(
  fn: () => Promise<ApiResponse<T>>,
  errorHandler?: (error: ApiError) => void
): Promise<ApiResponse<T>> => {
  try {
    return await fn();
  } catch (error) {
    // 에러 처리
    if (errorHandler && error instanceof ApiError) {
      errorHandler(error);
    } else {
      // 기본 에러 처리
      logError(error, "API Error");
    }

    // 실패 응답 반환
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다",
    };
  }
};

export default api;
