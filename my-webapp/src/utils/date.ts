/**
 * 날짜 관련 유틸리티 함수
 */

import { DateFormatOptions, DateDisplayFormat } from "../types";

/**
 * 날짜 포맷팅
 * @param date 포맷팅할 날짜 (Date 객체 또는 ISO 날짜 문자열)
 * @param options 포맷 옵션
 * @returns 포맷팅된 문자열
 */
export const formatDate = (
  date: Date | string,
  options: DateFormatOptions = {}
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    console.error("유효하지 않은 날짜:", date);
    return "유효하지 않은 날짜";
  }

  const {
    year = true,
    month = true,
    day = true,
    hour = false,
    minute = false,
    second = false,
    weekday = false,
    dateStyle,
    timeStyle,
  } = options;

  // Intl.DateTimeFormat 옵션
  const formatOptions: Intl.DateTimeFormatOptions = {};

  // 날짜 스타일이 지정된 경우
  if (dateStyle) {
    formatOptions.dateStyle = dateStyle;
  } else {
    // 개별 날짜 요소 설정
    if (year) formatOptions.year = "numeric";
    if (month) formatOptions.month = "long";
    if (day) formatOptions.day = "numeric";
    if (weekday) formatOptions.weekday = "long";
  }

  // 시간 스타일이 지정된 경우
  if (timeStyle) {
    formatOptions.timeStyle = timeStyle;
  } else {
    // 개별 시간 요소 설정
    if (hour) formatOptions.hour = "2-digit";
    if (minute) formatOptions.minute = "2-digit";
    if (second) formatOptions.second = "2-digit";
  }

  return new Intl.DateTimeFormat("ko-KR", formatOptions).format(dateObj);
};

/**
 * 날짜 표시 형식에 따라 포맷팅
 * @param date 포맷팅할 날짜
 * @param format 표시 형식
 * @returns 포맷팅된 문자열
 */
export const formatDateByType = (
  date: Date | string,
  format: DateDisplayFormat = "datetime"
): string => {
  switch (format) {
    case "date-only":
      return formatDate(date, { hour: false, minute: false });

    case "time-only":
      return formatDate(date, {
        year: false,
        month: false,
        day: false,
        hour: true,
        minute: true,
      });

    case "datetime":
      return formatDate(date, { hour: true, minute: true });

    case "month-year":
      return formatDate(date, { day: false });

    case "relative":
      return formatRelativeTime(date);

    default:
      return formatDate(date);
  }
};

/**
 * 상대적인 시간 표시 (예: '3일 전', '방금 전')
 * @param date 대상 날짜
 * @returns 상대적 시간 문자열
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffMonth / 12);

  if (diffYear > 0) return `${diffYear}년 전`;
  if (diffMonth > 0) return `${diffMonth}개월 전`;
  if (diffDay > 0) return `${diffDay}일 전`;
  if (diffHour > 0) return `${diffHour}시간 전`;
  if (diffMin > 0) return `${diffMin}분 전`;
  if (diffSec > 10) return `${diffSec}초 전`;

  return "방금 전";
};

/**
 * 날짜가 오늘인지 확인
 * @param date 확인할 날짜
 * @returns 오늘인 경우 true
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * 날짜가 같은지 확인 (시간 무시)
 * @param date1 첫 번째 날짜
 * @param date2 두 번째 날짜
 * @returns 같은 날짜인 경우 true
 */
export const isSameDate = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  const d1 = typeof date1 === "string" ? new Date(date1) : date1;
  const d2 = typeof date2 === "string" ? new Date(date2) : date2;

  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};
