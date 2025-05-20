import React from "react";
import { BaseProps } from "../../types";

interface ErrorMessageProps extends BaseProps {
  message?: string;
  error?: Error | null;
  variant?: "alert" | "toast" | "inline";
  onRetry?: () => void;
}

/**
 * 오류 메시지를 사용자 친화적으로 표시하는 컴포넌트
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  error,
  variant = "inline",
  onRetry,
  className = "",
  ...props
}) => {
  // 실제 표시할 메시지 결정
  const displayMessage =
    message || error?.message || "알 수 없는 오류가 발생했습니다";

  // 변형별 컨테이너 스타일
  const containerStyles = {
    alert: "bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded-r-lg",
    toast:
      "bg-red-500 text-white p-4 rounded-lg shadow-lg fixed bottom-5 right-5 z-50 max-w-md animate-fade-in",
    inline: "text-red-500",
  };

  return (
    <div
      className={`${containerStyles[variant]} ${className}`}
      role="alert"
      {...props}
    >
      <div className="flex items-start">
        {variant !== "inline" && (
          <div className="mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${
                variant === "alert" ? "text-red-500" : "text-white"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        )}
        <div>
          <p
            className={`text-sm ${
              variant === "inline"
                ? "text-red-500"
                : variant === "alert"
                ? "text-red-700"
                : "text-white"
            }`}
          >
            {displayMessage}
          </p>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-3 py-1 text-xs font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          다시 시도
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
