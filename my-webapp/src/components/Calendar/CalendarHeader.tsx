import React, { useState } from "react";
import { BaseProps } from "../../types";
import { format, addYears, subYears, setMonth, setYear } from "date-fns";
import { ko } from "date-fns/locale";

interface CalendarHeaderProps extends BaseProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onDateChange?: (date: Date) => void;
}

/**
 * 캘린더 헤더 컴포넌트
 * 년/월 표시 및 이전/다음 달 네비게이션
 */
const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onDateChange,
  className = "",
  ...props
}) => {
  // date-fns를 사용한 날짜 포맷팅
  const formatMonth = (date: Date): string => {
    return format(date, "yyyy년 MMMM", { locale: ko });
  };

  // 드롭다운 표시 상태
  const [showMonthDropdown, setShowMonthDropdown] = useState<boolean>(false);
  const [showYearDropdown, setShowYearDropdown] = useState<boolean>(false);

  // 월 목록
  const months = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  // 연도 범위 (현재 연도 기준 ±5년)
  const currentYear = currentDate.getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // 월 변경 핸들러
  const handleMonthChange = (monthIndex: number) => {
    if (onDateChange) {
      const newDate = setMonth(currentDate, monthIndex);
      onDateChange(newDate);
    }
    setShowMonthDropdown(false);
  };

  // 연도 변경 핸들러
  const handleYearChange = (year: number) => {
    if (onDateChange) {
      const newDate = setYear(currentDate, year);
      onDateChange(newDate);
    }
    setShowYearDropdown(false);
  };

  // 이전 연도로 이동
  const handlePrevYear = () => {
    if (onDateChange) {
      onDateChange(subYears(currentDate, 1));
    }
  };

  // 다음 연도로 이동
  const handleNextYear = () => {
    if (onDateChange) {
      onDateChange(addYears(currentDate, 1));
    }
  };

  return (
    <div className={`${className}`} {...props}>
      {/* 캘린더 타이틀 및 네비게이션 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <span
            className="cursor-pointer hover:text-blue-500 transition-colors px-1 py-0.5 rounded hover:bg-blue-50"
            onClick={() => setShowYearDropdown(!showYearDropdown)}
          >
            {format(currentDate, "yyyy년", { locale: ko })}
          </span>{" "}
          <span
            className="cursor-pointer hover:text-blue-500 transition-colors px-1 py-0.5 rounded hover:bg-blue-50 ml-1"
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
          >
            {format(currentDate, "MMMM", { locale: ko })}
          </span>
        </h2>

        <div className="flex space-x-3">
          <button
            onClick={onToday}
            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="이번 달로 이동"
          >
            오늘
          </button>

          <div className="flex border rounded-md overflow-hidden shadow-sm">
            <button
              onClick={handlePrevYear}
              className="px-2 sm:px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors border-r border-gray-200 text-gray-600"
              aria-label="이전 연도로 이동"
            >
              {"<<"}
            </button>
            <button
              onClick={onPrevMonth}
              className="px-2 sm:px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors border-r border-gray-200 text-gray-600"
              aria-label="이전 달로 이동"
            >
              {"<"}
            </button>
            <button
              onClick={onNextMonth}
              className="px-2 sm:px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors border-r border-gray-200 text-gray-600"
              aria-label="다음 달로 이동"
            >
              {">"}
            </button>
            <button
              onClick={handleNextYear}
              className="px-2 sm:px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600"
              aria-label="다음 연도로 이동"
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>

      {/* 월 선택 드롭다운 */}
      {showMonthDropdown && (
        <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md border border-gray-200 py-1 w-36 animate-fadeIn">
          {months.map((month, index) => (
            <div
              key={month}
              className={`px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${
                currentDate.getMonth() === index
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700"
              }`}
              onClick={() => handleMonthChange(index)}
            >
              {month}
            </div>
          ))}
        </div>
      )}

      {/* 연도 선택 드롭다운 */}
      {showYearDropdown && (
        <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md border border-gray-200 py-1 w-24 animate-fadeIn">
          {years.map((year) => (
            <div
              key={year}
              className={`px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${
                currentDate.getFullYear() === year
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700"
              }`}
              onClick={() => handleYearChange(year)}
            >
              {year}년
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarHeader;
