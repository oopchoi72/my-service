import { useState, useCallback } from "react";
import { AsyncState, Status } from "../types";
import { getUserFriendlyErrorMessage, logError } from "../utils";

/**
 * 비동기 작업의 상태를 관리하는 커스텀 훅
 * @returns 비동기 상태와 제어 함수
 */
export const useAsync = <T>() => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    status: "idle" as Status,
  });

  // 상태 리셋
  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      status: "idle",
    });
  }, []);

  // 로딩 시작
  const setLoading = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: "loading",
    }));
  }, []);

  // 성공 상태 설정
  const setSuccess = useCallback((data: T) => {
    setState({
      data,
      error: null,
      status: "success",
    });
  }, []);

  // 에러 상태 설정
  const setError = useCallback((error: Error) => {
    logError(error);
    setState({
      data: null,
      error,
      status: "error",
    });
  }, []);

  // 비동기 함수 실행
  const execute = useCallback(
    async <R extends T>(
      asyncFn: () => Promise<R>,
      context?: string
    ): Promise<R | null> => {
      try {
        setLoading();
        const data = await asyncFn();
        setSuccess(data);
        return data;
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error(getUserFriendlyErrorMessage(err));

        // 에러 로깅
        logError(error, context);

        setError(error);
        return null;
      }
    },
    [setLoading, setSuccess, setError]
  );

  return {
    ...state,
    isIdle: state.status === "idle",
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    execute,
    setSuccess,
    setError,
    setLoading,
    reset,
  };
};

export default useAsync;
