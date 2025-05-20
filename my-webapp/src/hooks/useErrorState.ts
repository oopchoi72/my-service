import { useState, useCallback } from "react";
import {
  getUserFriendlyErrorMessage,
  logError,
  ApiError,
  convertToApiError,
} from "../utils";

/**
 * 에러 상태를 관리하는 커스텀 훅
 * @returns 에러 상태와 제어 함수
 */
export const useErrorState = () => {
  const [error, setError] = useState<Error | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // 에러 설정
  const setErrorState = useCallback((err: unknown, context?: string) => {
    if (!err) {
      setError(null);
      setErrorMessage("");
      return;
    }

    // 에러 로깅
    logError(err, context);

    // ApiError로 변환
    const apiError = err instanceof ApiError ? err : convertToApiError(err);

    // 상태 업데이트
    setError(apiError);
    setErrorMessage(getUserFriendlyErrorMessage(apiError));
  }, []);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
    setErrorMessage("");
  }, []);

  // 비동기 함수 실행 시 자동 에러 처리
  const withErrorHandling = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      context?: string
    ): Promise<T | null> => {
      try {
        clearError();
        return await asyncFn();
      } catch (err) {
        setErrorState(err, context);
        return null;
      }
    },
    [clearError, setErrorState]
  );

  return {
    error,
    errorMessage,
    isError: !!error,
    setError: setErrorState,
    clearError,
    withErrorHandling,
  };
};

export default useErrorState;
