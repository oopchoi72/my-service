import React from "react";
import { BaseProps } from "../../types";
import { isToday, isSameDay, isWeekend, isSunday, format } from "date-fns";

interface CalendarDayProps extends BaseProps {
  date: Date;
  isCurrentMonth: boolean;
  events?: { id: string; title: string }[];
  onClick?: () => void;
  onEventClick?: (eventId: string) => void;
}

/**
 * 캘린더 날짜 컴포넌트
 * 달력의 개별 날짜 셀
 */
const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  isCurrentMonth,
  events = [],
  onClick,
  onEventClick,
  className = "",
  ...props
}) => {
  // 날짜 클래스 계산
  const dateClasses = [
    isToday(date) ? "font-bold text-blue-700" : "",
    isCurrentMonth ? "text-gray-800" : "text-gray-400",
    isSunday(date) ? "text-red-500" : "",
    isWeekend(date) && !isSunday(date) ? "text-indigo-500" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // 컨테이너 클래스 계산
  const dayClasses = [
    "day-cell p-1 sm:p-1.5 min-h-[60px] sm:min-h-24 border border-gray-200 rounded-sm transition-all",
    isCurrentMonth ? "bg-white hover:bg-blue-50" : "bg-gray-50",
    isToday(date) ? "border-blue-500 border-2 shadow-sm" : "",
    "cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={dayClasses} onClick={onClick} {...props}>
      <div className="flex flex-col h-full">
        {/* 날짜 표시 */}
        <div className="text-right mb-1">
          <span
            className={`text-xs sm:text-sm inline-block w-5 h-5 sm:w-6 sm:h-6 rounded-full leading-5 sm:leading-6 text-center ${dateClasses} ${
              isToday(date) ? "bg-blue-100" : ""
            }`}
          >
            {format(date, "d")}
          </span>
        </div>

        {/* 이벤트 목록 */}
        <div className="flex-grow overflow-y-auto max-h-12 sm:max-h-16 space-y-0.5 sm:space-y-1">
          {events.map((event) => (
            <div
              key={event.id}
              className="event text-xs bg-blue-100 text-blue-800 rounded-sm px-1 sm:px-1.5 py-0.5 mb-0.5 truncate cursor-pointer hover:bg-blue-200 transition-colors shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                onEventClick?.(event.id);
              }}
              title={event.title}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarDay;
