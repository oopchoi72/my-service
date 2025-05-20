/**
 * 타입 정의 인덱스 파일
 */

export * from "./event";
export * from "./form";
export * from "./hooks";
export * from "./utils";
export * from "./components";

/**
 * API 응답 기본 인터페이스
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  error?: string | string[];
}

/**
 * 컴포넌트 공통 속성 인터페이스
 */
export interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}
