/**
 * 월별 날짜 범위 계산 유틸리티
 * YYYY-MM 형식의 문자열에서 해당 월의 첫날과 마지막 날을 계산
 *
 * @param monthString YYYY-MM 형식의 월 문자열 (예: "2023-05")
 * @returns { startDate: Date, endDate: Date } 해당 월의 시작일과 종료일
 */
export const parseMonthlyDateRange = (
  monthString: string
): { startDate: Date; endDate: Date } => {
  // YYYY-MM 형식 검증
  const regex = /^\d{4}-\d{2}$/;
  if (!regex.test(monthString)) {
    throw new Error("월 형식은 YYYY-MM이어야 합니다 (예: 2023-05)");
  }

  const [yearStr, monthStr] = monthString.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // JavaScript에서 월은 0부터 시작

  if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
    throw new Error("유효하지 않은 연도 또는 월입니다");
  }

  // 해당 월의 첫 날
  const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

  // 해당 월의 마지막 날 (다음 달의 첫날 - 1밀리초)
  const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

  return { startDate, endDate };
};
