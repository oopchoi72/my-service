import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { logError, getUserFriendlyErrorMessage, ApiError } from "../utils";

/**
 * React Query 에러 처리를 위한 커스텀 훅
 * @returns 에러 처리 함수들
 */
export const useQueryErrorHandler = () => {
  const queryClient = useQueryClient();

  /**
   * 에러 발생 시 처리 함수
   * @param error 발생한 에러 객체
   * @param context 에러 컨텍스트 정보
   */
  const handleError = useCallback((error: unknown, context?: string) => {
    // 에러 로깅
    logError(error, context || "Query Error");

    // 인증 에러 (401)인 경우 특별 처리
    if (error instanceof ApiError && error.status === 401) {
      // 예: 로그인 페이지로 리디렉션 또는 토큰 리프레시 로직
      console.warn("인증이 필요합니다. 로그인 페이지로 이동합니다.");
    }

    // 모든 에러는 사용자 친화적 메시지로 변환
    return getUserFriendlyErrorMessage(error);
  }, []);

  /**
   * 특정 쿼리 무효화
   * @param queryKey 무효화할 쿼리 키
   */
  const invalidateQuery = useCallback(
    (queryKey: unknown[]) => {
      queryClient.invalidateQueries({ queryKey });
    },
    [queryClient]
  );

  /**
   * 모든 쿼리 캐시 리셋
   */
  const resetQueries = useCallback(() => {
    queryClient.resetQueries();
  }, [queryClient]);

  return {
    handleError,
    invalidateQuery,
    resetQueries,
  };
};

export default useQueryErrorHandler;
