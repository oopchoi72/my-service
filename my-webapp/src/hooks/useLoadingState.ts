import { useState, useCallback } from "react";

/**
 * 로딩 상태를 관리하는 커스텀 훅
 * @param initialState 초기 로딩 상태 (기본값: false)
 * @returns 로딩 상태와 제어 함수
 */
export const useLoadingState = (initialState = false) => {
  const [isLoading, setIsLoading] = useState<boolean>(initialState);

  // 로딩 시작
  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  // 로딩 종료
  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // 비동기 함수 실행 시 자동 로딩 상태 관리
  const withLoading = useCallback(
    async <T>(asyncFn: () => Promise<T>): Promise<T> => {
      try {
        startLoading();
        return await asyncFn();
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
};

export default useLoadingState;
