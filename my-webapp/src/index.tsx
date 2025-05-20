import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isRetryableError } from "./utils";

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // 5번 이상 재시도 방지
        if (failureCount >= 4) return false;

        // 재시도 가능한 에러인지 확인
        return isRetryableError(error);
      },
      retryDelay: (attemptIndex) => {
        // 지수 백오프 (1초 -> 2초 -> 4초 -> 8초)
        return Math.min(1000 * 2 ** attemptIndex, 8000);
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5분
    },
    mutations: {
      retry: (failureCount, error) => {
        // 변경 작업은 최대 2번만 재시도
        if (failureCount >= 2) return false;

        // 재시도 가능한 에러인지 확인
        return isRetryableError(error);
      },
      retryDelay: (attemptIndex) => {
        // 지수 백오프 (1초 -> 2초)
        return 1000 * 2 ** attemptIndex;
      },
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
