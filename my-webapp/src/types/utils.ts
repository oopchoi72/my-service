/**
 * 유틸리티 함수 관련 타입 정의
 */

// 날짜 포맷 옵션
export interface DateFormatOptions {
  year?: boolean;
  month?: boolean;
  day?: boolean;
  hour?: boolean;
  minute?: boolean;
  second?: boolean;
  weekday?: boolean;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
}

// 날짜 표시 형식
export type DateDisplayFormat =
  | "date-only"
  | "time-only"
  | "datetime"
  | "month-year"
  | "relative";

// 로컬 스토리지 아이템 정의
export interface StorageItem<T> {
  key: string;
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

// 디바운스 함수 타입
export type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

// 쓰로틀 함수 타입
export type ThrottledFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};
