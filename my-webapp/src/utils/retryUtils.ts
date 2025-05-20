/**
 * 재시도 메커니즘 유틸리티
 */
import { ErrorType, getErrorType } from "./errorUtils";

/**
 * 재시도 가능한 오류인지 확인
 * @param error 검사할 오류
 * @returns 재시도 가능 여부
 */
export const isRetryableError = (error: any): boolean => {
  const errorType = getErrorType(error);

  // 재시도 가능한 오류 유형
  const retryableErrors = [
    ErrorType.NETWORK_ERROR,
    ErrorType.TIMEOUT_ERROR,
    ErrorType.SERVER_ERROR, // 서버 측 오류(5xx)는 일시적일 수 있음
  ];

  return retryableErrors.includes(errorType);
};

/**
 * 지수 백오프 지연 시간 계산
 * @param attemptCount 재시도 횟수
 * @param baseDelay 기본 지연 시간 (밀리초, 기본값: 1000ms)
 * @param maxDelay 최대 지연 시간 (밀리초, 기본값: 30000ms)
 * @param jitter 무작위성 적용 여부 (기본값: true)
 * @returns 다음 재시도까지 지연 시간
 */
export const calculateBackoffDelay = (
  attemptCount: number,
  baseDelay = 1000,
  maxDelay = 30000,
  jitter = true
): number => {
  // 지수 백오프: baseDelay * 2^attemptCount
  let delay = baseDelay * Math.pow(2, attemptCount);

  // 최대 지연 시간 제한
  delay = Math.min(delay, maxDelay);

  // 지터(무작위성) 적용 - 네트워크 혼잡 완화 및 부하 분산
  if (jitter) {
    // 계산된 지연의 0.5배에서 1.5배 사이의 무작위 값 생성
    delay = delay * (0.5 + Math.random());
  }

  return delay;
};

/**
 * 함수를 재시도하는 유틸리티
 * @param fn 실행할 함수
 * @param maxAttempts 최대 시도 횟수 (기본값: 3)
 * @param baseDelay 기본 지연 시간 (밀리초, 기본값: 1000ms)
 * @param maxDelay 최대 지연 시간 (밀리초, 기본값: 30000ms)
 * @param onRetry 재시도 시 콜백 함수
 * @returns 함수 실행 결과
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelay = 1000,
  maxDelay = 30000,
  onRetry?: (error: any, attempt: number, delay: number) => void
): Promise<T> => {
  let lastError: any;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // 함수 실행
      return await fn();
    } catch (error) {
      lastError = error;

      // 마지막 시도거나 재시도 불가능한 오류인 경우 실패
      if (attempt >= maxAttempts - 1 || !isRetryableError(error)) {
        throw error;
      }

      // 다음 재시도까지 지연 시간 계산
      const delay = calculateBackoffDelay(attempt, baseDelay, maxDelay);

      // 재시도 콜백 호출
      if (onRetry) {
        onRetry(error, attempt + 1, delay);
      }

      // 지연 후 재시도
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // 모든 시도 실패 시
  throw lastError;
};

/**
 * 재시도 옵션 인터페이스
 */
export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  jitter?: boolean;
  retryCondition?: (error: any) => boolean;
  onRetry?: (error: any, attempt: number, delay: number) => void;
}

/**
 * 커스텀 재시도 옵션으로 함수를 재시도하는 유틸리티
 * @param fn 실행할 함수
 * @param options 재시도 옵션
 * @returns 함수 실행 결과
 */
export const withCustomRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    jitter = true,
    retryCondition = isRetryableError,
    onRetry,
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // 함수 실행
      return await fn();
    } catch (error) {
      lastError = error;

      // 마지막 시도거나 재시도 조건을 만족하지 않는 경우 실패
      if (attempt >= maxAttempts - 1 || !retryCondition(error)) {
        throw error;
      }

      // 다음 재시도까지 지연 시간 계산
      const delay = calculateBackoffDelay(attempt, baseDelay, maxDelay, jitter);

      // 재시도 콜백 호출
      if (onRetry) {
        onRetry(error, attempt + 1, delay);
      }

      // 지연 후 재시도
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // 모든 시도 실패 시
  throw lastError;
};
