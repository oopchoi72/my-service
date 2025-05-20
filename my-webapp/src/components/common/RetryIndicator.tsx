import React, { useState, useEffect } from "react";
import { BaseProps } from "../../types";

interface RetryEvent {
  error: any;
  attempt: number;
  maxAttempts: number;
  delay: number;
  endpoint: string;
}

interface RetryIndicatorProps extends BaseProps {
  position?: "top" | "bottom";
  autoHide?: boolean;
  hideDelay?: number;
}

/**
 * API 재시도 진행 상황을 시각적으로 표시하는 컴포넌트
 */
const RetryIndicator: React.FC<RetryIndicatorProps> = ({
  position = "bottom",
  autoHide = true,
  hideDelay = 5000,
  className = "",
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [retryInfo, setRetryInfo] = useState<RetryEvent | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  // 재시도 이벤트 리스너 등록
  useEffect(() => {
    const handleRetryEvent = (event: Event) => {
      const detail = (event as CustomEvent<RetryEvent>).detail;
      setRetryInfo(detail);
      setIsVisible(true);

      // 자동 숨김 설정
      if (autoHide && hideTimeout) {
        clearTimeout(hideTimeout);
      }

      if (autoHide) {
        const timeout = setTimeout(() => {
          setIsVisible(false);
        }, hideDelay);
        setHideTimeout(timeout);
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener("api:retry", handleRetryEvent);

    // 컴포넌트 언마운트 시 정리
    return () => {
      window.removeEventListener("api:retry", handleRetryEvent);
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [autoHide, hideDelay, hideTimeout]);

  // 표시할 내용이 없으면 렌더링하지 않음
  if (!isVisible || !retryInfo) {
    return null;
  }

  // 진행률 계산 (1/3, 2/3 등)
  const progress = Math.round(
    (retryInfo.attempt / retryInfo.maxAttempts) * 100
  );

  // 위치에 따른 스타일 클래스
  const positionClass = position === "top" ? "top-0" : "bottom-0";

  return (
    <div
      className={`fixed left-0 w-full ${positionClass} z-50 px-4 py-2 bg-yellow-50 border-t border-yellow-200 shadow-md transition-all duration-300 ${className}`}
      {...props}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold mr-1">재연결 중...</span>
            <span>
              {retryInfo.attempt}번째 시도 ({retryInfo.maxAttempts}회 중)
            </span>
          </p>
          <p className="text-xs text-yellow-600 truncate">
            {new URL(retryInfo.endpoint, window.location.origin).pathname}
          </p>
        </div>

        {/* 진행 표시줄 */}
        <div className="w-24 h-2 bg-yellow-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default RetryIndicator;
